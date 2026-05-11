import { ProjectStatus } from "@/app/types/enums"
import { User, ProjectMember } from "@/app/types/entities"

export interface Project {
  id:            string
  title:         string
  description:   string
  techStack:     string[]
  repositoryUrl: string | null
  demoUrl:       string | null
  docsUrl:       string | null
  status:        ProjectStatus
  isActive:      boolean
  createdAt:     string
  updatedAt:     string
  deletedAt:     string | null
  owner:         Pick<User, 'id' | 'fullName'>
  members?:      ProjectMember[]
}