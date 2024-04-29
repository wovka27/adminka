<script setup lang="ts">
import FakeGuid from '@/components/FakeGuid.vue'
import PriceTypeField from '@/components/PriceTypeField.vue'
import GlobalSettingsInfoList from '@/components/UI/GlobalSettingsInfoList.vue'

import useRefs from '@/composables/app/useRefs'

interface IUnloadingParametersProps {
  replacement_room_count_options?: { value: string; label: string }[]
  replacement_room_count_type_field?: 'input'
  modelValue: {
    status: boolean
    flat_type: string
    replacement_uid: string
    replacement_room_count: string
    cost: {
      value: string
      price_type: string
    }
    square_type: string
  }
}

defineProps<IUnloadingParametersProps>()
defineEmits(['update:modelValue'])

const refs = useRefs('real-property-types', 'real-property-square-types')
</script>

<template>
  <div style="grid-column: span 3" class="ComplexEditorView__boxFields2 gridForm">
    <h3 class="ComplexEditorView__boxFields2H1">Параметры выгрузки</h3>

    <GlobalSettingsInfoList aggregator_type="avito" />

    <div style="grid-column: span 3" class="gridForm">
      <PskSwitch
        :model-value="modelValue.status"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, status: $event })"
        label="Статус выгрузки"
        required
      />
      <PskSelect
        :model-value="modelValue.flat_type"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, flat_type: $event })"
        label="В какой тип объекта недвижимости выгружать"
        :options="refs.real_property_types"
        options_label="label"
        options_value="value"
        required
      />
      <PskSelect
        v-if="!replacement_room_count_type_field && replacement_room_count_options"
        :model-value="modelValue.replacement_room_count"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, replacement_room_count: $event + '' })"
        label="Подменное кол-во комнат"
        :options="replacement_room_count_options"
        options_label="label"
        options_value="value"
      />
      <PskInput
        v-if="replacement_room_count_type_field && replacement_room_count_type_field === 'input'"
        :model-value="modelValue.replacement_room_count + ''"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, replacement_room_count: $event })"
        type="number"
        label="Подменное кол-во комнат"
        placeholder="Введите кол-во"
      />
    </div>
    <PskAlert style="grid-column: span 3" type="gray" text="Выберите GUID для выгрузки" />
    <FakeGuid
      :guid_fake="modelValue.replacement_uid"
      @update:guid_fake="$emit('update:modelValue', { ...modelValue, replacement_uid: $event })"
      :guid_base="$router.currentRoute.value.params.uid as string"
    />
    <PriceTypeField
      :model-value="modelValue.cost"
      @update:modelValue="$emit('update:modelValue', { ...modelValue, cost: $event })"
    />
    <div></div>
    <PskSelect
      :model-value="modelValue.square_type"
      @update:modelValue="$emit('update:modelValue', { ...modelValue, square_type: $event })"
      label="Какой тип площади выгружать"
      :options="refs.real_property_square_types"
    />
  </div>
</template>

<style lang="scss"></style>
