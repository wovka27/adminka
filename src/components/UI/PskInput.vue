<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { computed } from 'vue'

export interface IPskInputProps {
  modelValue: string
  label?: string
  label_uid?: string
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
const _emit = (value?: string) => emit('update:modelValue', value)

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
    default:
      return ''
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

const getNum = (str: string) => str.replace(/\D/g, '')

const getModelPhone = (val: string, p: string = '+7 (___) ___-__-__') => {
  const v = getNum(val)
  return ((l, i = 0) => p.replace(/./g, (w) => (/[_\d]/.test(w) && i < l ? v.charAt(i++) : i >= l ? '' : w)))(v.length)
}

const getModelPercent = (val: string) => {
  if (/^-?\d*(\.\d*)?$/.test(val)) return `${+val <= 100 ? val : 100}`
}

const getModelOnlyWords = (val: string) => val.replace(/[^A-Za-z]/g, '')

const getModelUppercase = (val: string) => getModelOnlyWords(val).toUpperCase()

const setModelPercent = (val: string) => _emit(getModelPercent(val))

const setModelCash = (value: string) => {
  const has_sign_minus = value[0] === '-'
  const number = getNum(value)
  const result = has_sign_minus ? '-' + number : number

  if (value === '0-') {
    _emit('-')
    return
  }

  if (value === '- ') {
    _emit('')
    return
  }

  _emit(result)
  return
}

const setModelNumber = (value: string) => {
  if (/^-?\d*(\.\d*)?$/.test(value)) _emit(value)
}

const setModelPhone = (value: string) => _emit(getNum(value).replace(/^\d/, '7').slice(0, 11))

const setModelOnlyWords = (value: string) => _emit(getModelOnlyWords(value))

const setModelUppercase = (value: string) => _emit(getModelUppercase(value))

const model = computed({
  get: () => {
    switch (props.type) {
      case 'cash':
        return getModelCash()
      case 'phone':
        return getModelPhone(props.modelValue)
      case 'only_words':
        return getModelOnlyWords(props.modelValue)
      case 'uppercase':
        return getModelUppercase(props.modelValue)
      default:
        return props.modelValue
    }
  },
  set: (value: string) => {
    switch (props.type) {
      case 'cash':
        setModelCash(value)
        break
      case 'number':
        setModelNumber(value)
        break
      case 'phone':
        setModelPhone(value)
        break
      case 'percent':
        setModelPercent(value)
        break
      case 'only_words':
        setModelOnlyWords(value)
        break
      case 'uppercase':
        setModelUppercase(value)
        break
      default:
        _emit(value)
    }
  }
})
</script>

<template>
  <div class="PskInput" :class="{ PskInput_error: error }">
    <header class="PskInput__header">
      <div class="PskInput__labelWrapper">
        <div class="PskInput__label" v-if="label" :required="required">{{ label }}</div>
        <p class="PskInput__labelUid" v-if="label_uid">{{ label_uid }}</p>
      </div>
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

.PskInput__labelWrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

.PskInput__labelUid {
  color: #909399;
  font-family: 'Open Sans';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
