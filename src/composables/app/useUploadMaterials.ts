import { type Ref, onBeforeMount, ref } from 'vue'

import { useAppStateStore } from '@/stores'

import type { IMaterialType, IMedia } from '@/services/REST/dom_admin/common_types'
import { fetchAttachMaterial, fetchDetachMaterial, fetchGetMaterialTypes } from '@/services/REST/dom_admin/materials'

export default (entity: ResponseAggregatorKey) => {
  const materials: Ref<IMedia[]> = ref([])
  const material_type_options: Ref<IMaterialType[]> = ref([])
  const app_state_store = useAppStateStore()

  const sleep = (ms: number = 0) => {
    app_state_store.setIsLoading(true)
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(app_state_store.setIsLoading(false))
      }, ms)
    )
  }

  const getFilteredMaterials = (type: IMedia['action']): IMedia[] => materials.value.filter((i) => i.action === type)

  const processMaterial = async (type: 'detach' | 'attach', cb: (material_uid: string) => Promise<void>) => {
    const filtered_materials = getFilteredMaterials(type)
    for (const filteredMaterial of filtered_materials) {
      await cb(filteredMaterial.uid)
    }
  }

  const detach = async (entity_uid: string) => {
    const cb = async (material_uid: string) => {
      await fetchDetachMaterial(entity, entity_uid, material_uid)
    }

    await processMaterial('detach', cb)
  }
  const attach = async (entity_uid: string) => {
    const cb = async (material_uid: string) => {
      await fetchAttachMaterial(entity, entity_uid, material_uid)
      await sleep()
    }

    await processMaterial('attach', cb)
  }

  const getRequestDataMaterials = () => ({ media: materials.value })

  const getMaterials = (materials_data: IMedia[]) => {
    materials.value = materials_data || []
  }

  onBeforeMount(async () => {
    material_type_options.value = (await fetchGetMaterialTypes(entity)) || material_type_options.value
  })

  return { materials, material_type_options, attach, detach, getMaterials, getRequestDataMaterials }
}
