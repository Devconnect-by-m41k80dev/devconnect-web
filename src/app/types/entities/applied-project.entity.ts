import { ApplicationStatus, ProjectStatus } from "@/app/types/enums"

export interface AppliedProject {
  applicationId: string
  status:  ApplicationStatus
  message: string | null
  project: {
    id:     string
    title:  string
    status: ProjectStatus
    owner:  { id: string; fullName: string }
  }
}
