<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import { fetchGetEntrance, fetchUpdateEntrance } from '@/services/REST/dom_admin/entrance'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()

const refs = useRefs('construction-materials')

const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('entrance')

const { apply, is_data_loaded, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetEntrance,
  back_route_name: 'entrance_list',
  default_fields: true,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateEntrance,
      beforeResponseFn: async () => {
        const entrance_uid = router.currentRoute.value.params.uid as string
        await detach(entrance_uid)
        await attach(entrance_uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)

    name.value = form_data.name || ''
    section.value = getNumString(form_data.section)
    entrance.value = getNumString(form_data.entrance)
    floors.value = getNumString(form_data.floors)
    flat_count.value = getNumString(form_data.flat_count)
    construction_material.value = form_data.construction_material || ''
  },
  getRequestData: () => ({
    name: name.value,
    section: section.value,
    entrance: entrance.value,
    floors: floors.value,
    flat_count: flat_count.value,
    construction_material: construction_material.value
  }),
  mount: {
    common: {
      app_header_props: ([response_entrance]) => ({
        title: response_entrance.name,
        breadcrumbs: [
          {
            label: 'Подъезды/Секции',
            route: getHandleBackArgs('entrance_list')
          },
          { label: response_entrance.name }
        ]
      })
    }
  }
})

const name = ref('')
const section = ref('')
const entrance = ref('')
const floors = ref('')
const flat_count = ref('')
const construction_material = ref('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <PskGridContainer grid-span="2" grid-column-count="3">
        <PskInput v-model="name" label="Название" disabled required class="span-3" />
        <PskInput v-model="section" label="Секция" placeholder="Введите номер" type="number" />
        <PskInput v-model="entrance" label="Подъезд" placeholder="Введите номер" type="number" />
      </PskGridContainer>

      <PskGridContainer grid-column-count="3" grid-span="3" title="Об объекте">
        <PskInput v-model="floors" label="Этажность" disabled />
        <PskInput v-model="flat_count" label="Кол-во квартир на этаже" disabled />
        <PskSelect v-model="construction_material" :options="refs.construction_materials" label="Материал стен" />
        <UploadMedia v-model="materials" :types="material_type_options" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
