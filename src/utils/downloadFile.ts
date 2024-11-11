import api from '@/services/REST/utils/dom_admin'

import { message } from '@/utils/message'
import { notification } from '@/utils/notification'

export const downloadFile = async (request_data: any, loaded: any) => {
  const response = await api.get<Response>(
    'admin/objects/flats/export',
    { f: request_data },
    {
      onProgress: (percent, response) => {
        loaded.val = percent
      },
      cbPreFetch: () => {
        message('Скачивание файла', 'info')
      },
      cbPostFetch: () => {},
      cbHandlerErrorResponse: (errors) => {
        message('Ошибка при скачивании файла', 'error')
      }
    }
  )

  if (!response) return

  const url = URL.createObjectURL(await response.blob())

  const filename = decodeURIComponent(response.headers.get('filename') ?? '').replace(/\+/g, ' ')

  saveFile(url, filename)

  URL.revokeObjectURL(url)
  notification({
    title: 'Успешно',
    duration: 3000,
    message: `Файл ${filename} скачан`,
    type: 'success',
    position: 'top-right'
  })
  loaded.val = 0
}

const saveFile = (url: string, filename: string) => {
  const a = document.createElement('a')
  a.href = url
  a.download = filename || ''
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
