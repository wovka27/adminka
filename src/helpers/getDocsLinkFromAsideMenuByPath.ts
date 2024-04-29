// @ts-nocheck
import { useAsideMenuStore } from '@/stores'

export default (path: string, key: string): string => {
  const aside_menu_state = useAsideMenuStore()

  const slug = path.slice(1)

  for (const { children, slug: itemSlug, [key]: itemKey } of aside_menu_state.aside_menu) {
    if (children) {
      const result = children.find((i) => i.slug === slug)
      if (result) {
        const value = result[key]
        return value.includes('?') ? value.split('?')[0] : value
      }
      continue
    }

    if (itemSlug === slug) {
      const value = itemKey
      return value.includes('?') ? value.split('?')[0] : value
    }
  }

  return ''
}
