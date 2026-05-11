import { get } from '../http/http-methods'
import { RegisterMetadata } from '@/app/types/metadata/register-metadata.types'

export const metadataApi = {
  getRegisterMetadata: () =>
    get<RegisterMetadata>('/metadata/register'),
}