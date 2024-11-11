<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useFiltersStore } from '@/stores'

import AggregatorsLayout, { type IAggregatorsLayoutProps } from '@/layouts/AggregatorsLayout.vue'
import FormLayout from '@/layouts/FormLayout.vue'

import ComplexAvito from '@/components/Complex/ComplexAvito.vue'
import ComplexCian from '@/components/Complex/ComplexCian.vue'
import ComplexDomClick from '@/components/Complex/ComplexDomClick.vue'
import ComplexM2 from '@/components/Complex/ComplexM2.vue'
import ComplexYandex from '@/components/Complex/ComplexYandex.vue'
import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import type { IAggregatorItem } from '@/services/REST/dom_admin/common_types'
import { fetchGetComplex, fetchUpdateComplex } from '@/services/REST/dom_admin/complex'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()
const filters_store = useFiltersStore()

const refs = useRefs('complex-classes')

const { material_type_options, materials, getMaterials, attach, detach, getRequestDataMaterials } =
  useUploadMaterials('complex')

const { is_data_loaded, getIsStateBeforeEqualAfter, apply, pushCommonData, default_fields } = useEditorView({
  router,
  back_route_name: 'complex_list',
  fetchGetEntity: fetchGetComplex,
  default_fields: true,
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateComplex,
      beforeResponseFn: async () => {
        const complex_uid = router.currentRoute.value.params.uid as string
        await detach(complex_uid)
        await attach(complex_uid)
      },
      afterResponseFn: async (response_complex, request_data_before) => {
        if (response_complex.show !== request_data_before.show) await filters_store.setFiltersComplex()

        aggregators_items = response_complex.aggregators_items
          ? response_complex.aggregators_items.map(getAggregatorItem)
          : []
      }
    }
  },
  getRequestData: () => ({
    ...getRequestDataMaterials(),
    name: name.value,
    title: title.value,
    map_objects: map_objects.value,
    region: region.value,
    city: city.value,
    address: address.value,
    houses_quantity: houses_quantity.value ? +houses_quantity.value : null,
    total_square: total_square.value,
    common_square: common_square.value,
    class_type: class_type.value,
    construction_material: construction_material.value,
    inhabitants: inhabitants.value ? +inhabitants.value : null,
    description: description.value
  }),
  setFormData: (form_data) => {
    getMaterials(form_data.media)
    name.value = form_data.name || ''
    title.value = form_data.title || ''
    map_objects.value = form_data.map_objects
    region.value = form_data.region || ''
    city.value = form_data.city || ''
    address.value = form_data.address || ''
    houses_quantity.value = getNumString(form_data.houses_quantity)
    total_square.value = form_data.total_square || ''
    common_square.value = form_data.common_square || ''
    class_type.value = form_data.class_type || ''
    construction_material.value = form_data.construction_material || ''
    inhabitants.value = getNumString(form_data.houses_quantity)
    description.value = form_data.description || ''
  },
  mount: {
    common: {
      app_header_props: ([response_complex]) => ({
        title: response_complex.name,
        breadcrumbs: [
          {
            label: 'Жилые комплексы',
            route: getHandleBackArgs('complex_list')
          },
          {
            label: response_complex.name
          }
        ]
      }),
      fn: async ([response_complex]) => {
        aggregators_items = response_complex.aggregators_items
          ? response_complex.aggregators_items.map(getAggregatorItem)
          : []
      }
    }
  }
})

const name = ref('')
const title = ref('')
const region = ref('')
const city = ref('')
const address = ref('')
const houses_quantity = ref('')
const total_square = ref('')
const common_square = ref('')
const class_type = ref('')
const construction_material = ref('')
const inhabitants = ref('')
const description = ref('')
const map_objects = ref<[number, number] | null>(null)

let aggregators_items: IAggregatorsLayoutProps['aggregators'] = []

const getAggregatorItem = (aggregator: IAggregatorItem) => {
  const result = new Map([
    ['avito_complex', { ...aggregator, component: ComplexAvito }],
    ['cian_complex', { ...aggregator, component: ComplexCian }],
    ['dom_click_complex', { ...aggregator, component: ComplexDomClick }],
    ['yandex_complex', { ...aggregator, component: ComplexYandex }],
    ['m2_complex', { ...aggregator, component: ComplexM2 }]
  ])
  return result.get(aggregator.type)!
}
</script>

<template>
  <AggregatorsLayout
    v-if="is_data_loaded"
    :aggregators="aggregators_items"
    :getIsStateBeforeEqualAfter="getIsStateBeforeEqualAfter"
    @pushCommonData="pushCommonData"
  >
    <FormLayout :apply="apply">
      <PskGridContainer grid-column-count="3">
        <DefaultFormFields v-model="default_fields" is_show_dates />
        <PskInput class="span-2" v-model="name" label="Название" disabled placeholder="Введите название">
          <el-popover placement="top" trigger="hover" width="fit-content">
            <template #reference>
              <el-icon class="iconHover_default" style="font-size: 13px">
                <Warning />
              </el-icon>
            </template>
            Забирается на все типы фидов
          </el-popover>
        </PskInput>
        <PskInput v-model="title" label="Коммерческое название" required placeholder="Введите название" />
        <UploadMedia class="span-3" v-model="materials" :types="material_type_options" />
        <PskMapField class="span-2" v-model="map_objects" id="map_objects" label="Метка на карте" required />

        <PskGridContainer grid-column-count="3" grid-span="3" title="Объекты ЖК">
          <PskInput v-model="region" label="Область" placeholder="Введите название" />
          <PskInput v-model="city" label="Город" placeholder="Введите название" />
          <PskInput v-model="address" label="Адрес" placeholder="Введите адрес" class="span-3" />
          <PskInput v-model="houses_quantity" label="Кол-во домов" type="number" placeholder="Введите значение" />
          <PskInput v-model="total_square" label="Общая площадь, м²" type="number" placeholder="Введите значение" />
          <PskInput v-model="common_square" label="Жилая площадь, м²" type="number" placeholder="Введите значение" />
          <PskSelect
            v-model="class_type"
            :options="refs.complex_classes"
            label="Класс жилья"
            options_value="value"
            options_label="label"
            placeholder="Выберите класс"
          />
          <PskInput v-model="construction_material" label="Материал стен" />
          <PskInput v-model="inhabitants" label="Количество жителей" type="number" placeholder="Введите значение" />
          <PskWYSIWYGEditor v-model="description" label="Описание" />
        </PskGridContainer>
      </PskGridContainer>
    </FormLayout>
  </AggregatorsLayout>
</template>
