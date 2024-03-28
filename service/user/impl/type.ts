export type UserReadDto = {
  id: string;
  name: string | null;
  surname: string | null;
  patronymic: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
  role: string;
  username: string | null;
};

export const UserSelectDto = {
  id: true,
  name: true,
  phone: true,
  email: true,
  image: true,
  role: true,
  username: true,
  surname: true,
  patronymic: true,
  emailVerified: true,
};
