import { ref } from 'vue'

import excludeProp from '@/helpers/excludeProp'

const getDefaultParametersData = () => ({
  status: false,
  force_load: false,
  override_global_price: false,
  // flat_type: '',
  replacement_uid: '',
  replacement_room_count: '',
  cost: { value: '', price_type: 'manual_price' },
  square_type: ''
})
export default () => {
  const unloading_parameters = ref(getDefaultParametersData())

  const setParameters = (form_data: any) => {
    unloading_parameters.value = {
      cost: { ...((form_data.cost?.value && form_data.cost) ?? getDefaultParametersData().cost) },
      // flat_type: form_data.flat_type || '',
      replacement_room_count: form_data.replacement_room_count || '',
      replacement_uid: form_data.replacement_uid || '',
      square_type: form_data.square_type || '',
      status: !!form_data.status,
      force_load: !!form_data.force_load,
      override_global_price: !!form_data.override_global_price
    }
  }
  const getRequestParameters = () => {
    return {
      ...(!unloading_parameters.value.cost?.value
        ? { ...unloading_parameters.value, cost: null }
        : unloading_parameters.value)
    }
  }

  return {
    unloading_parameters,
    setParameters,
    getRequestParameters
  }
}
