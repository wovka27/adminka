<script setup lang="ts">
import type PskInput from '@/components/UI/PskInput.vue'

interface IFormSiteProps {
  modelValue: {
    text_header: string
    text_content: string
    text_btn: string
  }
}

defineProps<IFormSiteProps>()
defineEmits(['update:modelValue'])

const inputList: {
  key: keyof IFormSiteProps['modelValue']
  label: string
  placeholder: string
  type: InstanceType<typeof PskInput>['type']
}[] = [
  { key: 'text_header', label: 'Заголовок формы', placeholder: 'Введите заголовок', type: 'text' },
  { key: 'text_content', label: 'Текст в форме', placeholder: 'Введите текст', type: 'textarea' },
  { key: 'text_btn', label: 'Текст кнопки в форме', placeholder: 'Введите текст', type: 'text' }
]
</script>

<template>
  <div class="FormSite">
    <h1 class="FormSite__h1">Параметры формы</h1>

    <PskInput
      v-for="input of inputList"
      :key="input.key"
      :model-value="modelValue[input.key]"
      @update:model-value="$emit('update:modelValue', { ...modelValue, [input.key]: $event })"
      :label="input.label"
      :placeholder="input.placeholder"
      :type="input.type"
    />
  </div>
</template>

<style lang="scss">
.FormSite {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.FormSite__h1 {
  @include setFontStyle6();
}
</style>
