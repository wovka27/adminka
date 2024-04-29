<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

export interface IPskDrawerProps {
  use_link_back?: boolean
}

defineProps<IPskDrawerProps>()
const emit = defineEmits(['close'])

const closing_PskDrawer = ref(false)
const node_PskDrawer = ref<HTMLDivElement>()

const animationEndHandle = (event: AnimationEvent) => {
  event.animationName === 'PskDrawer_close' && event.returnValue && emit('close')
}

const closePskDrawer = () => {
  closing_PskDrawer.value = true
}

onMounted(() => {
  node_PskDrawer.value?.addEventListener('animationend', animationEndHandle)
})
onUnmounted(() => {
  node_PskDrawer.value?.removeEventListener('animationend', animationEndHandle)
})
</script>

<template>
  <div ref="node_PskDrawer" class="PskDrawer" :class="{ PskDrawer_close: closing_PskDrawer }">
    <el-link class="PskDrawer__linkBack" type="primary" v-if="use_link_back" @click="closePskDrawer()">&#60; назад</el-link>
    <slot :closePskDrawer="closePskDrawer" />
  </div>
</template>

<style lang="scss">
.PskDrawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 0 25px 50px 25px;
  background: $c_body;

  animation: PskDrawer 500ms;
  z-index: 1000;

  overflow: auto;
}

@keyframes PskDrawer {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.PskDrawer_close {
  transform: translateX(-100%);
  animation: PskDrawer_close 500ms;
}

@keyframes PskDrawer_close {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(-100%);
  }
}

.PskDrawer__linkBack {
  margin: 56px 0 0 0;
}
</style>
