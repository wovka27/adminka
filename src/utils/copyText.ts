import { message } from '@/utils/message'

export default (text: string) => navigator.clipboard.writeText(text).then(() => message('Скопировано'))
