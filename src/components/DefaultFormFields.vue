<script lang="ts">
/* eslint-disable */
export interface IDefaultFormFieldsProps {
  modelValue: IDefaultFields
  is_show_dates?: boolean
}

export interface IDefaultFields {
  show: boolean
  active_at: Date | null
  inactive_at: Date | null
  weight: string
  created_at: Date | null
  updated_at: Date | null
}
</script>

<script setup lang="ts">
/* eslint-disable */
import { computed, type ComputedRef } from 'vue'

const props = defineProps<IDefaultFormFieldsProps>()
const emit = defineEmits(['update:modelValue', 'changeShow'])

type FieldsType = typeof props.modelValue
type ModelType = {
  [key in keyof FieldsType]: ComputedRef<FieldsType[key]>
}
//@ts-ignore
const model = Object.keys(props.modelValue).reduce((res: any, i: keyof ModelType) => {
  res[i] = computed({
    get: () => props.modelValue[i],
    set: (value) => {
      emit('update:modelValue', { ...props.modelValue, [i]: value })
    }
  })

  return res
}, {}) as ModelType
</script>

<template>
  <div class="DefaultFormFields gridForm">
    <div class="DefaultFormFields__row1">
      <div class="DefaultFormFields__show">
        <PskSwitch label="Активен" v-model="model.show.value" @update:modelValue="emit('changeShow')" />
      </div>

      <PskDate v-model="model.active_at.value" label="Начало активности">
        <el-popover placement="top" trigger="hover" width="fit-content">
          <template #reference>
            <el-icon class="iconHover_default" style="font-size: 16px">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_355_1388)">
                  <rect width="20" height="20" rx="10" fill="#4670A7" />
                  <path
                    d="M8.96875 12.2246V11.8691C8.96875 11.5046 9.00293 11.1924 9.07129 10.9326C9.13965 10.6683 9.25814 10.4222 9.42676 10.1943C9.59993 9.96647 9.83919 9.72493 10.1445 9.46973C10.5 9.1735 10.7803 8.92285 10.9854 8.71777C11.195 8.50814 11.3454 8.2985 11.4365 8.08887C11.5277 7.87923 11.5732 7.6263 11.5732 7.33008C11.5732 6.85612 11.4206 6.49382 11.1152 6.24316C10.8099 5.98796 10.3792 5.86035 9.82324 5.86035C9.37207 5.86035 8.97103 5.91732 8.62012 6.03125C8.26921 6.14518 7.93197 6.2819 7.6084 6.44141L7.21191 5.52539C7.58561 5.32943 7.99121 5.16992 8.42871 5.04688C8.86621 4.92383 9.35384 4.8623 9.8916 4.8623C10.7712 4.8623 11.4525 5.08105 11.9355 5.51855C12.4186 5.9515 12.6602 6.5485 12.6602 7.30957C12.6602 7.7334 12.5918 8.0957 12.4551 8.39648C12.3184 8.69271 12.1247 8.96615 11.874 9.2168C11.6234 9.46289 11.3271 9.72493 10.9854 10.0029C10.6846 10.2581 10.4544 10.4837 10.2949 10.6797C10.1354 10.8711 10.026 11.0693 9.9668 11.2744C9.90755 11.4749 9.87793 11.7165 9.87793 11.999V12.2246H8.96875ZM8.66797 14.2891C8.66797 13.9701 8.74316 13.7445 8.89355 13.6123C9.04395 13.4756 9.23763 13.4072 9.47461 13.4072C9.69792 13.4072 9.88704 13.4756 10.042 13.6123C10.2015 13.7445 10.2812 13.9701 10.2812 14.2891C10.2812 14.6035 10.2015 14.8337 10.042 14.9795C9.88704 15.1208 9.69792 15.1914 9.47461 15.1914C9.23763 15.1914 9.04395 15.1208 8.89355 14.9795C8.74316 14.8337 8.66797 14.6035 8.66797 14.2891Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_355_1388">
                    <rect width="20" height="20" rx="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </el-icon>
          </template>
          Укажите заданное время для активации
        </el-popover>
      </PskDate>
      <PskDate v-model="model.inactive_at.value" label="Конец активности">
        <el-popover placement="top" trigger="hover" width="fit-content">
          <template #reference>
            <el-icon class="iconHover_default" style="font-size: 16px">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_355_1388)">
                  <rect width="20" height="20" rx="10" fill="#4670A7" />
                  <path
                    d="M8.96875 12.2246V11.8691C8.96875 11.5046 9.00293 11.1924 9.07129 10.9326C9.13965 10.6683 9.25814 10.4222 9.42676 10.1943C9.59993 9.96647 9.83919 9.72493 10.1445 9.46973C10.5 9.1735 10.7803 8.92285 10.9854 8.71777C11.195 8.50814 11.3454 8.2985 11.4365 8.08887C11.5277 7.87923 11.5732 7.6263 11.5732 7.33008C11.5732 6.85612 11.4206 6.49382 11.1152 6.24316C10.8099 5.98796 10.3792 5.86035 9.82324 5.86035C9.37207 5.86035 8.97103 5.91732 8.62012 6.03125C8.26921 6.14518 7.93197 6.2819 7.6084 6.44141L7.21191 5.52539C7.58561 5.32943 7.99121 5.16992 8.42871 5.04688C8.86621 4.92383 9.35384 4.8623 9.8916 4.8623C10.7712 4.8623 11.4525 5.08105 11.9355 5.51855C12.4186 5.9515 12.6602 6.5485 12.6602 7.30957C12.6602 7.7334 12.5918 8.0957 12.4551 8.39648C12.3184 8.69271 12.1247 8.96615 11.874 9.2168C11.6234 9.46289 11.3271 9.72493 10.9854 10.0029C10.6846 10.2581 10.4544 10.4837 10.2949 10.6797C10.1354 10.8711 10.026 11.0693 9.9668 11.2744C9.90755 11.4749 9.87793 11.7165 9.87793 11.999V12.2246H8.96875ZM8.66797 14.2891C8.66797 13.9701 8.74316 13.7445 8.89355 13.6123C9.04395 13.4756 9.23763 13.4072 9.47461 13.4072C9.69792 13.4072 9.88704 13.4756 10.042 13.6123C10.2015 13.7445 10.2812 13.9701 10.2812 14.2891C10.2812 14.6035 10.2015 14.8337 10.042 14.9795C9.88704 15.1208 9.69792 15.1914 9.47461 15.1914C9.23763 15.1914 9.04395 15.1208 8.89355 14.9795C8.74316 14.8337 8.66797 14.6035 8.66797 14.2891Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_355_1388">
                    <rect width="20" height="20" rx="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </el-icon>
          </template>
          Укажите заданное время для деактивации
        </el-popover>
      </PskDate>
      <PskInput
        class="DefaultFormFields__inputWeight"
        v-model="model.weight.value"
        label="Сортировка(вес)"
        required
        type="number"
      />
    </div>

    <div v-if="model.created_at.value || model.updated_at.value" class="DefaultFormFields__row2">
      <PskDate placeholder="" v-model="model.created_at.value" label="Дата создания" use_time disabled />
      <PskDate placeholder="" v-model="model.updated_at.value" label="Дата обновления" use_time disabled />
    </div>
  </div>
</template>

<style lang="scss">
.DefaultFormFields__row1 {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: flex-end;
}

.DefaultFormFields__row2 {
  grid-column: span 2;
}

.DefaultFormFields__dateRange {
  display: flex;
  align-items: flex-end;
}

.DefaultFormFields__inputWeight {
  max-width: 130px;
}

.DefaultFormFields__row2 {
  display: flex;
  gap: 30px;
}
</style>
