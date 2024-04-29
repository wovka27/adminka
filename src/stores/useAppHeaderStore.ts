import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const useAppHeaderStore = defineStore('app_header', () => {
  const breadcrumbs = ref<IAppHeaderBreadcrumbsItem[]>([])
  const handleBack = ref<null | Function>(null)
  const title = ref('')
  const docs_link = ref('')
  const btn = ref<IAppHeaderBtn | null>(null)

  const $reset = () => {
    ;[breadcrumbs.value, handleBack.value, title.value, docs_link.value, btn.value] = [[], null, '', '', null]
  }

  return {
    breadcrumbs,
    handleBack,
    title,
    docs_link,
    btn,
    $reset
  }
})

export interface IAppHeaderBtn {
  label: string
  handleClick: Function
}

export interface IAppHeaderBreadcrumbsItem {
  route?: RouteLocationRaw
  label: string
}
