import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalConfirmStore = defineStore('modal_confirm_store', () => {
  const is_open_modal = ref<boolean>(false)
  const fn_ok = ref<Function>()
  const callback = ref<((uid: string) => Promise<void>) | null>(null)
  const title_text = ref('')
  const openModal = (f: Function) => {
    is_open_modal.value = !!(fn_ok.value = f)
  }
  const closeModal = () => {
    is_open_modal.value = !!(fn_ok.value = undefined)
  }
  const handle = async () => {
    await callback.value?.(fn_ok.value?.())
    closeModal()
  }

  const $reset = () => {
    is_open_modal.value = false
    fn_ok.value = undefined
    callback.value = null
    title_text.value = ''
  }
  return { is_open_modal, title_text, callback, openModal, closeModal, handle, $reset }
})
