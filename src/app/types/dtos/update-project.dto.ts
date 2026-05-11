
import { ProjectStatus } from '@/app/types/enums/index'

export interface UpdateProjectDto {
  title?:         string
  description?:   string
  techStack?:     string[]
  repositoryUrl?: string
  demoUrl?:       string
  status?:        ProjectStatus
}