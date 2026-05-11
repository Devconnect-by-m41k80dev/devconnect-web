import { get } from '../http/http-methods'

export interface PlatformStats {
  projects:     number
  users:        number
  applications: number
}

export const statsApi = {
  getStats: () => get<PlatformStats>('/stats'),
}
