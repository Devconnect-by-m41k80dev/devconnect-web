import { get, patch } from '../http/http-methods'
import { ReactivateAccountDto, UpdateUserDto, PaginationQueryDto } from '@/app/types/dtos'
import { User } from '@/app/types/entities'
import { PaginatedResponse } from '@/app/types/pagination/pagination.types'

type MessageResponse = { message: string }

export const usersApi = {
  getMe: () =>
    get<User>('/users/me'),

  getById: (id: string) =>
    get<User>(`/users/${id}`),

  getPublic: (params?: PaginationQueryDto) =>
    get<PaginatedResponse<User>>('/users', { params }),

  updateProfile: (body: UpdateUserDto) =>
    patch<User, UpdateUserDto>('/users/me', body),

  deactivate: () =>
    patch<MessageResponse>('/users/deactivate'),

  reactivate: (body: ReactivateAccountDto) =>
    patch<MessageResponse>('/users/reactivate', body),
}