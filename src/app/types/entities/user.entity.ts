import { Role } from '@/app/types/enums'
import { ProfessionalRole, Skill } from '@/app/types/entities'

export interface User {
  id:               string
  email:            string
  fullName:         string
  bio:              string | null
  location:         string | null
  github:           string | null
  linkedin:         string | null
  portfolio:        string | null
  profileImageUrl:  string | null
  role:             Role
  isActive:         boolean
  createdAt:        string   // ISO 8601 — Date serialised by TypeORM
  updatedAt:        string
  deletedAt:        string | null
  professionalRole: ProfessionalRole | null
  skills:           Skill[]
}
