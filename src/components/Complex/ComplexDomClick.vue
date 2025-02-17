<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import FeedAggregatorAlertTitle from '@/components/FeedAggregatorAlertTitle.vue'
import WorkDayFieldList from '@/components/WorkDayFieldList.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'
import useUploadMaterials from '@/composables/app/useUploadMaterials'

import {
  fetchGetComplexAggregatorDomClick,
  fetchUpdateComplexAggregatorDomClick
} from '@/services/REST/dom_admin/complex'

import conversionWorkDayForRequest, { type WorkingDaysValueType } from '@/helpers/conversionWorkDayForRequest'
import resetConversionWorkDay from '@/helpers/resetConversionWorkDay'

const router = useRouter()
const refs = useRefs('dom-click-parking')
const { material_type_options, materials, getMaterials, attach, detach } = useUploadMaterials('dom_click_complex')
const { is_data_loaded, apply, getIsStateBeforeEqualAfter } = useEditorView({
  router,
  fetchGetEntity: fetchGetComplexAggregatorDomClick,
  fetchGetEntityUid: (route_params) => route_params.aggregator_uid as string,
  back_route_name: 'complex_list',
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateComplexAggregatorDomClick,
      beforeResponseFn: async () => {
        const uid = router.currentRoute.value.params.aggregator_uid as string

        await detach(uid)
        await attach(uid)
      }
    }
  },
  setFormData: (form_data) => {
    getMaterials(form_data.media)

    complex_id.value = form_data.data.complex_id || ''
    security.value = !!form_data.data.security
    fenced_area.value = !!form_data.data.fenced_area
    parking.value = form_data.data.parking || ''
    sports_ground.value = !!form_data.data.sports_ground
    playground.value = !!form_data.data.playground
    school.value = !!form_data.data.school
    kindergarten.value = !!form_data.data.kindergarten
    utp_main_text.value = form_data.data.utp_main_text || ''
    utp_main_title.value = form_data.data.utp_main_title || ''
    utp_main_image.value = form_data.data.utp_main_image || ''
    utp_secondary_text.value = form_data.data.utp_secondary_text || ''
    utp_secondary_title.value = form_data.data.utp_secondary_title || ''
    utp_secondary_image.value = form_data.data.utp_secondary_image || ''
    description.value = form_data.data.description || ''
    video.value = form_data.data.video || ''
    geotag.value = form_data.data.geotag
    address.value = form_data.data.address || ''
    sales_phone.value = form_data.data.sales_phone || ''
    responsible_officer_phone.value = form_data.data.responsible_officer_phone || ''
    timezone.value = form_data.data.timezone || ''
    work_day.value = resetConversionWorkDay(form_data.data.work_day || [])
  },
  getRequestData: () => ({
    complex_id: complex_id.value,
    security: security.value,
    fenced_area: fenced_area.value,
    parking: parking.value,
    sports_ground: sports_ground.value,
    playground: playground.value,
    school: school.value,
    kindergarten: kindergarten.value,
    utp_main_text: utp_main_text.value,
    utp_main_title: utp_main_title.value,
    utp_main_image: utp_main_image.value,
    utp_secondary_text: utp_secondary_text.value,
    utp_secondary_title: utp_secondary_title.value,
    utp_secondary_image: utp_secondary_image.value,
    description: description.value,
    video: video.value,
    geotag: geotag.value,
    address: address.value,
    sales_phone: sales_phone.value,
    responsible_officer_phone: responsible_officer_phone.value,
    timezone: timezone.value,
    work_day: conversionWorkDayForRequest(work_day.value || [])
  })
})

const complex_id = ref('')
const security = ref(false)
const fenced_area = ref(false)
const parking = ref('')
const sports_ground = ref(false)
const playground = ref(false)
const school = ref(false)
const kindergarten = ref(false)
const utp_main_text = ref('')
const utp_main_title = ref('')
const utp_main_image = ref('')
const utp_secondary_text = ref('')
const utp_secondary_title = ref('')
const utp_secondary_image = ref('')
const description = ref('')
const video = ref('')
const geotag = ref(null)
const address = ref('')
const sales_phone = ref('')
const responsible_officer_phone = ref('')
const timezone = ref('')
const work_day = ref<WorkingDaysValueType[]>([])

