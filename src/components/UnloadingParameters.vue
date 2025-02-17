<script setup lang="ts">
import FakeGuid from '@/components/FakeGuid.vue'
import PriceTypeField from '@/components/PriceTypeField.vue'
import GlobalSettingsInfoList from '@/components/UI/GlobalSettingsInfoList.vue'

import useRefs from '@/composables/app/useRefs'

interface IUnloadingParametersProps {
  replacement_room_count_options?: { value: string; label: string }[]
  replacement_room_count_type_field?: 'input'
  aggregator_type: AggregatorItemType
  modelValue: {
    status: boolean
    force_load: boolean
    override_global_price: boolean
    // flat_type: string
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
  <PskGridContainer grid-column-count="3" grid-span="3" title="Параметры выгрузки">
    <GlobalSettingsInfoList :aggregator_type="aggregator_type" />
    <div class="UnloadingParameters">
      <PskSwitch
        :model-value="modelValue.status"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, status: $event })"
        label="Статус выгрузки"
        required
      />

      <PskSwitch
        :model-value="modelValue.force_load"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, force_load: $event })"
        label="Принудительная выгрузка"
      />

      <PskSelect
        style="max-width: 500px"
        v-if="!replacement_room_count_type_field && replacement_room_count_options"
        :model-value="modelValue.replacement_room_count"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, replacement_room_count: $event })"
        label="Подменное кол-во комнат"
        :options="replacement_room_count_options"
        options_label="label"
        options_value="value"
        value_key="value"
      />
      <PskInput
        style="max-width: max-content"
        v-if="replacement_room_count_type_field && replacement_room_count_type_field === 'input'"
        :model-value="modelValue.replacement_room_count + ''"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, replacement_room_count: $event })"
        type="number"
        label="Подменное кол-во комнат"
        placeholder="Введите кол-во"
      />
    </div>
    <PskAlert class="span-3" type="gray" text="Выберите GUID для выгрузки" />
    <FakeGuid
      :guid_fake="modelValue.replacement_uid"
      @update:guid_fake="$emit('update:modelValue', { ...modelValue, replacement_uid: $event })"
      :guid_base="`${$router.currentRoute.value.params.uid}`"
    />
    <PriceTypeField
      :model-value="modelValue.cost"
      :override-price="modelValue.override_global_price"
      @update:modelValue="$emit('update:modelValue', { ...modelValue, cost: $event })"
      @update:overridePrice="$emit('update:modelValue', { ...modelValue, override_global_price: $event })"
    />
    <div></div>
    <PskSelect
      :model-value="modelValue.square_type"
      @update:modelValue="$emit('update:modelValue', { ...modelValue, square_type: $event })"
      label="Какой тип площади выгружать"
      :options="refs.real_property_square_types"
    />
  </PskGridContainer>
</template>

<style lang="scss">
.UnloadingParameters {
  display: flex;
  gap: 30px;
  grid-column: span 3;
}
</style>
