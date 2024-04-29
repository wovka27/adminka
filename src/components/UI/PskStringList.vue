<script lang="ts" setup>
import { computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'

export interface IPskStringListProps {
  modelValue: string[]
  name?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  handleRemoved?: (...arg: any) => any

  // error?: boolean
  id?: string
}

const props = defineProps<IPskStringListProps>()
const emits = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
  }
})
</script>

<template>
  <div class="PskStringList">
    <header class="PskStringList__header">
      <div class="PskStringList__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskStringList__headerSlot">
        <slot />
      </div>
    </header>

    <div class="PskStringList__main">
      <el-select class="PskStringList__elSelect" v-model="model" multiple allow-create filterable collapse-tags :placeholder="placeholder ?? 'Выберите'">
        <el-option v-for="item in modelValue" :key="item" :label="item" :value="item" />
      </el-select>

      <el-icon class="iconHover_danger" v-if="handleRemoved" @click="handleRemoved()">
        <Delete />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss">
.PskStringList {
  width: 100%;
}

.PskStringList__elSelect {
  width: 100%;
}

.PskStringList__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskStringList__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskStringList__main {
  display: flex;
  align-items: center;
  gap: 13px;
}
</style>
