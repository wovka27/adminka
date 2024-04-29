<script lang="ts" setup>
export interface IPskCheckListProps {
  modelValue: modelValueType[]
  multiple?: boolean
}

type modelValueType = {
  label: string
  disabled?: boolean
  checked: boolean
}

const props = defineProps<IPskCheckListProps>()
const emit = defineEmits(['update:modelValue'])

const handleClickOption = (option: modelValueType) => {
  if (option.disabled) return

  if (props.multiple) {
    const result = props.modelValue.map((i) => {
      if (i.label === option.label) {
        return { ...i, checked: !option.checked }
      }

      return i
    })

    emit('update:modelValue', result)
    return
  }

  if (option.checked) return

  const result = props.modelValue.map((i) => ({ ...i, checked: i.label === option.label }))

  emit('update:modelValue', result)
}
</script>

<template>
  <span
    class="PskCheckList"
    v-for="option of modelValue"
    :key="option.label"
    :class="{ PskCheckList_checked: option.checked, PskCheckList_disabled: option.disabled }"
    @click="handleClickOption(option)"
  >
    <span class="PskCheckList__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.35993 8.04738L1.06293 4.75037C0.9276 4.61504 0.7661 4.57337 0.578433 4.62537C0.390766 4.67737 0.2736 4.79454 0.226933 4.97687C0.180266 5.15921 0.2246 5.32321 0.359933 5.46887L4.35993 9.46887L12.3599 1.46887C12.4536 1.36454 12.4979 1.24471 12.4929 1.10938C12.4879 0.974042 12.4358 0.856875 12.3364 0.757875C12.2371 0.658875 12.1224 0.609375 11.9924 0.609375C11.8624 0.609375 11.7453 0.656208 11.6409 0.749875L4.35993 8.04738Z"
          fill="#67C23A"
        />
      </svg>
    </span>

    <label class="PskCheckList__label">{{ option.label }}</label>
  </span>
</template>

<style lang="scss">
.PskCheckList {
  display: flex;
  gap: 4px;
  align-items: center;
  width: max-content;
  cursor: pointer;

  .PskCheckList__icon {
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
    cursor: inherit;
  }

  .PskCheckList__label {
    @include setFontStyle6();
    cursor: inherit;

    opacity: 0.33;
    transition:
      opacity 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }

  &.PskCheckList_disabled {
    cursor: not-allowed;

    &:hover {
      .PskCheckList__icon {
        opacity: 0;
      }

      .PskCheckList__label {
        opacity: 0.33;
      }
    }
  }
}

.PskCheckList:hover {
  .PskCheckList__label {
    opacity: 0.66;
  }

  .PskCheckList__icon {
    opacity: 0.5;
  }
}

.PskCheckList_checked {
  .PskCheckList__label {
    opacity: 1 !important;
    color: $c_success;
  }

  .PskCheckList__icon {
    opacity: 1 !important;
  }

  &.PskCheckList_disabled {
    cursor: not-allowed;

    &:hover {
      .PskCheckList__icon {
        opacity: 1;
      }

      .PskCheckList__label {
        opacity: 1;
      }
    }
  }
}
</style>
