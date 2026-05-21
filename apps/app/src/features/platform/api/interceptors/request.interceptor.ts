import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { supabase } from '@/features/platform/supabase/supabase.client'
import { parseDynamicKeys } from '../helpers'

const requestInterceptor = async (requestConfig: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  if (requestConfig.url) {
    requestConfig.url = parseDynamicKeys(requestConfig.url, requestConfig.dynamicKeys as TIndexedObject | undefined)
  }

  const { data } = await supabase.auth.getSession()
  const accessToken = data.session?.access_token

  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`
  }

  return requestConfig
}

const requestErrorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

export {
  requestInterceptor,
  requestErrorInterceptor
}
