import RestApi from '@/services/REST/utils/RestApi'

import { BASE_URL } from '@/utils/initRestApiConfig'
import { message } from '@/utils/message'
import { notification } from '@/utils/notification'

export const downloadFile = async (request_data: any, loaded: any) => {
  if (!Object.keys(request_data).includes('complex')) return message('Не выбран ЖК', 'error')

  const t = localStorage.getItem('dom_admin_token')

  if (!t) return

  const token = 'Bearer ' + t
  const params = RestApi.queryStringify({ f: request_data })
  const uri = `${BASE_URL}admin/objects/flats/export${params ? `?${params}` : ''}`

  message('Скачивание файла', 'info')

  try {
    const response = await fetch(uri, { headers: { Authorization: token } })

    if (!response || !response.body || response.status === 500) return message('Ошибка при скачивании файла', 'error')

    const contentLength = response.headers.get('content-length') || ''
    const total = parseInt(contentLength, 10)

    const onProgress = (chunk?: Uint8Array) => {
      if (!chunk?.length) {
        loaded.val = 0
        return
      }
      loaded.val += Math.round((chunk.length / total) * 100)
    }

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        onProgress(chunk)
        controller.enqueue(chunk)
      }
    })

    response.body.pipeThrough(transformStream)

    const newResponse = new Response(transformStream.readable)

    const url = URL.createObjectURL(await newResponse.blob())

    const filename = decodeURIComponent(response.headers.get('filename') ?? '').replace(/\+/g, ' ')

    saveFile(url, filename)

    onProgress()

    URL.revokeObjectURL(url)
    notification({
      title: 'Успешно',
      duration: 3000,
      message: `Файл ${filename} скачан`,
      type: 'success',
      position: 'top-right'
    })
  } catch (e) {
    message('Ошибка при скачивании файла', 'error')
  }
}

const saveFile = (url: string, filename: string) => {
  const a = document.createElement('a')
  a.href = url
  a.download = filename || ''
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
