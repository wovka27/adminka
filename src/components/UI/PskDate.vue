<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { computed, onMounted } from 'vue'

type ModelType = null | Date

export interface IPskDateProps {
  modelValue: ModelType | [ModelType, ModelType]
  format?: 'DD-MM-YYYY' | 'DD-MM-YYYY hh:mm'
  use_time?: boolean
  label?: string
  disabled?: boolean
  removed?: boolean
  required?: boolean
  clearable?: boolean
  readonly?: boolean
  placeholder?: string
  handleRemoved?: (...arg: any) => any

  // error?: boolean | string
  id?: string
  name?: string
}

const props = withDefaults(defineProps<IPskDateProps>(), { type: 'date', format: 'DD-MM-YYYY' })
const emit = defineEmits(['update:modelValue'])

let is_date_range = false

const model = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (val === null && is_date_range) {
      emit('update:modelValue', [null, null])
      return
    }

    emit('update:modelValue', val)
  }
})

const _type = computed(() => {
  if (!props.use_time) {
    if (Array.isArray(props.modelValue)) return 'daterange'
    return 'date'
  }

  if (Array.isArray(props.modelValue)) return 'datetimerange'
  return 'datetime'
})

const _format = computed(() => (props.use_time ? 'DD-MM-YYYY HH:mm' : 'DD-MM-YYYY'))

onMounted(() => {
  is_date_range = Array.isArray(props.modelValue)
})
</script>

<template>
  <div class="PskDate">
    <header class="PskDate__header">
      <div class="PskDate__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskDate__slot"><slot /></div>
    </header>

    <div class="PskDate__main">
      <el-date-picker
        class="PskDate__ElDatePicker"
        v-model="model"
        :type="_type"
        :disabled="disabled"
        time-arrow-control
        :format="_format"
        unlink-panels
        prefix-icon="Calendar"
        :readonly="readonly"
        :clearable="clearable"
        editable
        :placeholder="placeholder ?? 'Выберите дату'"
        start-placeholder="Выберите дату"
        end-placeholder="Выберите дату"
      />

      <el-icon class="iconHover_danger" v-if="handleRemoved" @click="handleRemoved()">
        <Delete />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss">
.PskDate {
  width: 100%;
}

.PskDate__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskDate__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskDate__main {
  display: flex;
  align-items: center;
  gap: 13px;
}

.PskDate__ElDatePicker {
  width: 100% !important;
}
</style>
