import type { Router } from 'vue-router'

export default (router: Router, meta_default?: IMeta): IMeta => {
  const query = router.currentRoute.value.query

  const getValueFromQuery = (key: keyof IMeta, defaultValue: number = 1): number => {
    const value = query[key]
    return value && !isNaN(+value) ? +value : meta_default ? meta_default[key] : defaultValue
  }

  return {
    page_current: getValueFromQuery('page_current'),
    page_per: getValueFromQuery('page_per', 10),
    page_last: getValueFromQuery('page_last')
  }
}
