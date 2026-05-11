export interface RegisterDto {
  email:              string
  password:           string
  fullName:           string
  professionalRoleId: string
  skills?:            string[]
}