<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { computed } from 'vue'

export interface IPskInputProps {
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  limit?: string
  type?: 'text' | 'textarea' | 'password' | 'cash' | 'phone' | 'number' | 'percent' | 'only_words' | 'uppercase'
  required?: boolean
  clearable?: boolean
  size?: 'small' | 'default' | 'large'
  handleRemoved?: Function

  error?: boolean | string
  id?: string
  name?: string
}

const props = defineProps<IPskInputProps>()
const emit = defineEmits(['update:modelValue'])

const _placeholder = computed(() => {
  if (props.disabled) return
  if (props.placeholder) return props.placeholder

  switch (props.type) {
    case undefined:
    case 'text':
    case 'only_words':
      return 'Введите название'

    case 'percent':
    case 'number':
      return 'Введите значение'

    case 'cash':
      return 'Введите сумму'
    case 'phone':
      return 'Введите номер телефона'
    case 'password':
      return 'Введите пароль'
    case 'textarea':
      return 'Введите описание'
  }
})

const _type = computed(() =>
  new Map([
    ['textarea', 'textarea'],
    ['password', 'password']
  ]).get(props.type || 'text')
)

const getModelCash = () => {
  if (props.modelValue === '') return ''
  if (props.modelValue === '-') return '- '

  const has_sign_minus = props.modelValue[0] === '-'
  const number = (+props.modelValue.replace(/[^0-9]/g, '')).toLocaleString('fr')
  return has_sign_minus ? '- ' + number : number
}

const getModelPhone = (val: string, pattern: string = '+7 (___) ___-__-__') => {
  let i = 0
  const value = val.replace(/\D/g, '')
  return pattern.replace(/./g, (w) =>
    /[_\d]/.test(w) && i < value.length ? value.charAt(i++) : i >= value.length ? '' : w
  )
}

const getModelPercent = (val: string) => {
  if (/^-?\d*(\.\d*)?$/.test(val)) {
    return `${+val <= 100 ? val : 100}`
  }
}

const getModelOnlyWords = (val: string) => val.replace(/[^A-Za-z]/g, '')

const getModelUppercase = (val: string) => getModelOnlyWords(val).toUpperCase()

const setModelPercent = (val: string) => {
  emit('update:modelValue', getModelPercent(val))
}

const setModelCash = (value: string) => {
  const has_sign_minus = value[0] === '-'
  const number = value.replace(/\D+/g, '')
  const result = has_sign_minus ? '-' + number : number

  if (value === '0-') {
    emit('update:modelValue', '-')
    return
  }

  if (value === '- ') {
    emit('update:modelValue', '')
    return
  }

  emit('update:modelValue', result)
  return
}

const setModelNumber = (value: string) => {
  if (/^-?\d*(\.\d*)?$/.test(value)) {
    emit('update:modelValue', value)
  }
}

const setModelPhone = (value: string) => {
  emit('update:modelValue', value)
}

const setModelOnlyWords = (value: string) => {
  emit('update:modelValue', getModelOnlyWords(value))
}

const setModelUppercase = (value: string) => {
  emit('update:modelValue', getModelUppercase(value))
}

const model = computed({
  get: () => {
    if (props.type === 'cash') {
      return getModelCash()
    }
    if (props.type === 'phone') {
      return getModelPhone(props.modelValue)
    }

    if (props.type === 'only_words') {
      return getModelOnlyWords(props.modelValue)
    }

    if (props.type === 'uppercase') {
      return getModelUppercase(props.modelValue)
    }

    return props.modelValue
  },
  set: (value: string) => {
    if (props.type === 'cash') {
      setModelCash(value)
      return
    }

    if (props.type === 'number') {
      setModelNumber(value)
      return
    }

    if (props.type === 'phone') {
      setModelPhone(value.replace(/\D/g, '').replace(/^\d/, '7').slice(0, 11))
      return
    }

    if (props.type === 'percent') {
      setModelPercent(value)
      return
    }

    if (props.type === 'only_words') {
      setModelOnlyWords(value)
      return
    }

    if (props.type == 'uppercase') {
      return setModelUppercase(value)
    }

    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div class="PskInput" :class="{ PskInput_error: error }">
    <header class="PskInput__header">
      <div class="PskInput__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskInput__headerSlot">
        <slot />
      </div>
    </header>

    <div class="PskInput__main">
      <el-input
        :size="size"
        v-model="model"
        :maxlength="limit"
        :placeholder="_placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :show-password="type === 'password'"
        :type="_type"
        :rows="type === 'textarea' ? 5 : 1"
        :clearable="clearable"
      />

      <el-icon class="iconHover_danger" v-if="handleRemoved" @click="handleRemoved()">
        <Delete />
      </el-icon>
    </div>

    <div class="PskInput__messageError" v-if="typeof error === 'string'">{{ error }}</div>
  </div>
</template>

<style lang="scss">
.PskInput {
  position: relative;
  width: 100%;
}

.PskInput_error {
  .PskInput__main {
    .el-input__wrapper.is-focus {
      box-shadow: 0 0 0 1px $c_danger inset;
    }
  }
}

.PskInput__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskInput__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskInput__main {
  display: flex;
  align-items: center;
  gap: 13px;
}

.PskInput__messageError {
  @include setFontStyle7();
  color: $c_danger;
}
</style>
