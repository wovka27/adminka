import type { ElMessageBoxOptions } from 'element-plus'

export const message = (message: string, type: ElMessageBoxOptions['type'] = 'success') =>
  // @ts-ignore
  ElMessage({ type, message, showClose: true })
