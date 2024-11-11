// @ts-nocheck
import { useAsideMenuStore } from '@/stores'

export default (path: string, key: string): string => {
  const aside_menu_state = useAsideMenuStore()
  const slug = path.slice(1)

  const getValue = (v: string): string => (v?.includes('?') ? v?.split('?')?.[0] : v)

  for (const { children, slug: itemSlug, [key]: itemKey } of aside_menu_state.aside_menu) {
    if (children) {
      const result = children.find((i) => i.slug === slug)
      if (result) return getValue(result[key])
      continue
    }

    if (itemSlug === slug) return getValue(itemKey)
  }

  return ''
}
