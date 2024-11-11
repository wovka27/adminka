<script lang="ts" setup>
export interface IPskMultiStringProps {
  modelValue: string[]
  btn_label: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

defineProps<IPskMultiStringProps>()
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="PskMultiString">
    <header class="PskMultiString__header">
      <div class="PskMultiString__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskMultiString__headerSlot">
        <slot />
      </div>
    </header>

    <div class="PskMultiString__main">
      <div class="PskMultiString__inputBox gridForm">
        <PskInput
          v-for="(model, idx) in modelValue"
          :key="idx"
          :model-value="model"
          :placeholder="placeholder ?? 'Введите название'"
          @update:model-value="$emit('update:modelValue', modelValue.toSpliced(idx, 1, $event))"
          :handle-removed="() => $emit('update:modelValue', modelValue.toSpliced(idx, 1))"
        />
      </div>

      <PskButton
        icon
        class="PskMultiString__btnAdd"
        size="small"
        @click="$emit('update:modelValue', [...modelValue, ''])"
      >
        {{ btn_label }}
        <template #icon>
          <el-icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7 0.5C6.72386 0.5 6.5 0.723858 6.5 1V6.5H1C0.723858 6.5 0.5 6.72386 0.5 7C0.5 7.27614 0.723858 7.5 1 7.5H6.5V13C6.5 13.2761 6.72386 13.5 7 13.5C7.27614 13.5 7.5 13.2761 7.5 13V7.5H13C13.2761 7.5 13.5 7.27614 13.5 7C13.5 6.72386 13.2761 6.5 13 6.5H7.5V1C7.5 0.723858 7.27614 0.5 7 0.5Z"
                fill="white"
              />
            </svg>
          </el-icon>
        </template>
      </PskButton>
    </div>
  </div>
</template>

<style lang="scss">
.PskMultiString {
  width: 100%;
}

.PskMultiString__header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.PskMultiString__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskMultiString__main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.PskMultiString__noData {
  margin: 10px 0 0 0;
  padding: 3px 20px;
  width: max-content;
  color: $c_light;
  border: 2px solid $c_border_light;
  border-radius: 4px;
}

.PskMultiString__inputBox {
  gap: 10px 20px;
}
</style>
