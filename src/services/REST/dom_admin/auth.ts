import { BASE_URL } from '@/utils/initRestApiConfig'

export const login = async (request_data: { email: string; password: string }) => {
  const response = await fetch(`${BASE_URL}auth/login`, {
    method: 'POST',
    body: JSON.stringify(request_data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return await response.json()
}
