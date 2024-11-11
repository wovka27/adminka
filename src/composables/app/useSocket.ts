//@ts-nocheck
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

import RestApi from '@/services/REST/utils/RestApi'

import { BASE_URL } from '@/utils/initRestApiConfig'
import { notification } from '@/utils/notification'

export default async () => {
  window.Pusher = Pusher

  const messageListener = (e) => {
    if (!e) return

    const notification_type = new Map([
      ['common', 'info'],
      ['notice', 'warning'],
      ['warning', 'error'],
      ['success', 'success']
    ])

    notification({
      title: e.title,
      message: `${e.body}`,
      duration: 10 * 60 * 1000,
      showClose: true,
      dangerouslyUseHTMLString: true,
      type: notification_type.get(e.type),
      position: 'top-right'
    })
  }

  const wsAuth = async () => window.echo?.private('user.notification').listen('.user.message', messageListener)

  const wsInit = async () => {
    window.echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_WS_KEY,
      wsHost: import.meta.env.VITE_WS_HOST,
      wssPort: import.meta.env.VITE_WSS_PORT,
      wsPort: import.meta.env.VITE_WS_PORT,
      forceTLS: true,
      cluster: 'eu',
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
          Authorization: RestApi.rest_api_collection['dom_admin'].headers.Authorization
        }
      },
      authEndpoint: BASE_URL.replace('/api/v1', '') + 'broadcasting/auth'
    })
  }
  await wsInit()
  await wsAuth()
}
