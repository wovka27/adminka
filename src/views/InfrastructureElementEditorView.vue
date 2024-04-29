<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  fetchCreateInfrastructureElementItem,
  fetchGetInfrastructureElementItem,
  fetchUpdateInfrastructureElementItem
} from '@/services/REST/dom_admin/infrastructure_element'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()

const refs = useRefs('complexes-with-infrastructure-categories')
const { material_type_options, materials, getMaterials, attach, detach, getRequestDataMaterials } =
  useUploadMaterials('element')

const { apply, is_data_loaded, default_fields } = useEditorView({
  router,
  fetchGetEntity: fetchGetInfrastructureElementItem,
  default_fields: true,
  back_route_name: 'infrastructure_element_list',
  apply: {
    create: {
      fetchCreateEntity: fetchCreateInfrastructureElementItem,
      afterResponseFn: async (response) => {
        await attach(response.uid)
      },
      success_message: 'Объект успешно создан'
    },
    update: {
      fetchUpdateEntity: fetchUpdateInfrastructureElementItem,
      beforeResponseFn: async () => {
        await detach(router.currentRoute.value.params.uid as string)
        await attach(router.currentRoute.value.params.uid as string)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)

    name.value = form_data.name || name.value
    inf_category_uid.value = form_data.inf_category_uid || inf_category_uid.value
    map_mark.value = form_data.map_mark || null

    car_time.value = getNumString(form_data.car_time)
    public_transport_time.value = getNumString(form_data.public_transport_time)
    scooter_time.value = getNumString(form_data.scooter_time)
    cycling_time.value = getNumString(form_data.cycling_time)
    walking_time.value = getNumString(form_data.walking_time)
    taxi_cost.value = getNumString(form_data.taxi_cost)
  },
  getRequestData: () => ({
    ...getRequestDataMaterials(),
    name: name.value,
    inf_category_uid: Array.isArray(inf_category_uid.value) ? inf_category_uid.value.at(-1) : inf_category_uid.value,
    map_mark: map_mark.value,

    car_time: car_time.value,
    public_transport_time: public_transport_time.value,
    scooter_time: scooter_time.value,
    cycling_time: cycling_time.value,
    walking_time: walking_time.value,
    taxi_cost: taxi_cost.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить объект`,
        breadcrumbs: [
          { label: 'Инфраструктура' },
          {
            label: 'Объекты',
            route: getHandleBackArgs('infrastructure_element_list')
          },
          { label: 'Добавить объект' }
        ]
      }
    },
    common: {
      app_header_props: ([response_infrastructure_element]) => {
        const complex = refs.value.complexes_with_infrastructure_categories.find(
          (i) => i.value === inf_category_uid.value
        )
        return {
          title: complex
            ? `${complex.label} / ${response_infrastructure_element.name}`
            : `${response_infrastructure_element.name}`,
          breadcrumbs: [
            { label: 'Инфраструктура' },
            {
              label: 'Объекты',
              route: getHandleBackArgs('infrastructure_element_list')
            }
          ],
          optionalCallback: (app_header_state) => {
            for (const complex of refs.value.complexes_with_infrastructure_categories) {
              const infrastructure_category = complex.children?.find((i) => i.value === inf_category_uid.value)

              if (infrastructure_category) {
                app_header_state.title = `${name.value} (${complex.label} / ${infrastructure_category.label})`
                app_header_state.breadcrumbs.push({
                  label: `${name.value} (${complex.label} / ${infrastructure_category.label})`
                })
                break
              }
            }

            !app_header_state.title && (app_header_state.title = name.value)
            app_header_state.breadcrumbs.length === 1 && app_header_state.breadcrumbs.push({ label: name.value })
          }
        }
      }
    }
  }
})

const name = ref('')
const inf_category_uid = ref('')
const map_mark = ref<[number, number] | null>(null)
const car_time = ref('')
const public_transport_time = ref('')
const scooter_time = ref('')
const cycling_time = ref('')
const walking_time = ref('')
const taxi_cost = ref('')
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="InfrastructureElementEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="InfrastructureElementEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />
        <PskCascader
          style="grid-column: span 2"
          label="Категория"
          required
          v-model="inf_category_uid"
          :options="refs.complexes_with_infrastructure_categories"
        />
        <PskMapField style="grid-column: span 2" v-model="map_mark" id="map" label="Метка на карте" required />
      </div>

      <div class="InfrastructureElementEditorView__boxFields2 gridForm">
        <h3 class="FlatEditorView__boxFields2H1">Время в пути</h3>

        <PskInput v-model="car_time" label="Время на авто, мин" type="number" />
        <PskInput v-model="public_transport_time" label="Время на автобусе, мин" type="number" />
        <PskInput v-model="scooter_time" label="Время на самокате, мин" type="number" />
        <PskInput v-model="cycling_time" label="Время на велосипеде, мин" type="number" />
        <PskInput v-model="walking_time" label="Время пешком, мин" type="number" />
        <PskInput v-model="taxi_cost" label="Стоимость такси, ₽" type="cash" />
      </div>

      <UploadMedia style="grid-column: span 3" v-model="materials" :types="material_type_options" />
    </div>
  </FormLayout>
</template>

<style lang="scss">
.InfrastructureElementEditorView {
  height: 100%;
}

.InfrastructureElementEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.InfrastructureElementEditorView__boxFields2 {
  margin: 0 0 40px 0;
}

.FlatEditorView__boxFields2H1 {
  @include setFontStyle6();

  margin: 50px 0 10px 0;
  grid-column: span 3;
}

.InfrastructureElementEditorView__FormSite {
  margin: 20px 0 0 0;
}

.InfrastructureElementEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
