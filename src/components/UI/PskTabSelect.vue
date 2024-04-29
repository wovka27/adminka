<script setup lang="ts">
import { onMounted } from 'vue'

interface IPskTabSelectProps {
  modelValue: any
  options: any[]
  multiple?: boolean
  options_value?: string
  options_label?: string
  value_key?: string
}

const props = defineProps<IPskTabSelectProps>()

const emit = defineEmits(['update:modelValue'])

const isTabItemActive = (tab: any) => {
  if (props.multiple) {
    return props.options.includes(tab)
  }

  if (props.value_key) return props.modelValue?.[props.value_key] === tab?.[props.value_key]
  return props.modelValue === tab
}

const handleClickTabItem = (tab: any) => {
  if (props.multiple) {
    if (props.options.includes(tab)) {
      return emit(
        'update:modelValue',
        props.modelValue.filter((i: any) => i !== tab)
      )
    }
    return emit('update:modelValue', [...props.modelValue, tab])
  }

  return emit('update:modelValue', tab)
}

onMounted(() => !props.modelValue && props.options.length && emit('update:modelValue', props.options[0]))
</script>

<template>
  <div v-grab-scroll class="PskTabSelect" v-if="options.length">
    <div class="PskTabSelect__tabs">
      <div
        class="PskTabSelect__tabItem"
        @click="handleClickTabItem(tab)"
        v-for="(tab, idx) of options"
        :key="idx"
        :class="{
          PskTabSelect__tabItem_active: isTabItemActive(tab),
          only_first_borderRadius: options.length === 1,
          borderRadius: options.length > 1
        }"
      >
        {{ typeof options_label === 'string' ? tab[options_label] : tab }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.PskTabSelect {
  width: 100%;
  max-width: max-content;
  padding: 0 0 4px 0;
  overflow: auto;
  @include hideScroll();
}

.PskTabSelect__tabs {
  display: flex;
  border-radius: 5px;
}

.PskTabSelect__tabItem {
  @include setFontStyle3();
  padding: 5px 15px;
  background-color: $c_body;
  white-space: nowrap;
  transition:
    color 0.2s ease-in-out,
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;

  cursor: pointer;

  border-top: 1px solid $c_border_light;
  border-bottom: 1px solid $c_border_light;
  border-left: 1px solid $c_border_light;
  border-right: 0 solid $c_border_light;

  &.only_first_borderRadius {
    border-radius: 5px;
    border: 1px solid $c_border_light;
  }

  &.borderRadius {
    &:first-child {
      border-radius: 5px 0 0 5px;
    }

    &:last-child {
      border-radius: 0 5px 5px 0;
      border-right: 1px solid $c_border_light;
    }
  }

  &:hover:not(.PskTabSelect__tabItem_active) {
    color: $c_primary;
  }
}

.PskTabSelect__tabItem_active {
  color: $c_body;
  background-color: $c_primary;
  border-color: $c_primary !important;
}
</style>
