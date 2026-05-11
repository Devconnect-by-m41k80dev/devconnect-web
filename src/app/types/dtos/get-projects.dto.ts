import { ProjectStatus } from "@/app/types/enums/index";

export interface GetProjectsDto {
  page?: number;
  limit?: number;
  tech?: string | string[];
  status?: ProjectStatus | "";
  search?: string;
}
