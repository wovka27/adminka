<script lang="ts" setup>
import { computed } from 'vue'

import type { IPskDateProps } from '@/components/UI/PskDate.vue'
import type { IPskInputProps } from '@/components/UI/PskInput.vue'
import type { IPskSelectProps } from '@/components/UI/PskSelect.vue'
import type { IPskStringListProps } from '@/components/UI/PskStringList.vue'

export interface IFieldPskInput extends IPskInputProps {
  field_type: 'input'
}

export interface IFieldPskSelect extends IPskSelectProps {
  field_type: 'select'
}

export interface IFieldPskDate extends IPskDateProps {
  field_type: 'date'
}

export interface IFieldPskStringList extends IPskStringListProps {
  field_type: 'string_list'
}

export type PskFieldType = IFieldPskInput | IFieldPskSelect | IFieldPskDate | IFieldPskStringList

const props = defineProps<{ modelValue: PskFieldType }>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue.modelValue,
  set: (value) => {
    emit('update:modelValue', { ...props.modelValue, modelValue: value })
  }
})
</script>

<template>
  <div class="PskField">
    <PskInput
      v-if="modelValue.field_type === 'input'"
      v-model="model"
      :label="modelValue.label"
      :placeholder="modelValue.placeholder"
      :disabled="modelValue.disabled"
      :readonly="modelValue.readonly"
      :type="modelValue.type"
      :required="modelValue.required"
      :clearable="modelValue.clearable"
      :handleRemoved="modelValue.handleRemoved"
    />

    <PskSelect
      v-if="modelValue.field_type === 'select'"
      v-model="model"
      :options="modelValue.options"
      :options_value="modelValue.options_value"
      :options_label="modelValue.options_label"
      :label="modelValue.label"
      :placeholder="modelValue.placeholder"
      :disabled="modelValue.disabled"
      :required="modelValue.required"
      :multiple="modelValue.multiple"
      :clearable="modelValue.clearable"
      :value_key="modelValue.value_key"
      :handleRemoved="modelValue.handleRemoved"
    />

    <PskDate
      v-if="modelValue.field_type === 'date'"
      v-model="model"
      :format="modelValue.format"
      :use_time="modelValue.use_time"
      :label="modelValue.label"
      :disabled="modelValue.disabled"
      :removed="modelValue.removed"
      :required="modelValue.required"
      :clearable="modelValue.clearable"
      :readonly="modelValue.readonly"
      :handleRemoved="modelValue.handleRemoved"
    />

    <PskStringList
      v-if="modelValue.field_type === 'string_list'"
      v-model="model"
      :name="modelValue.name"
      :label="modelValue.label"
      :placeholder="modelValue.placeholder"
      :disabled="modelValue.disabled"
      :required="modelValue.required"
      :handleRemoved="modelValue.handleRemoved"
    />
  </div>
</template>

<style lang="scss">
.PskField {
  width: 100%;
}
</style>
