<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

interface IPskMapFieldProps {
  modelValue: [number, number] | null
  id: string
  label?: string
  required?: boolean
}

const props = defineProps<IPskMapFieldProps>()
const emits = defineEmits(['update:modelValue'])
const is_ymaps = ref<boolean>(false)

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', value)
  }
})

const model_input = computed(() => (props.modelValue?.length ? `${props.modelValue[0]}, ${props.modelValue[1]}` : ''))

const options = computed(() => ({
  center: model.value?.length ? [model.value[0], model.value[1]] : [57.1522, 65.5272],
  zoom: 15,
  controls: ['zoomControl', 'fullscreenControl']
}))

onMounted(() => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  if (!('ymaps' in window) || !props.id) return
  is_ymaps.value = true
  // @ts-ignore
  // eslint-disable-next-line no-undef
  ymaps.ready(() => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const map = new ymaps.Map(props.id, options.value)
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const marker = new ymaps.Placemark(props.modelValue)
    map.geoObjects.add(marker)

    map.events.add(['click'], (e: any) => {
      props.modelValue
        ? marker.geometry.setCoordinates(e.get('coords'))
        : setTimeout(() => {
            marker.geometry.setCoordinates(e.get('coords'))
          }, 300)
      map.setCenter(e.get('coords'), map.getZoom(), { duration: 300 })
      model.value = e.get('coords')
    })
  })
})
</script>

<template>
  <div v-if="is_ymaps || id" class="PskMapField">
    <header class="PskMapField__header">
      <div class="PskMapField__label" v-if="label" :required="required">{{ label }}</div>
      <div class="PskMapField__headerSlot">
        <slot />
      </div>
    </header>

    <div class="PskMapField__map" :id="id"></div>
    <PskInput class="PskMapField__input" v-model="model_input" disabled label="Геометка" />
  </div>
</template>

<style lang="scss">
.PskMapField__map {
  height: 470px;
}
.PskMapField__input {
  margin-top: 30px;
}

.PskMapField__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskMapField__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}
</style>
