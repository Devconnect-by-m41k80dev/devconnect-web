import { User } from "@/app/types/entities/index";

export interface ProjectResponseDto {
  id: string;
  title: string;
  description: string;
  techStack?: string[];
  owner: Pick<User, "id" | "fullName">;
}
