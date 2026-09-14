
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ApiResponse, ApiSuccess } from '@/app/types/api/api.types'
import { getErrorMessage } from '@/app/lib/api/error.api'


const simBaseURL: string =
  process.env.NEXT_PUBLIC_SIMULATIONS_API_URL ?? 'http://localhost:3001/api'


export const simHttpClient: AxiosInstance = axios.create({
  baseURL:         simBaseURL,
  withCredentials: true,
  timeout:         15_000,
  headers:         { 'Content-Type': 'application/json' },
})


simHttpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.withCredentials = true
    return config
  },
  (error: unknown): Promise<never> => {
    return Promise.reject(error)
  },
)



simHttpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>): AxiosResponse => {
    
    const body = response.data

    if (body && typeof body === 'object' && 'success' in body) {
      if ((body as ApiSuccess<unknown>).success === true) {
        
        response.data = (body as ApiSuccess<unknown>).data as ApiResponse<unknown>
      } else {
        
        const msg = (body as { message?: string | string[] }).message
        const formatted = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error desconocido')
        return Promise.reject(new Error(formatted)) as never
      }
    }

    return response
  },

  async (error: unknown): Promise<never> => {
    
    const axiosError = error as {
      config?: AxiosRequestConfig & { _retry?: boolean }
      response?: { status?: number }
    }

    const status   = axiosError.response?.status
    const config   = axiosError.config
    const isRetry  = config?._retry === true

    
    if (status === 401 && config && !isRetry) {
      config._retry = true

      try {
        
        await simHttpClient.post('/auth/refresh')

        
        return simHttpClient(config) as Promise<never>
      } catch {
        
        if (typeof window !== 'undefined') {
          
          localStorage.removeItem('dc-auth')

          
          window.dispatchEvent(
            new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }),
          )
        }
      }
    }

    
    return Promise.reject(new Error(getErrorMessage(error)))
  },
)


export async function simGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const res = await simHttpClient.get<T>(url, config)
    return res.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}


export async function simPost<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const res = await simHttpClient.post<T>(url, body, config)
    return res.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}


export async function simPatch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const res = await simHttpClient.patch<T>(url, body, config)
    return res.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}


export async function simDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const res = await simHttpClient.delete<T>(url, config)
    return res.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}
