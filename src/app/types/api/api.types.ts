export interface ApiSuccess<T> {
  success: true
  data:    T
}

export interface ApiError {
  success:    false
  statusCode: number
  message:    string | string[]
  error:      string
  timestamp:  string
  path:       string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError