import { ProjectApplication } from "@/app/types/entities"

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total:      number
    limit:      number
    offset:     number
    totalPages: number
  }
}


export interface PaginatedApplicationsResponse {
  data:  ProjectApplication[]
  meta: {
    total:    number
    page:     number
    limit:    number
    lastPage: number
  }
}