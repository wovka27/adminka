<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import { fetchCreateDynamics, fetchGetDynamics, fetchUpdateDynamics } from '@/services/REST/dom_admin/dynamics'

import convertDateToRequest from '@/helpers/convertDateToRequest'
import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()

const refs = useRefs('complexes')

const { material_type_options, materials, getMaterials, attach, detach, getRequestDataMaterials } =
  useUploadMaterials('dynamic')

const { is_data_loaded, apply, default_fields } = useEditorView({
  router,
  back_route_name: 'dynamics_list',
  fetchGetEntity: fetchGetDynamics,
  default_fields: true,
  apply: {
    create: {
      fetchCreateEntity: fetchCreateDynamics,
      success_message: 'Динамика успешно создана',
      afterResponseFn: async (response) => {
        await attach(response.uid)
      }
    },
    update: {
      fetchUpdateEntity: fetchUpdateDynamics,
      beforeResponseFn: async () => {
        await detach(router.currentRoute.value.params.uid as string)
        await attach(router.currentRoute.value.params.uid as string)
      }
    }
  },
  getRequestData: () => ({
    ...getRequestDataMaterials(),
    name: name.value,
    complex_uid: complex_uid.value,
    publication_date: publication_date.value && convertDateToRequest(publication_date.value),
    link_video: link_video.value
  }),
  setFormData: (form_data) => {
    getMaterials(form_data.media)

    name.value = form_data.name || ''
    complex_uid.value = form_data.complex_uid || ''
    publication_date.value = form_data.publication_date ? new Date(form_data.publication_date) : null
    link_video.value = form_data.link_video || ''
  },
  mount: {
    create: {
      app_header_props: {
        title: `Добавить динамику`,
        breadcrumbs: [
          {
            label: 'Динамика строительства',
            route: {
              name: 'dynamics_list'
            }
          },
          { label: `Добавить динамику` }
        ]
      }
    },
    common: {
      app_header_props: ([response_dynamics]) => {
        const complex = refs.value.complexes.find((i) => i.value === complex_uid.value)
        const title = complex ? `${complex.label} / ${response_dynamics.name}` : `${response_dynamics.name}`
        return {
          title,
          breadcrumbs: [
            { label: 'Динамика строительства', route: getHandleBackArgs('dynamics_list') },
            { label: title }
          ]
        }
      }
    }
  }
})

const name = ref('')
const complex_uid = ref('')
const publication_date = ref<Date | null>(null)
const link_video = ref('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3">
      <DefaultFormFields v-model="default_fields" is_show_dates />
      <PskGridContainer grid-span="3" grid-column-count="3">
        <PskInput class="span-2" v-model="name" label="Название" required placeholder="Введите название" />
      </PskGridContainer>
      <PskGridContainer grid-span="2" grid-column-count="2">
        <PskSelect
          v-model="complex_uid"
          label="Жилой комплекс"
          options_label="label"
          options_value="value"
          required
          :options="refs.complexes"
        />
        <PskDate v-model="publication_date" label="Дата публикации(в формате дата)" required />
      </PskGridContainer>
      <PskGridContainer title="Информация о динамике" grid-column-count="3" grid-span="3">
        <PskInput class="span-2" v-model="link_video" label="Ссылка на видео" placeholder="Введите ссылку" />
        <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
