<script setup lang="ts">
import { onMounted } from 'vue'

import { useGlobalSettingsStore } from '@/stores/useGlobalSettingsStore'

interface IGlobalSettingsInfoListProps {
  aggregator_type: 'avito' | 'cian' | 'dom_click' | 'yandex'
}

const props = defineProps<IGlobalSettingsInfoListProps>()
const global_settings_store = useGlobalSettingsStore()

onMounted(() => {
  global_settings_store.getTransformedGlobalSettingsData(props.aggregator_type)
})
</script>

<template>
  <div
    v-if="
      global_settings_store.transformed_global_settings_list.GLOBAL?.length ||
      global_settings_store.transformed_global_settings_list.PERSONAL?.length
    "
    class="GlobalSettingsInfoList"
  >
    <PskAlert type="info" text="Эта квартира попадает под:" />
    <PskInfoCollapse
      v-if="global_settings_store.transformed_global_settings_list.GLOBAL?.length"
      title="Автоматический отбор"
    >
      <div class="GlobalSettingsInfoList">
        <div
          class="GlobalSettingsInfoList__item"
          v-for="item of global_settings_store.transformed_global_settings_list.GLOBAL"
          :key="item.uid"
        >
          <h3>{{ item.name }}</h3>
          <PskLink :to="`/feed/${item.uid}`">Перейти на страницу фида</PskLink>
        </div>
      </div>
    </PskInfoCollapse>
    <PskInfoCollapse
      v-if="global_settings_store.transformed_global_settings_list.PERSONAL?.length"
      title="Персональный отбор"
    >
      <div class="GlobalSettingsInfoList">
        <div
          class="GlobalSettingsInfoList__item"
          v-for="item of global_settings_store.transformed_global_settings_list.PERSONAL"
          :key="item.uid"
        >
          <h3>{{ item.name }}</h3>
          <PskLink :to="`/feed/${item.uid}`">Перейти на страницу фида</PskLink>
        </div>
      </div>
    </PskInfoCollapse>
  </div>
</template>

<style lang="scss">
.GlobalSettingsInfoList {
  display: flex;
  flex-direction: column;
  gap: 20px 30px;
  grid-column: span 3;
}

.GlobalSettingsInfoList__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
