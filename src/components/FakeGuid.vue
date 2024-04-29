<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { uuid } from 'vue-uuid'

interface IFakeGuidProps {
  guid_base: string
  guid_fake?: string
}

type GuidRadioType = keyof IFakeGuidProps

const props = defineProps<IFakeGuidProps>()
const emit = defineEmits(['update:guid_fake'])

const guid_radio = ref<GuidRadioType>('guid_base')

const model_fake = computed({
  get: () => props.guid_fake || '',
  set: (value) => emit('update:guid_fake', value)
})

const changeRadio = (value: GuidRadioType) =>
  (guid_radio.value = value) === 'guid_base' && emit('update:guid_fake', null)

const initRadio = () => (guid_radio.value = !model_fake.value || !props.guid_base ? 'guid_base' : 'guid_fake')

onMounted(initRadio)
</script>

<template>
  <el-radio-group :model-value="guid_radio" @update:modelValue="changeRadio($event)" class="FakeGuid">
    <PskInput disabled :model-value="guid_base">
      <el-radio label="guid_base">GUID. Оригинальное объявление</el-radio>
    </PskInput>
    <div class="FakeGuid__fake">
      <PskInput disabled v-model="model_fake">
        <el-radio label="guid_fake">Подменный GUID. Для нового объявления</el-radio>
      </PskInput>
      <PskButton
        class="FakeGuid__btn"
        @click="emit('update:guid_fake', uuid.v1())"
        :disabled="guid_radio === 'guid_base'"
        type="primary"
        size="default"
      >
        Сгенерировать
      </PskButton>
    </div>
  </el-radio-group>
</template>

<style lang="scss">
.FakeGuid {
  grid-column: span 3;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: nowrap;
}

.FakeGuid__btn {
  .el-button.is-disabled {
    background-color: #dcdfe6;
    border-color: #dcdfe6;
  }
}

.FakeGuid__fake {
  width: 100%;
  display: flex;
  align-items: end;
  gap: 10px;
  flex-wrap: nowrap;
}
</style>
