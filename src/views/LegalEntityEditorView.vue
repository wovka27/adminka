<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import {
  fetchCreateLegalEntity,
  fetchGetLegalEntity,
  fetchUpdateLegalEntity
} from '@/services/REST/dom_admin/legal_entity'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'

const router = useRouter()

const refs = useRefs('company-groups')

const { apply, is_data_loaded, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetLegalEntity,
  back_route_name: 'legal_entity_list',
  default_fields: true,
  apply: {
    create: {
      fetchCreateEntity: fetchCreateLegalEntity,
      success_message: 'Застройщик успешно создан'
    },
    update: {
      fetchUpdateEntity: fetchUpdateLegalEntity
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name || ''
    abbreviated_name.value = form_data.abbreviated_name || ''
    leader_first_name.value = form_data.leader_first_name || ''
    leader_last_name.value = form_data.leader_last_name || ''
    leader_second_name.value = form_data.leader_second_name || ''
    legal_address.value = form_data.legal_address || ''
    company_group_uid.value = form_data.company_group_uid || ''
    actual_address.value = form_data.actual_address || ''
    email.value = form_data.email || ''
    full_name.value = form_data.full_name || ''
    inn.value = form_data.inn || ''
    kpp.value = form_data.kpp || ''
    ogrn.value = form_data.ogrn || ''
    phone_number.value = form_data.phone_number || ''
    website_url.value = form_data.website_url || ''
  },
  getRequestData: () => ({
    name: name.value,
    abbreviated_name: abbreviated_name.value,
    leader_first_name: leader_first_name.value,
    leader_last_name: leader_last_name.value,
    leader_second_name: leader_second_name.value,
    legal_address: legal_address.value,
    company_group_uid: company_group_uid.value,
    actual_address: actual_address.value,
    email: email.value,
    full_name: full_name.value,
    inn: inn.value,
    kpp: kpp.value,
    ogrn: ogrn.value,
    phone_number: phone_number.value,
    website_url: website_url.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить застройщика`,
        breadcrumbs: [
          { label: 'Застройщики' },
          {
            label: 'Юридические лица',
            route: getHandleBackArgs('legal_entity_list')
          },
          { label: `Добавить застройщика` }
        ]
      }
    },
    common: {
      app_header_props: ([response_legal_entity]) => ({
        title: response_legal_entity.name,
        breadcrumbs: [
          { label: 'Застройщики' },
          {
            label: 'Юридические лица',
            route: getHandleBackArgs('legal_entity_list')
          },
          { label: response_legal_entity.name }
        ]
      })
    }
  }
})

const name = ref('')
const abbreviated_name = ref('')
const leader_first_name = ref('')
const leader_last_name = ref('')
const leader_second_name = ref('')
const legal_address = ref('')
const actual_address = ref('')
const company_group_uid = ref('')
const email = ref('')
const full_name = ref('')
const inn = ref('')
const kpp = ref('')
const ogrn = ref('')
const phone_number = ref('')
const website_url = ref('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-column-count="3">
      <DefaultFormFields v-model="default_fields" is_show_dates />
      <PskSelect
        v-model="company_group_uid"
        :options="refs.company_groups"
        options_label="label"
        options_value="value"
        label="Группа компаний"
        placeholder="Выберите группу"
        required
        class="span-2"
      >
        <el-popover placement="top" trigger="hover" width="fit-content">
          <template #reference>
            <el-icon class="iconHover_default" style="font-size: 13px">
              <Warning />
            </el-icon>
          </template>
          Забирается на все типы фидов
        </el-popover>
      </PskSelect>
      <div></div>
      <PskInput
        v-model="abbreviated_name"
        label="Сокращенное наименование"
        required
        placeholder="Введите название"
        class="span-2"
      />
      <div></div>
      <PskInput v-model="name" label="Полное наименование" required placeholder="Введите название" class="span-3" />
      <PskInput v-model="inn" label="ИНН" type="number" placeholder="Введите номер" limit="10">
        <el-popover placement="top" trigger="hover" width="fit-content">
          <template #reference>
            <el-icon class="iconHover_default" style="font-size: 13px">
              <Warning />
            </el-icon>
          </template>
          Забирается на все типы фидов
        </el-popover>
      </PskInput>
      <PskInput v-model="kpp" label="КПП" type="number" placeholder="Введите номер" limit="9" />
      <PskInput v-model="ogrn" label="ОГРН" type="number" placeholder="Введите номер" limit="13" />
      <PskInput v-model="phone_number" label="Номер телефона" type="phone" placeholder="Введите номер" />
      <PskInput v-model="website_url" label="Ссылка на сайт" placeholder="Введите или вставьте ссылку">
        <el-popover placement="top" trigger="hover" width="fit-content">
          <template #reference>
            <el-icon class="iconHover_default" style="font-size: 13px">
              <Warning />
            </el-icon>
          </template>
          Забирается на все типы фидов
        </el-popover>
      </PskInput>
      <PskInput v-model="email" label="E-mail застройщика" placeholder="Введите email">
        <el-popover placement="top" trigger="hover" width="fit-content">
          <template #reference>
            <el-icon class="iconHover_default" style="font-size: 13px">
              <Warning />
            </el-icon>
          </template>
          Забирается на все типы фидов
        </el-popover>
      </PskInput>
      <PskInput v-model="legal_address" label="Юридический адрес" placeholder="Введите адрес" class="span-3" />
      <PskInput v-model="actual_address" label="Фактический адрес" placeholder="Введите адрес" class="span-3" />

      <PskGridContainer grid-column-count="3" grid-span="3" title="Руководитель">
        <PskInput v-model="leader_last_name" label="Фамилия" placeholder="Введите фамилию" />
        <PskInput v-model="leader_first_name" label="Имя" placeholder="Введите имя" />
        <PskInput v-model="leader_second_name" label="Отчество" placeholder="Введите отчество" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
