import { ProjectStatus } from '@/app/types/enums/index'

export interface CreateProjectDto {
  title:          string
  description:    string
  techStack?:     string[]
  repositoryUrl?: string
  demoUrl?:       string
  docsUrl?:       string
  status?:        ProjectStatus
}