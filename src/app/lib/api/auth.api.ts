import { LoginUserDto, RegisterDto } from "@/app/types/dtos";
import { User } from "@/app/types/entities";
import { post } from "../http/http-methods";

type AuthMessage = { message: string };

export const authApi = {
  register: (body: RegisterDto) =>
    post<
      Pick<User, "id" | "email" | "fullName"> & {
        professionalRole: string;
      }
    >("/auth/register", body),

  login: (body: LoginUserDto) => post<AuthMessage>("/auth/login", body),

  logout: () => post<AuthMessage>("/auth/logout"),

  refresh: () => post<AuthMessage>("/auth/refresh"),
};
