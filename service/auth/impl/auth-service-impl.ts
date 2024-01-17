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
      msg: "invalid data",
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
    return { msg: "email already in use", value: null };
  }
  if (usr?.username === input.username) {
    return { msg: "username already in use", value: null };
  }
  if (usr?.phone === input.phone) {
    return { msg: "phone number already in use", value: null };
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
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await UserService.instance.fetchByEmail(
    existingToken.email,
  );

  if (!existingUser.value) {
    return { error: "Email does not exist!" };
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

  return { success: "Email verified!" };
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
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser || !existingUser.password) {
    return { error: "Email not found!" };
  }

  const passwordResetToken =
    await TokenService.instance.generatePasswordResetToken(email);
  await MailService.instance.sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Reset email sent!" };
}

export const _newPassword = async (
  values: NewPasswordInput,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken =
    await TokenService.instance.getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const { value: existingUser } = await UserService.instance.fetchByEmail(
    existingToken.email,
  );
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
};

export async function _login(values: LoginInput): Promise<{
  error?: string;
  success?: string;
  redirect?: boolean;
  twoFactor?: boolean;
}> {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    await _sendConfirmationCode(existingUser.email);
    return { success: "Confirmation email sent!" };
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
      return { error: "Invalid credentials!" };
    }
  }

  return { redirect: true, success: "Logged In" };
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
      success: "Confirmation code sent. Please check your Email.",
    };
  }

  const twoFactorToken =
    await TokenService.instance.getTwoFactorTokenByEmail(email);
  if (!twoFactorToken) {
    return { error: "Invalid code!" };
  }

  if (twoFactorToken.token !== code) {
    return { error: "Invalid code!" };
  }

  const hasExpired = new Date(twoFactorToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Code expired!" };
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
