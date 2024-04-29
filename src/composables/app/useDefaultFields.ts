import { ref } from 'vue'

import { type IDefaultFields, type IDefaultFormFieldsProps } from '@/components/DefaultFormFields.vue'

import convertDateToRequest from '@/helpers/convertDateToRequest'

interface IResponseDefaultFields {
  show: boolean
  active_at: string | null
  inactive_at: string | null
  weight: number
  created_at: string | null
  updated_at: string | null
}

const getDefaultFields = <T extends IResponseDefaultFields>(response: T): IDefaultFields => {
  const convertToDate = (value: string | null): Date | null => (value ? new Date(value) : null)

  return {
    show: Boolean(response.show),
    active_at: convertToDate(response.active_at),
    inactive_at: convertToDate(response.inactive_at),
    weight: response.weight ? String(response.weight) : '500',
    created_at: convertToDate(response.created_at),
    updated_at: convertToDate(response.updated_at)
  }
}

export default () => {
  const default_fields = ref<IDefaultFormFieldsProps['modelValue']>({
    show: true,
    active_at: null,
    created_at: null,
    inactive_at: null,
    updated_at: null,
    weight: '500'
  })

  const getDefaultFieldsData = (form_data: any) => {
    default_fields.value = getDefaultFields(form_data)
  }

  const getRequestDefaultFields = () => {
    return {
      show: default_fields.value.show,
      active_at: default_fields.value.active_at && convertDateToRequest(default_fields.value.active_at),
      inactive_at: default_fields.value.inactive_at && convertDateToRequest(default_fields.value.inactive_at),
      weight: default_fields.value.weight || ''
    }
  }

  return { default_fields, getDefaultFieldsData, getRequestDefaultFields }
}
