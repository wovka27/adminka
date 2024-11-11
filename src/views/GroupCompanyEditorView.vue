<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  fetchCreateGroupCompany,
  fetchGetGroupCompany,
  fetchUpdateGroupCompany
} from '@/services/REST/dom_admin/group_company'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()
const refs = useRefs('activity-regions')
const { material_type_options, materials, getMaterials, attach, detach, getRequestDataMaterials } =
  useUploadMaterials('company_group')
const { is_data_loaded, apply, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetGroupCompany,
  default_fields: true,
  back_route_name: 'group_company_list',
  apply: {
    create: {
      fetchCreateEntity: fetchCreateGroupCompany,
      afterResponseFn: async (response) => {
        await attach(response.uid)
      },
      success_message: 'Группа успешно создана'
    },
    update: {
      fetchUpdateEntity: fetchUpdateGroupCompany,
      beforeResponseFn: async () => {
        const group_company_uid = router.currentRoute.value.params.uid as string

        await detach(group_company_uid)
        await attach(group_company_uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)
    name.value = form_data.name || ''
    website_url.value = form_data.website_url || ''
    regions_activity.value = form_data.regions_activity || []
    phone_number.value = form_data.phone_number || ''
    foundation_year.value = form_data.foundation_year || ''
  },
  getRequestData: () => ({
    ...getRequestDataMaterials(),
    name: name.value,
    website_url: website_url.value,
    regions_activity: regions_activity.value,
    phone_number: phone_number.value,
    foundation_year: foundation_year.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить компанию`,
        breadcrumbs: [
          { label: 'Застройщики' },
          {
            label: 'Группа компаний',
            route: getHandleBackArgs('group_company_list')
          },
          { label: `Добавить компанию` }
        ]
      }
    },
    common: {
      app_header_props: ([response_group_company]) => ({
        title: response_group_company.name,
        breadcrumbs: [
          { label: 'Застройщики' },
          {
            label: 'Группа компаний',
            route: getHandleBackArgs('group_company_list')
          },
          { label: response_group_company.name }
        ]
      })
    }
  }
})

const name = ref('')
const website_url = ref('')
const regions_activity = ref<string[]>([])
const phone_number = ref('')
const foundation_year = ref('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3">
      <DefaultFormFields v-model="default_fields" is_show_dates />
      <PskInput v-model="name" label="Группа компаний" required placeholder="Введите название" class="span-2" />
      <div></div>
      <PskInput v-model="website_url" label="Ссылка на сайт" placeholder="Введите или вставьте ссылку" class="span-2" />
      <div></div>
      <PskSelect
        v-model="regions_activity"
        :options="refs.activity_regions"
        label="Регионы деятельности"
        placeholder="Выберите регион"
        multiple
        class="span-2"
      />
      <div></div>
      <PskInput v-model="phone_number" label="Номер телефона" type="phone" placeholder="Введите номер" />
      <PskInput v-model="foundation_year" label="Год основания" type="number" placeholder="Введите год" />
      <UploadMedia v-model="materials" :types="material_type_options" />
    </PskGridContainer>
  </FormLayout>
</template>