const utp = ref<'Основное УТП' | 'Второстепенное УТП'>('Основное УТП')
const utp_options: (typeof utp.value)[] = ['Основное УТП', 'Второстепенное УТП']

const timezone_options = Array.from({ length: 25 }, (_, index) => (index > 12 ? `+${index - 12}` : `${index - 12}`))

const changeUTP = (value: typeof utp.value) => {
  utp.value = value
  if (value === 'Основное УТП') {
    utp_secondary_text.value = ''
    utp_secondary_title.value = ''
    utp_secondary_image.value = ''
  } else {
    utp_main_text.value = ''
    utp_main_title.value = ''
    utp_main_image.value = ''
  }
}

defineExpose({ getIsStateBeforeEqualAfter })
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <PskGridContainer grid-span="3" grid-column-count="3">
      <FeedAggregatorAlertTitle type="dom_click" />
      <PskInput v-model="complex_id" label="ID ЖК в Домклик" placeholder="Введите ID" />
      <PskSelect v-model="parking" label="Наличие парковки" :options="refs.dom_click_parking" />
      <div></div>
      <div
        style="
          grid-column: span 3;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px 30px;
        "
      >
        <PskSwitch v-model="security" label="Охрана" />
        <PskSwitch v-model="fenced_area" label="Огороженная территория" />
        <PskSwitch v-model="sports_ground" label="Спортивная площадка" />
        <PskSwitch v-model="playground" label="Детская площадка" />
        <PskSwitch v-model="school" label="Школа" />
        <PskSwitch v-model="kindergarten" label="Детский сад" />
      </div>

      <PskGridContainer grid-span="3" grid-column-count="2" title="УТП">
        <PskTabSelect class="span-3" :model-value="utp" @update:modelValue="changeUTP($event)" :options="utp_options" />
        <PskInput
          v-if="utp === 'Основное УТП'"
          class="span-3"
          v-model="utp_main_text"
          label="Уникальное торговое предложение"
        />
        <PskInput
          v-if="utp === 'Основное УТП'"
          class="span-3"
          v-model="utp_main_title"
          label="Заголовок"
          placeholder="Введите заголовок"
        />
        <PskInput
          v-if="utp === 'Второстепенное УТП'"
          class="span-3"
          v-model="utp_secondary_text"
          label="Уникальное торговое предложение"
        />
        <PskInput
          v-if="utp === 'Второстепенное УТП'"
          class="span-3"
          v-model="utp_secondary_title"
          label="Заголовок"
          placeholder="Введите заголовок"
        />

        <template v-for="(type, idx) of material_type_options" :key="type.code">
          <UploadMedia v-if="utp === utp_options[idx]" class="span-3" v-model="materials" :types="[type]" />
        </template>
      </PskGridContainer>
      <PskWYSIWYGEditor v-model="description" label="Описание" />
      <PskInput style="grid-column: span 2; margin-top: 30px" v-model="video" label="Ссылка на видео" />
      <PskGridContainer grid-span="3" grid-column-count="3" title="Отдел продаж">
        <PskMapField label="Метка на карте" required id="map" style="grid-column: span 2" v-model="geotag" />
        <div></div>
        <PskInput class="span-3" v-model="address" label="Адрес отдела продаж" required placeholder="Введите адрес" />
        <PskInput
          v-model="sales_phone"
          label="Телефон отдела продаж"
          required
          placeholder="Введите номер"
          type="phone"
        />
        <PskInput
          v-model="responsible_officer_phone"
          label="Телефон сотрудника"
          required
          placeholder="Введите номер"
          type="phone"
        />
        <PskSelect v-model="timezone" :options="timezone_options" label="Часовой пояс" required />
        <WorkDayFieldList v-model="work_day" />
      </PskGridContainer>
    </PskGridContainer>
  </FormLayout>
</template>
