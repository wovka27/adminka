import { useRouter } from 'vue-router'

export default (meta_default?: IMeta): IMeta => {
  const router = useRouter()
  const query = router.currentRoute.value.query

  const getValueFromQuery = (key: string, defaultValue: number): number => {
    const value = query[key]
    return value && !isNaN(+value) ? +value : meta_default ? meta_default[key as keyof IMeta] : defaultValue
  }

  const page_current = getValueFromQuery('page_current', 1)
  const page_per = getValueFromQuery('page_per', 10)
  const page_last = getValueFromQuery('page_last', 1)

  return { page_current, page_per, page_last }
}
