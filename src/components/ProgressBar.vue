<script setup lang="ts">
import { useProgressStore } from '@/stores/useProgressStore'

const progress = useProgressStore()
</script>

<template>
  <div v-if="progress.val" class="ProgressBar" :style="`width: ${progress.val}%`"></div>
</template>

<style lang="scss">
.ProgressBar {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background-color: $c_primary;
}
</style>
