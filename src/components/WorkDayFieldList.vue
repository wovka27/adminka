<script setup lang="ts">
interface IWorkDayField {
  modelValue: IWorkDayFieldModelValueItem[]
}

interface IWorkDayFieldModelValueItem {
  day: string[]
  open_at: string
  close_at: string
}

interface ISelectItem {
  key: keyof IWorkDayFieldModelValueItem
  placeholder: string
  options: string[]
  multi?: boolean
}

const time_ranges_list = Array.from({ length: (24 * 60) / 5 }, (_, i) =>
  new Date(0, 0, 0, 0, i * 5).toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric' })
)

const work_days_list = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

const props = defineProps<IWorkDayField>()
const emit = defineEmits(['update:modelValue'])

const selectList: ISelectItem[] = [
  { key: 'day', placeholder: 'Выберите', options: work_days_list, multi: true },
  { key: 'open_at', placeholder: 'Время открытия', options: time_ranges_list },
  { key: 'close_at', placeholder: 'Время закрытия', options: time_ranges_list }
]

const addField = () => {
  emit('update:modelValue', [...props.modelValue, { day: [], open_at: '', close_at: '' }])
}
const handleUpdateField = (key: ISelectItem['key'], value: string | string[], idx: number) => {
  const result = props.modelValue.at(idx)
  result && emit('update:modelValue', props.modelValue.toSpliced(idx, 1, { ...result, [key]: value }))
}
</script>

<template>
  <div class="WorkdayField">
    <header class="WorkdayField__header">
      <div class="WorkdayField__label" required="true">Рабочие дни</div>
    </header>
    <div v-for="(field, idx) of modelValue" :key="idx" class="WorkdayField__list">
      <PskSelect
        v-for="select of selectList"
        :key="select.key"
        :model-value="field[select.key]"
        @update:model-value="handleUpdateField(select.key, $event, idx)"
        :placeholder="select.placeholder"
        :options="select.options"
        :multiple="select.multi"
      />
    </div>
    <PskButton
      class="WorkdayField__btn"
      @click="addField"
      v-if="modelValue.length < work_days_list.length"
      type="primary"
      size="small"
    >
      Добавить дни
    </PskButton>
  </div>
</template>

<style lang="scss">
.WorkdayField {
  grid-column: span 3;
}

.WorkdayField__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.WorkdayField__btn {
  margin-top: 20px;
}

.WorkdayField__list {
  display: flex;
  align-items: flex-end;
  column-gap: 30px;
  flex-wrap: nowrap;
}
</style>
