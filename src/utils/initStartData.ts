import { useAsideMenuStore, useFiltersStore } from '@/stores'

export default async () => {
  const aside_menu_store = useAsideMenuStore()
  const filters_store = useFiltersStore()

  return (await Promise.all([aside_menu_store.setAsideMenu(), filters_store.setFiltersComplex()])).every(Boolean)
}
