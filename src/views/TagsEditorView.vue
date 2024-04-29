<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import useEditorView from '@/composables/app/useEditorView'

import { fetchGetApiTag, fetchUpdateApiTag } from '@/services/REST/dom_admin/api_tag'

import convertDateToRequest from '@/helpers/convertDateToRequest'
import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()
const { is_data_loaded, apply } = useEditorView({
  router,
  fetchGetEntity: fetchGetApiTag,
  back_route_name: 'tag_list',
  apply: {
    update: {
      fetchUpdateEntity: fetchUpdateApiTag
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name || ''
    created_at.value = form_data.created_at ? new Date(form_data.created_at) : null
    updated_at.value = form_data.updated_at ? new Date(form_data.updated_at) : null
    sort.value = getNumString(form_data.sort)
    title.value = form_data.title || ''
    show_chess.value = form_data.show_chess
    show_offers.value = form_data.show_offers
    show_public.value = form_data.show_public
    show_present_mode.value = form_data.show_present_mode
    is_multiple.value = form_data.is_multiple
  },
  getRequestData: () => ({
    name: name.value,
    created_at: created_at.value && convertDateToRequest(created_at.value),
    updated_at: updated_at.value && convertDateToRequest(updated_at.value),
    sort: sort.value,
    title: title.value,
    show_chess: show_chess.value,
    show_offers: show_offers.value,
    show_public: show_public.value,
    show_present_mode: show_present_mode.value,
    is_multiple: is_multiple.value
  }),
  mount: {
    common: {
      app_header_props: ([response_tag]) => ({
        title: response_tag.title,
        breadcrumbs: [
          {
            label: 'Управление API'
          },
          {
            label: 'Теги',
            route: getHandleBackArgs('tag_list')
          },
          { label: response_tag.title }
        ]
      })
    }
  }
})

const name = ref('')
const created_at = ref()
const updated_at = ref()
const sort = ref('')
const title = ref('')
const show_chess = ref<boolean>(false)
const show_offers = ref<boolean>(false)
const show_public = ref<boolean>(false)
const show_present_mode = ref<boolean>(false)
const is_multiple = ref<boolean>(false)
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="TagsEditorView gridForm">
      <div style="grid-column: span 2" class="gridForm">
        <PskDate v-model="created_at" label="Дата создания" use_time disabled />
        <PskDate v-model="updated_at" label="Дата обновления" use_time disabled />
        <PskInput v-model="sort" label="Сортировка" type="number" required />
      </div>
      <div style="grid-column: span 3" class="TagsEditorView__boxFields1 gridForm">
        <PskInput
          style="grid-column: span 2"
          v-model="title"
          label="Название"
          required
          placeholder="Введите название"
        />
        <PskInput v-model="name" label="Обозначение" required placeholder="Введите название" />
      </div>

      <div style="grid-column: span 3" class="TagsEditorView__boxFields2">
        <h3 style="grid-column: span 4" class="FlatEditorView__boxFields2H1">Параметры загрузки</h3>
        <PskSwitch v-model="is_multiple" required label="Множественная загрузка" />
        <PskAlert
          v-if="is_multiple"
          style="grid-column: span 3"
          type="info"
          text="Для множественной загрузки изображений укажите в загрузчике ссылки через точку с запятой"
        />
      </div>

      <div style="grid-column: span 3" class="TagsEditorView__boxFields2">
        <h3 style="grid-column: span 4" class="FlatEditorView__boxFields2H1">Параметры отображения</h3>
        <PskSwitch v-model="show_chess" required label="Отображение в шахматке" />
        <PskSwitch v-model="show_present_mode" required label="Отображение в режиме презентации" />
        <PskSwitch v-model="show_offers" required label="Отображение в подборках" />
        <PskSwitch v-model="show_public" required label="Отображение в публичных сервисах" />
      </div>
    </div>
  </FormLayout>
</template>

<style lang="scss">
.TagsEditorView {
  height: 100%;
}

.TagsEditorView__boxFields1 {
}

.TagsEditorView__boxFields2 {
  display: grid;
  gap: 20px 30px;
  grid-template-columns: repeat(4, 1fr);
  align-items: end;
}

.FlatEditorView__boxFields2H1 {
  @include setFontStyle6();

  margin: 50px 0 10px 0;
  grid-column: span 3;
}

.TagsEditorView__FormSite {
  margin: 20px 0 0 0;
}

.TagsEditorView__h1 {
  @include setFontStyle6();
  margin: 50px 0 30px 0;
}
</style>
