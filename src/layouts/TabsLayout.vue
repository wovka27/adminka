<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAppStateStore } from '@/stores'

import type { IPskTabsProps } from '@/components/UI/PskTabs.vue'

export interface ITabsLayoutProps {
  tab_options: IPskTabsProps['tabs']
  getIsStateBeforeEqualAfter: () => boolean
}

const props = defineProps<ITabsLayoutProps>()
const emit = defineEmits(['pushCommonData'])

const router = useRouter()
const app_state_store = useAppStateStore()
const component_ref = ref<{ getIsStateBeforeEqualAfter: () => boolean }>()
const tab_active = computed({
  get: () => props.tab_options[0],
  set: (tab) => {
    router.replace({})
  }
})
</script>

<template>
  <div class="TabsLayout">
    <PskTabs class="TabsLayout__PskTabs" v-model="tab_active" :tabs="tab_options" />

    <div class="TabsLayout__content">
      <template v-if="tab_active.label === 'Общие данные'">
        <slot />
      </template>

      <template v-else>
        <component ref="component_ref" :is="component_current" />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.TabsLayout {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.TabsLayout__PskTabs {
  background-color: $c_body;
}

.TabsLayout__content {
  height: 100%;
  overflow: auto;
}
</style>
