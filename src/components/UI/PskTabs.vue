<script setup lang="ts">
export interface ITab {
  label: string
}

export interface IPskTabsProps {
  modelValue?: ITab
  tabs: ITab[]
}

const props = defineProps<IPskTabsProps>()
const emit = defineEmits(['update:modelValue'])

const handleClickTabItem = (tab_item: ITab) => {
  if (tab_item === props.modelValue) return
  emit('update:modelValue', tab_item)
}
</script>

<template>
  <div v-if="tabs && modelValue" v-grab-scroll class="PskTabs">
    <div
      class="PskTabs__tabItem"
      :class="{ PskTabs__tabItem_active: modelValue === tab_item }"
      v-for="(tab_item, idx) of tabs"
      :key="idx"
      @click="handleClickTabItem(tab_item)"
    >
      <div class="PskTabs__tabItemLabel">{{ tab_item.label }}</div>
      <div class="PskTabs__tabItemDecorLine" v-if="modelValue === tab_item"></div>
    </div>
  </div>
</template>

<style lang="scss">
.PskTabs {
  width: 100%;
  max-width: max-content;
  overflow: auto;
  @include hideScroll();

  display: flex;
}

.PskTabs__tabItem {
  flex-shrink: 0;
  position: relative;
  padding: 10px;
  cursor: pointer;
  border-bottom: 2px solid $c_border_light;
}

.PskTabs__tabItemLabel {
  @include setFontStyle6();
}

.PskTabs__tabItem_active {
  color: $c_primary;
  cursor: default;
}

.PskTabs__tabItemDecorLine {
  height: 2px;
  background-color: $c_primary;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;

  animation: PskTabs__tabItemDecorLine 200ms ease-out;
}

@keyframes PskTabs__tabItemDecorLine {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
