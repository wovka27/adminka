import { useAsideMenuStore, useFiltersStore } from '@/stores'

export default async () =>
  (await Promise.all([useAsideMenuStore().setAsideMenu(), useFiltersStore().setFiltersComplex()])).every(Boolean)
