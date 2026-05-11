import { ApplicationStatus } from "@/app/types/enums"
import { User, Project } from "@/app/types/entities"

export interface ProjectApplication {
  id:        string
  status:    ApplicationStatus
  message:   string | null
  createdAt: string
  user?:     Pick<User, 'id' | 'fullName' | 'professionalRole' | 'skills'>
  project?:  Pick<Project, 'id' | 'title' | 'status'> & {
    owner: Pick<User, 'id' | 'fullName'>
  }
}
