import { ref } from 'vue'

const getDefaultParametersData = () => ({
  status: false,
  flat_type: '',
  replacement_uid: '',
  replacement_room_count: '',
  cost: { value: '', price_type: 'manual_type' },
  square_type: ''
})
export default () => {
  const unloading_parameters = ref(getDefaultParametersData())

  const setParameters = (form_data: any) => {
    unloading_parameters.value = {
      cost: { ...((form_data.cost?.value && form_data.cost) ?? getDefaultParametersData().cost) },
      flat_type: form_data.flat_type || '',
      replacement_room_count: form_data.replacement_room_count || '',
      replacement_uid: form_data.replacement_uid || '',
      square_type: form_data.square_type || '',
      status: !!form_data.status
    }
  }
  const getRequestParameters = () => ({ ...unloading_parameters.value })

  return {
    unloading_parameters,
    setParameters,
    getRequestParameters
  }
}
