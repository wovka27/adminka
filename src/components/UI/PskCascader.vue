<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import type { CascaderOption } from 'element-plus'
import { computed } from 'vue'

export interface IPskCascaderOption {
  label: string
  value: string
  children: IPskCascaderOption[]
}

export interface IPskCascaderProps {
  modelValue: any
  options: IPskCascaderOption[]

  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  collapse_tags?: boolean
  multiple?: boolean
  clearable?: boolean
  handleRemoved?: (...arg: any) => any

  // error?: boolean | string
  id?: string
  name?: string
}

const props = defineProps<IPskCascaderProps>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div class="PskCascader">
    <header class="PskCascader__header">
      <div class="PskCascader__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskCascader__slot">
        <slot />
      </div>
    </header>

    <div class="PskCascader__main">
      <el-cascader
        :collapse-tags="collapse_tags"
        class="PskCascader__el-select"
        :props="{
          expandTrigger: 'hover',
          multiple,
          disabled: (data: CascaderOption) => 'is_active' in data && !data.is_active
        }"
        last-level
        v-model="model"
        :placeholder="placeholder"
        :clearable="clearable"
        :options="options"
      />

      <el-icon class="iconHover_danger" v-if="handleRemoved" @click="handleRemoved()">
        <Delete />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss">
.PskCascader {
  width: 100%;
}

.PskCascader__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskCascader__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskCascader__main {
  display: flex;
  align-items: center;
  gap: 13px;
}

.PskCascader__el-select {
  width: 100%;
}
</style>
