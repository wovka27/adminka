// @ts-nocheck
import { useAsideMenuStore } from '@/stores'

import type { MenuType } from '@/services/REST/dom_admin/aside_menu'

export const findValueByPathAndKeyInAsideMenu = (path: string, key: string): string => {
  const aside_menu_state = useAsideMenuStore()
  const slug = path.slice(1)

  return search(aside_menu_state.aside_menu, key, slug)
}

const getValue = (v?: string): string => (v && v.includes('?') ? v.split('?')[0] : v || '')

const search = (nodes: MenuType[], key: string, slug: string): string => {
  for (const node of nodes) {
    if ('children' in node && node.children) {
      const result = search(node.children, key, slug)
      if (result) return result
    }

    if (node.slug === slug) return getValue(node[key])
  }
  return ''
}
