<script lang="ts" setup>
import { useAppStateStore } from '@/stores'

import PskLoader from '@/components/UI/PskLoader.vue'

const app_state_store = useAppStateStore()
</script>

<template>
  <div class="AppLoader" v-if="app_state_store.is_loading">
    <PskLoader />
  </div>
</template>

<style lang="scss">
.AppLoader {
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9997 !important;

  background: $c_body_disable;
}
</style>
