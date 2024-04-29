<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router'

export interface IPskLinkProps extends RouterLinkProps {
  color?: 'primary_dark'
  native?: boolean
  smallFontWeight?: boolean
}

defineProps<IPskLinkProps>()
</script>

<template>
  <RouterLink v-if="!native" class="PskLink" :class="{ [color + '']: color, smallFontWeight }" :to="to">
    <slot />
  </RouterLink>
  <a v-else :href="`${to}`" class="PskLink"><slot /></a>
</template>

<style lang="scss">
.PskLink {
  --c_text: #409effff;
  --c_border: var(--c_text);
  @include setFontStyle6();
  color: var(--c_text);
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease-in-out;

  text-decoration: none;

  &:hover {
    border-color: var(--c_border);
  }
  &.smallFontWeight {
    font-weight: 400;
    font-size: 12px;
  }
}
.PskLink.primary_dark {
  --c_text: #4670a7;
  --c_border: var(--c_text);
}
</style>
