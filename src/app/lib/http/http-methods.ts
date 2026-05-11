import { ApiResponse } from '@/app/types/api/api.types'
import { httpClient } from './http-client'
import { AxiosRequestConfig } from 'axios'
import { getErrorMessage } from '../api/error.api'


export const get = async <T, P = unknown>(
  url: string,
  config?: AxiosRequestConfig<P>
): Promise<T> => {
  try {
    const res = await httpClient.get<ApiResponse<T>>(url, config)

    if (!res.data.success) {
      throw new Error(
        Array.isArray(res.data.message)
          ? res.data.message.join(", ")
          : res.data.message
      )
    }

    return res.data.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}

export const post = async <T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await httpClient.post<ApiResponse<T>>(url, body, config)

    if (!res.data.success) {
      throw new Error(
        Array.isArray(res.data.message)
          ? res.data.message.join(", ")
          : res.data.message
      )
    }

    return res.data.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}

export const patch = async <T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await httpClient.patch<ApiResponse<T>>(url, body, config)

    if (!res.data.success) {
      throw new Error(
        Array.isArray(res.data.message)
          ? res.data.message.join(", ")
          : res.data.message
      )
    }

    return res.data.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await httpClient.delete<ApiResponse<T>>(url, config)

    if (!res.data.success) {
      throw new Error(
        Array.isArray(res.data.message)
          ? res.data.message.join(", ")
          : res.data.message
      )
    }

    return res.data.data
  } catch (err: unknown) {
    throw new Error(getErrorMessage(err))
  }
}