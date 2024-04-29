<script setup lang="ts">
import { computed } from 'vue'

interface IPskSwitchProps {
  modelValue: boolean
  label?: string
  required?: boolean
}

const props = defineProps<IPskSwitchProps>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', !!value)
  }
})
</script>

<template>
  <div class="PskSwitch">
    <header class="PskSwitch__header">
      <div class="PskSwitch__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskSwitch__headerSlot"><slot /></div>
    </header>

    <div class="PskSwitch__main">
      <el-switch v-model="model" />
    </div>
  </div>
</template>

<style lang="scss">
.PskSwitch {
  position: relative;
}

.PskSwitch__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskSwitch__label {
  @include setFontStyle3();
  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskSwitch__main {
  display: flex;
  align-items: center;
  gap: 13px;
}
</style>
