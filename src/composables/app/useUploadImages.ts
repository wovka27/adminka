import { type Ref, ref } from 'vue'

import type { IImage } from '@/services/REST/dom_admin/common_types'

export default () => {
  const images: Ref<IImage[]> = ref([])

  const getImages = (data: IImage[]) => (images.value = data || [])
  const getRequestImages = () => ({ images: images.value.map((i) => i.uid).filter(Boolean) })

  return { images, getImages, getRequestImages }
}
