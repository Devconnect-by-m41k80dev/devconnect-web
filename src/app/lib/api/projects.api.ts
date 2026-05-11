import { get, post, patch, del } from '../http/http-methods'
import {
  ApplyProjectDto,
  CreateProjectDto,
  GetProjectsDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@/app/types/dtos'
import { Project, ProjectApplication, ProjectMember } from '@/app/types/entities'
import { AppliedProject } from '@/app/types/entities/applied-project.entity'
import {
  PaginatedApplicationsResponse,
  PaginatedResponse,
} from '@/app/types/pagination/pagination.types'

type MessageResponse = { message: string }

export const projectsApi = {
  create: (body: CreateProjectDto) =>
    post<ProjectResponseDto>('/projects', body),

  getAll: (params?: GetProjectsDto) =>
    get<PaginatedResponse<Project>>('/projects', { params }),

  getById: (id: string) =>
    get<Project>(`/projects/${id}`),

  update: (id: string, body: UpdateProjectDto) =>
    patch<Project, UpdateProjectDto>(`/projects/${id}`, body),

  remove: (id: string) =>
    del<MessageResponse>(`/projects/${id}`),

  getMembers: (id: string) =>
    get<ProjectMember[]>(`/projects/${id}/members`),

  apply: (id: string, body: ApplyProjectDto) =>
    post<ProjectApplication>(`/projects/${id}/apply`, body),

  getApplications: (id: string, params?: { page?: number; limit?: number }) =>
    get<PaginatedApplicationsResponse>(`/projects/${id}/applications`, { params }),

  acceptApplication: (applicationId: string) =>
    patch<MessageResponse>(`/projects/applications/${applicationId}/accept`),

  rejectApplication: (applicationId: string) =>
    patch<MessageResponse>(`/projects/applications/${applicationId}/reject`),

  // Returns AppliedProject[] — different shape from ProjectApplication
  getApplied: () =>
    get<AppliedProject[]>('/projects/applied'),

  discover: () =>
    get<(Project & { score: number })[]>('/projects/discover'),
}

