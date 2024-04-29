<script setup lang="ts">
import { CloseBold } from '@element-plus/icons-vue'

export interface IPskButtonProps {
  size?: 'small' | 'default' | 'large'
  icon?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'clear'
  native_type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<IPskButtonProps>(), {
  native_type: 'button'
})

defineEmits(['click'])
</script>

<template>
  <div class="PskButton">
    <el-button
      v-if="type !== 'clear'"
      :type="type || 'primary'"
      :size="size"
      :native-type="native_type"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <template v-if="icon" #icon>
        <slot name="icon" />
      </template>
      <slot />
    </el-button>

    <button v-else class="PskButton__clear" :type="native_type" :disabled="disabled" @click="$emit('click')">
      <el-icon>
        <CloseBold />
      </el-icon>
      <slot />
    </button>
  </div>
</template>

<style lang="scss">
.PskButton {
  width: max-content;

  .el-button {
    font-weight: 600;
    font-size: 14px;
  }
}

.PskButton__clear {
  @include setFontStyle6();

  background: none;
  border: none;

  display: flex;
  align-items: center;
  gap: 2px;

  cursor: pointer;

  transition: color 200ms ease-in-out;

  &:hover {
    color: $c_danger;
  }
}
</style>
