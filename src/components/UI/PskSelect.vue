<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { computed } from 'vue'

export interface IPskSelectProps {
  modelValue: any
  options: any[]
  options_value?: string
  options_label?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  group?: boolean
  required?: boolean
  multiple?: boolean
  clearable?: boolean
  value_key?: string
  handleRemoved?: (...arg: any) => any
  id?: string
  name?: string
}

const props = withDefaults(defineProps<IPskSelectProps>(), { options_label: 'label' })
const emit = defineEmits(['update:modelValue', 'change'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div class="PskSelect">
    <header class="PskSelect__header">
      <div class="PskSelect__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskSelect__slot">
        <slot />
      </div>
    </header>

    <div class="PskSelect__main">
      <el-select
        class="PskSelect__el-select"
        v-model="model"
        :multiple="multiple"
        :disabled="disabled"
        collapse-tags
        :placeholder="placeholder || 'Выберите'"
        :value-key="value_key"
        @change="emit('change', $event)"
        :filterable="options?.length > 6"
        :clearable="clearable"
      >
        <template v-for="item in options" :key="item.value">
          <el-option-group v-if="group && item.children?.length" :label="item[options_label]">
            <el-option
              v-for="itm of item.children"
              :key="itm.value"
              :label="itm[options_label]"
              :disabled="typeof itm === 'object' && 'is_active' in itm && !itm['is_active']"
              :value="options_value ? itm[options_value] : itm"
            />
          </el-option-group>
          <el-option
            v-else
            :label="item[options_label]"
            :value="options_value ? item[options_value] : item"
            :disabled="typeof item === 'object' && 'is_active' in item && !item['is_active']"
          />
        </template>
      </el-select>

      <el-icon class="iconHover_danger" v-if="handleRemoved" @click="handleRemoved()">
        <Delete />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss">
.PskSelect {
  width: 100%;
}

.PskSelect__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskSelect__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskSelect__main {
  display: flex;
  align-items: center;
  gap: 13px;
}

.PskSelect__el-select {
  width: 100%;
}
</style>
