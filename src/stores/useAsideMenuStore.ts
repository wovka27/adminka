import { defineStore } from 'pinia'
import { ref } from 'vue'

import { type MenuType, fetchGetAsideMenu } from '@/services/REST/dom_admin/aside_menu'

export const useAsideMenuStore = defineStore('aside_menu', () => {
  const is_aside_menu_open = ref(true)
  const aside_menu = ref<MenuType[]>([])

  const setAsideMenu = async (): Promise<boolean> => !!(aside_menu.value = (await fetchGetAsideMenu()) || []).length

  const $reset = () => {
    is_aside_menu_open.value = true
    aside_menu.value = []
  }

  return {
    is_aside_menu_open,
    aside_menu,

    setAsideMenu,
    $reset
  }
})
