export default class RestApi {
  private key!: string
  private url_api: string = ''
  private url_refresh: string = ''
  private headers = {
    Accept: 'application/json',
    Authorization: '',
    'Content-Type': 'application/json'
  }
  private controller: AbortController = new AbortController()
  private is_refresh_running = false
  private cbPreFetch?: (() => void) | null
  private cbPostFetch?: (() => void) | null
  private cbHandlerErrorResponse?: ((errors?: any, controller?: AbortController) => void) | null
  private cbHandlerErrorRefreshToken?: (() => void) | null

  private static rest_api_collection: IRestApiCollection = {}

  constructor(key: string, options?: IRestApiOptions) {
    if (!options) {
      if (RestApi.rest_api_collection[key]) {
        //возвращаем instance
        return RestApi.rest_api_collection[key]
      }

      //создаем instance с дефолтными(пустыми) настройками и возвращаем его
      this.key = key

      RestApi.rest_api_collection[key] = this
      return this
    } else {
      if (RestApi.rest_api_collection[key]) {
        //изменяем конфигурацию instanc'а
        RestApi.rest_api_collection[key].url_api = options.url_api
        RestApi.rest_api_collection[key].url_refresh = options.url_refresh
        RestApi.rest_api_collection[key].headers.Authorization = `Bearer ${options.token}`
        RestApi.rest_api_collection[key].cbPreFetch = options.cbPreFetch
        RestApi.rest_api_collection[key].cbPostFetch = options.cbPostFetch
        RestApi.rest_api_collection[key].cbHandlerErrorResponse = options.cbHandlerErrorResponse
        RestApi.rest_api_collection[key].cbHandlerErrorRefreshToken = options.cbHandlerErrorRefreshToken //prettier-ignore
      } else {
        //создаем конфигурацию instance
        this.key = key
        this.url_api = options.url_api
        this.url_refresh = options.url_refresh
        this.headers.Authorization = `Bearer ${options.token}`
        this.cbPreFetch = options.cbPreFetch
        this.cbPostFetch = options.cbPostFetch
        this.cbHandlerErrorResponse = options.cbHandlerErrorResponse
        this.cbHandlerErrorRefreshToken = options.cbHandlerErrorRefreshToken

        RestApi.rest_api_collection[key] = this
        return this
      }
    }
  }

  static queryStringify(params: any, options?: { encode: boolean }): string {
    const encodeValue = (value: any): string => {
      return options?.encode ? encodeURIComponent(value) : String(value)
    }

    const encodePair = (key: string, value: any): string => {
      const encodedKey = options?.encode ? encodeURIComponent(key) : key
      if (value === null || value === undefined) return encodedKey

      if (Array.isArray(value)) return value.map((v, i) => encodePair(`${key}[${i}]`, v)).join('&')

      if (typeof value === 'object') {
        return Object.keys(value)
          .map((k) => encodePair(`${key}[${k}]`, value[k]))
          .join('&')
      }

      const encodedValue = encodeValue(value)
      return `${encodedKey}=${encodedValue}`
    }

    const encodeParams = (params: any, prefix: string = ''): string => {
      const keys = Object.keys(params)
      if (keys.length === 0) return ''

      return keys.map((key) => encodePair(prefix ? `${prefix}[${key}]` : key, params[key])).join('&')
    }

    const flattenParams = (params: any, prefix: string = ''): any => {
      const result: any = {}
      for (const key in params) {
        if (Object.hasOwnProperty.call(params, key)) {
          const value = params[key]
          const fullKey = prefix ? `${prefix}[${key}]` : key
          if (Array.isArray(value)) {
            if (value.some((item) => typeof item === 'object' || Array.isArray(item))) {
              Object.assign(result, flattenParams(value, fullKey))
            } else {
              result[fullKey] = value
            }
          } else if (typeof value === 'object') {
            Object.assign(result, flattenParams(value, fullKey))
          } else {
            result[fullKey] = value
          }
        }
      }
      return result
    }

    return encodeParams(flattenParams(params))
  }

  static parseQueryString(queryString: string): Record<string, any> {
    const params: Record<string, any> = {}
    const searchParams = new URLSearchParams(queryString)

    for (const [key, value] of searchParams.entries()) {
      let obj = params
      const keys = key.replace(/\]/g, '').split('[')

      for (let j = 0; j < keys.length; j++) {
        const currentKey = keys[j]
        const nextKey = keys[j + 1]

        if (nextKey === undefined || nextKey === '') {
          obj[currentKey] = isNaN(+value) ? value : +value
        } else if (nextKey.match(/^\d+$/)) {
          if (!Array.isArray(obj[currentKey])) {
            obj[currentKey] = []
          }
          obj = obj[currentKey]
        } else {
          if (!obj[currentKey]) {
            obj[currentKey] = {}
          }
          obj = obj[currentKey]
        }
      }
    }

