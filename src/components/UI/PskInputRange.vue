<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

export interface IPskInputRangeProps {
  min: string
  max: string
  label?: string
  placeholder_min?: string
  placeholder_max?: string
  disabled?: boolean
  readonly?: boolean
  type?: 'cash' | 'number'
  required?: boolean
  handleRemoved?: Function

  error?: boolean | string
  id?: string
  name?: string
}

const props = defineProps<IPskInputRangeProps>()
const emit = defineEmits(['update:max', 'update:min'])

const is_focused = ref(false)

const getCashFormat = (value: string) => {
  if (!value) return ''
  if (value === '-') return '- '

  const has_sign_minus = value[0] === '-'

  const number = Number(String(value).replace(/\D/g, '')).toLocaleString('fr')

  return has_sign_minus ? '- ' + number : number
}

const getModelCash = (value: string) => {
  const has_sign_minus = value[0] === '-'
  const number = value.replace(/[^0-9]/g, '')
  const result = has_sign_minus ? '-' + number : number

  if (value === '0-') {
    return '-'
  }

  if (value === '- ') {
    return ''
  }

  return result
}

const min_model = computed({
  get: () => {
    if (props.type === 'cash') {
      return getCashFormat(props.min)
    }

    return props.min
  },
  set: (value: string) => {
    if (props.type === 'cash') {
      emit('update:min', getModelCash(value))
      return
    }

    if (props.type === 'number') {
      ;/^-?\d*(\.\d*)?$/.test(value) && emit('update:min', value)
      return
    }

    emit('update:min', value)
  }
})

const max_model = computed({
  get: () => {
    if (props.type === 'cash') {
      return getCashFormat(props.max)
    }

    return props.max
  },
  set: (value: string) => {
    if (props.type === 'cash') {
      emit('update:max', getModelCash(value))
      return
    }

    if (props.type === 'number') {
      ;/^-?\d*(\.\d*)?$/.test(value) && emit('update:max', value)
      return
    }

    emit('update:max', value)
  }
})
</script>

<template>
  <div class="PskInputRange" :class="{ PskInputRange_error: error }">
    <header class="PskInputRange__header">
      <div class="PskInputRange__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskInputRange__headerSlot"><slot /></div>
    </header>

    <div class="PskInputRange__main">
      <div class="PskInputRange__mainInputs" :class="{ PskInputRange__mainInputs_focus: is_focused }">
        <el-input
          @focus="is_focused = true"
          @blur="is_focused = false"
          v-model="min_model"
          :placeholder="placeholder_min"
          :disabled="disabled"
          :readonly="readonly"
        />
        -
        <el-input
          @focus="is_focused = true"
          @blur="is_focused = false"
          v-model="max_model"
          :placeholder="placeholder_max"
          :disabled="disabled"
          :readonly="readonly"
        />
      </div>

      <el-icon class="iconHover_danger" v-if="handleRemoved" @click="handleRemoved()">
        <Delete />
      </el-icon>
    </div>

    <div class="PskInputRange__messageError" v-if="typeof error === 'string'">{{ error }}</div>
  </div>
</template>

<style lang="scss">
.PskInputRange {
  position: relative;
  width: 100%;
}

.PskInputRange_error {
  .PskInputRange__main {
    .el-input__wrapper.is-focus {
      box-shadow: 0 0 0 1px $c_danger inset;
    }
  }
}

.PskInputRange__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskInputRange__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskInputRange__main {
  display: flex;
  align-items: center;
  gap: 13px;
}

.PskInputRange__mainInputs {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background-color: $c_body;
  color: #606266;

  .el-input__wrapper {
    box-shadow: none;
  }

  .el-input {
    &:last-child {
      input {
        text-align: right;
      }
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    // border: 1.5px solid #dcdfe6;
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    border-radius: 4px;
    transition: box-shadow 0.2s ease-in-out;
    pointer-events: none;
  }
}

.PskInputRange__mainInputs_focus {
  &::after {
    // border-color: $c_primary;
    box-shadow: 0 0 0 1px $c_primary inset;
  }
}

.PskInputRange__messageError {
  @include setFontStyle7();
  color: $c_danger;
}
</style>
