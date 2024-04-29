import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const val = ref<number>(0)

  const $reset = () => {
    val.value = 0
  }
  return { val, $reset }
})
