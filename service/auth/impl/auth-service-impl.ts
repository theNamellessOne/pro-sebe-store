"use server";

import { genSalt, hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { LoginInput, loginSchema } from "@/schema/auth/login-schema";
import { RegisterInput } from "@/schema/auth/register-schema";
import { TokenService } from "@/service/token/token-service";
import { MailService } from "@/service/mail/mail-service";
import { UserService } from "@/service/user/user-service";
import { signIn, signOut } from "@/auth/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  NewPasswordInput,
  newPasswordSchema,
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/schema/auth/reset-password-schema";
import { Role } from "@prisma/client";

const ROUNDS = 8;

async function hashPassword(psw: string) {
  let salt = await genSalt(ROUNDS);
  return hash(psw, salt);
}

export async function _register(input: RegisterInput) {
  if (!loginSchema.safeParse(input).success) {
    return {
      msg: "Некоректні дані!",
      value: null,
    };
  }

  let usr = await prisma.user.findFirst({
    where: {
      OR: [
        { email: input.email },
        { username: input.username },
        { phone: input.phone },
      ],
    },
  });
  if (usr?.email === input.email) {
    return { msg: "Ця електронна адреса вже використовується!", value: null };
  }
  if (usr?.username === input.username) {
    return { msg: "Цей юзернейм вже використовується!", value: null };
  }
  if (usr?.phone === input.phone) {
    return { msg: "Цей номер телефону вже використовується!", value: null };
  }

  let createdUser = await prisma.user.create({
    data: {
      ...input,
      password: await hashPassword(input.password),
    },
  });

  const verificationToken =
    await TokenService.instance.generateVerificationToken(createdUser.email!);
  const status = await MailService.instance.sendVerificationMail(
    verificationToken.email,
    verificationToken.token,
  );

  return {
    value: await UserService.instance.fetchById(createdUser.id),
    msg: status,
  };
}

export async function _verify(token: string) {
  const existingToken =
    await TokenService.instance.getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Токена не існує!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Термін дії токена сплив!" };
  }

  const existingUser = await UserService.instance.fetchByEmail(
    existingToken.email,
  );

  if (!existingUser.value) {
    return { error: "Електронної адреси не знайдено!" };
  }

  await prisma.user.update({
    where: { id: existingUser.value.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Електронну адресу підтверджено!" };
}

export async function _logout() {
  const domain = process.env.BASE_URL;

  await signOut({
    redirect: true,
    redirectTo: `${domain}${DEFAULT_LOGIN_REDIRECT}`,
  });
}

export async function _resetPassword(input: ResetPasswordInput) {
  const validatedFields = resetPasswordSchema.safeParse(input);
  if (!validatedFields.success) {
    return { error: "Не коректна електронна адреса!" };
  }

  const { email } = validatedFields.data;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser || !existingUser.password) {
    return { error: "Електронної адреси не знайдено!" };
  }

  const passwordResetToken =
    await TokenService.instance.generatePasswordResetToken(email);
  await MailService.instance.sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Повідомлення про відновлення надіслано!" };
}

export const _newPassword = async (
  values: NewPasswordInput,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Відсутній токен!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Некоректні поля!" };
  }

  const { password } = validatedFields.data;

  const existingToken =
    await TokenService.instance.getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Некоректний токен!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Термін дії токена сплив!" };
  }

  const { value: existingUser } = await UserService.instance.fetchByEmail(
    existingToken.email,
  );
  if (!existingUser) {
    return { error: "Електронної адреси не знайдено!" };
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Пароль оновлено!" };
};

export async function _login(values: LoginInput): Promise<{
  error?: string;
  success?: string;
  redirect?: boolean;
  twoFactor?: boolean;
}> {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Некоректні поля!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Електронної адреси не знайдено!" };
  }

  if (!existingUser.emailVerified) {
    await _sendConfirmationCode(existingUser.email);
    return { success: "Лист для підтвердження електроннох адреси надісано!" };
  }

  if (existingUser.role !== Role.USER && existingUser.email) {
    return _handleTwoFactorLogin(email, password, existingUser.id, code);
  }

  return _signIn(email, password);
}

async function _signIn(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return { error: "Некоректні облікові дані!" };
    }
  }

  return { redirect: true, success: "Успішно зайдено!" };
}

async function _sendConfirmationCode(email: string) {
  const verificationToken =
    await TokenService.instance.generateVerificationToken(email);

  await MailService.instance.sendVerificationMail(
    verificationToken.email,
    verificationToken.token,
  );
}

async function _sendTwoFactorCode(email: string) {
  const twoFactorToken =
    await TokenService.instance.generateTwoFactorToken(email);
  await MailService.instance.sendTwoFactorMail(
    twoFactorToken.email,
    twoFactorToken.token,
  );
}

async function _handleTwoFactorLogin(
  email: string,
  password: string,
  userId: string,
  code: string | undefined,
): Promise<{
  error?: string;
  success?: string;
  redirect?: boolean;
  twoFactor?: boolean;
}> {
  if (!code) {
    await _sendTwoFactorCode(email);

    return {
      twoFactor: true,
      success: "Код підтвердження надіслано. Будь ласка, перевірте вашу електронну скриньку.",
    };
  }

  const twoFactorToken =
    await TokenService.instance.getTwoFactorTokenByEmail(email);
  if (!twoFactorToken) {
    return { error: "Некоректний код!" };
  }

  if (twoFactorToken.token !== code) {
    return { error: "Некоректний код!" };
  }

  const hasExpired = new Date(twoFactorToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Термін дії коду закінчився!" };
  }

  await prisma.twoFactorToken.delete({
    where: { id: twoFactorToken.id },
  });

  const existingConfirmation =
    await TokenService.instance.getTwoFactorConfirmationByUserId(userId);

  if (existingConfirmation) {
    await prisma.twoFactorConfirmation.delete({
      where: { id: existingConfirmation.id },
    });
  }

  await prisma.twoFactorConfirmation.create({
    data: {
      userId: userId,
    },
  });

  return _signIn(email, password);
}
