import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalImageStore = defineStore('modal_image', () => {
  const is_open = ref<boolean>(false)
  const image_url = ref<string>('')
  const openModal = (img_url: string) => {
    is_open.value = !!(image_url.value = img_url)
  }
  const closeModal = () => {
    is_open.value = !!(image_url.value = '')
  }

  const $reset = () => closeModal()

  return { is_open, image_url, openModal, closeModal, $reset }
})