    return params
  }

  private async refreshToken(url_refresh: string) {
    const response = await fetch(url_refresh, {
      method: 'POST',
      signal: this.controller.signal,
      headers: this.headers
    })

    if (response.status === 200) {
      const response_data = (await response.json()) as ResponseRefresh
      localStorage.setItem(`${this.key}_token`, response_data.payload.token)
      this.headers.Authorization = `Bearer ${response_data.payload.token}`
      document.dispatchEvent(new CustomEvent(`tokenRefreshed_${this.key}`, { detail: { success: true } })) //prettier-ignore
      return true
    }

    document.dispatchEvent(new CustomEvent(`tokenRefreshed_${this.key}`, { detail: { success: false } })) //prettier-ignore
    return false
  }

  private async useFetch<IResponseType>(
    endpoint: string,
    method: RestMethodsType,
    options?: RestApiOverrideOptionsType,
    params?: any,
    body?: any
  ): Promise<IResponseType | null> {
    try {
      if (options?.cbPreFetch !== null) {
        options?.cbPreFetch ? options.cbPreFetch() : this.cbPreFetch?.() //prettier-ignore
      }

      let search_params = ''
      if (params) {
        search_params = RestApi.queryStringify(params)
      }

      const headers = options?.headers
        ? { Authorization: this.headers.Authorization, ...options.headers }
        : this.headers
      const _body = body instanceof FormData ? body : JSON.stringify(body)
      const url_api = options?.url_api ?? this.url_api
      const url = `${url_api}${endpoint}${search_params ? `?${search_params}` : ''}`
      const response = await fetch(url, { signal: this.controller.signal, method, body: _body, headers })

      if (options?.onProgress && response.body) {
        const contentLength = response.headers.get('content-length') || ''
        const total = parseInt(contentLength, 10)
        let v = 0
        const onProgress = (chunk?: Uint8Array) => {
          if (!chunk?.length) {
            v = 0
            return
          }
          v += chunk.length
          options.onProgress?.(Math.round((v / total) * 100), response)
        }

        const transformStream = new TransformStream({
          transform(chunk, controller) {
            onProgress(chunk)
            controller.enqueue(chunk)
          }
        })

        response.body.pipeThrough(transformStream)

        const newResponse = new Response(transformStream.readable, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText
        })

        return this.handleResponse(newResponse, {}, options, endpoint, method, params, body)
      } else {
        const response_json = await response.json()
        return this.handleResponse(response, response_json, options, endpoint, method, params, body)
      }
    } catch (error) {
      if (options?.cbHandlerErrorResponse !== null) {
        options?.cbHandlerErrorResponse
          ? options?.cbHandlerErrorResponse(error, this.controller)
          : this.cbHandlerErrorResponse?.(error, this.controller)
      }
      if (error!.name == 'AbortError') {
        throw error
      }

      return null
    } finally {
      if (options?.cbPostFetch !== null) {
        options?.cbPostFetch ? options.cbPostFetch() : this.cbPostFetch?.()
      }
    }
  }

  private async handleResponse<IResponseType>(
    response: Response,
    response_json: any,
    options: RestApiOverrideOptionsType | undefined,
    endpoint: string,
    method: RestMethodsType,
    params: any,
    body: any
  ): Promise<IResponseType | null> {
    if (response.status === 401 && !this.is_refresh_running) {
      this.is_refresh_running = true
      const is_success = await this.refreshToken(options?.url_refresh ?? this.url_refresh)
      this.is_refresh_running = false
      if (is_success) {
        return this.useFetch(endpoint, method, options, params, body)
      } else {
        if (options?.cbHandlerErrorRefreshToken !== null) {
          options?.cbHandlerErrorRefreshToken
            ? options.cbHandlerErrorRefreshToken()
            : this.cbHandlerErrorRefreshToken?.()
        }
        return null
      }
    } else if (response.status === 401) {
      return new Promise((res) => {
        document.addEventListener(
          `tokenRefreshed_${this.key}`,
          async (event: any) => {
            if (event?.detail?.success) {
              const response = await this.useFetch<IResponseType>(endpoint, method, options, params, body)
              res(response)
            } else {
              res(null)
            }
          },
          { once: true }
        )
      })
    } else if (response.status < 400) {
      if (options?.onProgress) {
        return response
      }
      if (response_json.meta) {
        return response_json
      } else {
        return response_json.payload
      }
    } else {
      if (options?.cbHandlerErrorResponse !== null) {
        options?.cbHandlerErrorResponse
          ? options?.cbHandlerErrorResponse(response_json)
          : this.cbHandlerErrorResponse?.(response_json)
      }
      return null
    }
  }

  public get<IResponseType>(
    endpoint: string,
    params?: any,
    options?: RestApiOverrideOptionsType
  ): Promise<IResponseType | null> {
    return this.useFetch<IResponseType>(endpoint, 'GET', options, params)
  }

  public post<IResponseType>(
    endpoint: string,
    body?: any,
    params?: any,
    options?: RestApiOverrideOptionsType
  ): Promise<IResponseType | null> {
    return this.useFetch<IResponseType>(endpoint, 'POST', options, params, body)
  }

  public put<IResponseType>(
    endpoint: string,
    body?: any,
    params?: any,
    options?: RestApiOverrideOptionsType
  ): Promise<IResponseType | null> {
    return this.useFetch<IResponseType>(endpoint, 'PUT', options, params, body)
  }

  public patch<IResponseType>(
    endpoint: string,
    body?: any,
    params?: any,
    options?: RestApiOverrideOptionsType
  ): Promise<IResponseType | null> {
    return this.useFetch<IResponseType>(endpoint, 'PATCH', options, params, body)
  }

  public delete<IResponseType>(
    endpoint: string,
    params?: any,
    body?: any,
    options?: Partial<IRestApiOptions>
  ): Promise<IResponseType | null> {
    return this.useFetch<IResponseType>(endpoint, 'DELETE', options, params, body)
  }
}

interface IRestApiOptions {
  url_api: string
  url_refresh: string
  token: string
  cbPreFetch?: (() => void) | null
  cbPostFetch?: (() => void) | null
  cbHandlerErrorResponse?: ((errors?: any, controller?: AbortController) => void) | null
  cbHandlerErrorRefreshToken?: (() => void) | null
  onProgress?: (percent: number, response: Response) => void // Новый колбэк onProgress
}

export type RestApiOverrideOptionsType = Partial<Omit<IRestApiOptions, 'token'>> & {
  headers?: Record<string, string>
}

interface IRestApiCollection {
  [index: string]: RestApi
}

interface ResponseRefresh {
  payload: {
    token: string
  }
}

type RestMethodsType = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
