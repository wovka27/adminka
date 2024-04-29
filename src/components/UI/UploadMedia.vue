<script setup lang="ts">
import { Delete, Plus, Select, ZoomIn } from '@element-plus/icons-vue'
import { computed, onMounted, onUpdated, ref } from 'vue'

import { useAppStateStore } from '@/stores'

import type { IMaterialType, IMedia } from '@/services/REST/dom_admin/common_types'
import { fetchCreateMaterial, fetchGetMaterialsByType, fetchUploadMediaFile } from '@/services/REST/dom_admin/materials'

import { message } from '@/utils/message'

import { useModalImageStore } from '@/stores/useModalImageStore'

export interface IUploadMediaProps {
  modelValue: IMedia[]
  types: IMaterialType[]
}

const props = defineProps<IUploadMediaProps>()
const emit = defineEmits(['update:modelValue'])
const modal_image_store = useModalImageStore()
const app_state_store = useAppStateStore()

const model = ref<IMedia[]>([])

const type_current = ref<IMaterialType>(props.types[0])

const media_list_current_tab = computed(() => props.modelValue.filter((i) => i.type === type_current.value?.type))
const _media_list_current_tab = computed(() => model.value.filter((i) => i.type === type_current.value?.type))

const is_btn_add_media_show = computed(
  () =>
    type_current.value?.is_multiple || !media_list_current_tab.value.find((i) => !i.action || i?.action === 'attach')
)

const sleep = (ms: number = 0) => {
  app_state_store.setIsLoading(true)
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(app_state_store.setIsLoading(false))
    }, ms)
  )
}

const handleOnRemove = async (media: IMedia) => {
  if (media.action === 'attach') {
    const result = props.modelValue.filter((i) => i.uid !== media.uid)
    emit('update:modelValue', result)
    return
  }

  const result = props.modelValue.map((i) => {
    if (media.uid === i.uid) return { ...i, action: 'detach' }
    return i
  })

  emit('update:modelValue', result)
}

const handleClickAddMedia = async () => {
  if (!type_current.value) {
    message('Не выбран тип материала.', 'error')
    return
  }
  await MediaGallery_setMediaList()
  is_MediaGallery_open.value = true
}

// ------------------------------ MediaGallery (start) ------------------------------
interface IMediaGalleryList extends IMedia {
  is_checked?: boolean
}

const is_MediaGallery_open = ref(false)
const MediaGallery_response_media_list = ref<IMedia[]>([])
const MediaGallery_page_per = ref(20)
const MediaGallery_page_current = ref(1)
const MediaGallery_page_last = ref(1)

const MediaGallery_media_list = computed<IMediaGalleryList[]>(() =>
  MediaGallery_response_media_list.value.map((i) => {
    const media = _media_list_current_tab.value.find((j) => j.uid === i.uid)

    if (media && media?.action !== 'detach') {
      return { ...i, is_checked: true }
    }

    return i
  })
)

const handleUpdatePagePer = () => {
  MediaGallery_page_current.value = 1
  handleClickAddMedia()
}

const MediaGallery_setMediaList = async () => {
  if (!type_current.value.type) return
  MediaGallery_response_media_list.value = []

  const meta = {
    page_current: MediaGallery_page_current.value,
    page_last: MediaGallery_page_last.value,
    page_per: MediaGallery_page_per.value
  }
  const response = await fetchGetMaterialsByType(type_current.value.type, meta)

  if (!response) {
    is_MediaGallery_open.value = false
    return
  }

  MediaGallery_page_per.value = response.meta.per_page
  MediaGallery_page_last.value = response.meta.last_page

  MediaGallery_response_media_list.value = response.payload
}

const MediaGallery_handleClickImg = (media: IMediaGalleryList) => {
  if (!type_current.value.is_multiple && media.is_checked) return

  if (!type_current.value.is_multiple && !media.is_checked) {
    const attached_media = model.value.find((i) => i.uid === media.uid)
    if (attached_media && attached_media.action === 'detach') {
      const result = model.value.map((i) => {
        if (i.uid === media.uid) delete i.action
        return i
      })

      emit('update:modelValue', result)
      is_MediaGallery_open.value = false
      return
    }

    emit('update:modelValue', [...props.modelValue, { ...media, action: 'attach' }])
    is_MediaGallery_open.value = false

    return
  }

  if (type_current.value.is_multiple) {
    if (media.is_checked) {
      const detached_media = model.value.find((i) => i.uid === media.uid)

      if (detached_media?.action === 'attach') {
        model.value = model.value.filter((i) => i.uid !== media.uid)
        return
      }

      model.value = model.value.map((i) => (i.uid === media.uid ? ({ ...i, action: 'detach' } as IMedia) : i))
    } else {
      const attached_media = model.value.find((i) => i.uid === media.uid)
      if (attached_media?.action === 'detach') {
        model.value = model.value.map((i) => {
          if (i.uid === media.uid) delete i.action
          return i
        })
        return
      }

      model.value = [...model.value, { ...media, action: 'attach' }]
    }
  }
}

const apply = () => {
  emit('update:modelValue', model.value)
  is_MediaGallery_open.value = false
}

const handleChangeFileInput = async (event: Event) => {
  // ---------------------- загрузить картинку на сервер (start) ----------------------
  const target = event.target as HTMLInputElement
  const files = target.files as FileList
  const request_data = new FormData()

  for (const file of files) {
    request_data.set('type', type_current.value.type)
    request_data.set('name', file.name)
    request_data.set('file', file)
    const response_media_file = await fetchUploadMediaFile(request_data)

    if (!response_media_file || !response_media_file?.uid) return false
    // ----------------------- загрузить картинку на сервер (end) -----------------------

    // ---------------------------- создать материал (start) ----------------------------

    const response_material = await fetchCreateMaterial({
      file_uid: response_media_file.uid,
      name: file.name,
      type: type_current.value.type
    })

    if (!response_material || !response_material.uid) return false
    // ----------------------------- создать материал (end) -----------------------------

    await sleep()

    model.value = [...props.modelValue, { ...response_material, action: 'attach' }]

    if (!type_current.value.is_multiple) {
      is_MediaGallery_open.value = false
      break
    }
  }

  await MediaGallery_setMediaList()
}
// ------------------------------- MediaGallery (end) -------------------------------
onMounted(() => {
  model.value = props.modelValue
})
onUpdated(() => {
  is_MediaGallery_open.value && (model.value = props.modelValue)
})
</script>

<template>
  <div class="UploadMedia" v-if="types.length">
    <PskTabSelect :options="types" v-model="type_current" options_label="name" />

    <div class="UploadMedia__imgBoxList">
      <template v-for="media of media_list_current_tab" :key="media.uid">
        <div class="UploadMedia__imgBox" v-if="media.action !== 'detach'">
          <img class="UploadMedia__img" :src="media.files?.[0]?.file" alt="" />

          <div class="UploadMedia__cover">
            <Delete class="iconHover_danger" @click="handleOnRemove(media)" />
            <ZoomIn class="iconHover_contrast" @click="modal_image_store.openModal(media.files?.[0]?.file)" />
          </div>
        </div>
      </template>

      <div class="UploadMedia__addMedia" v-if="is_btn_add_media_show" @click="handleClickAddMedia">
        <Plus class="UploadMedia__addMediaIcon" />
      </div>
    </div>

    <el-dialog class="MediaGallery" v-model="is_MediaGallery_open" @close="model = []">
      <template #default>
        <div class="MediaGallery__content">
          <PskAlert style="margin: 20px 0" type="info" text="Максимальный размер загружаемых файлов - 10мб" />
          <el-scrollbar v-if="MediaGallery_media_list?.length" class="MediaGallery__main">
            <div class="MediaGallery__mediaBox">
              <div
                class="MediaGallery__mediaItem"
                v-for="media of MediaGallery_media_list"
                :key="media.uid"
                @click="MediaGallery_handleClickImg(media)"
              >
                <img class="MediaGallery__img" :src="media.files[0]?.file" alt="" />

                <div class="MediaGallery__mediaIsChecked" v-if="media.is_checked"><Select /></div>
              </div>
            </div>
          </el-scrollbar>
          <div v-else class="MediaGallery__mediaBox_noData">
            <h2>Нет данных.</h2>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="MediaGallery_footer">
          <el-pagination
            class="PskPaginator"
            v-model:current-page="MediaGallery_page_current"
            @update:current-page="MediaGallery_setMediaList"
            v-model:page-size="MediaGallery_page_per"
            @update:page-size="handleUpdatePagePer"
            :page-count="MediaGallery_page_last"
            layout="sizes, prev, pager, next"
            :page-sizes="[1, 5, 10, 20, 30, 50, 100]"
          />
          <div class="MediaGallery__header">
            <PskButton @click="apply" size="large">Применить</PskButton>
            <label class="MediaGallery__labelForFileUploader" for="file_uploader">Добавить</label>
            <input style="display: none" id="file_uploader" @change="handleChangeFileInput" type="file" multiple />
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.UploadMedia {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.UploadMedia__imgBoxList {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.MediaGallery__header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.UploadMedia__imgBox,
.UploadMedia__addMedia {
  position: relative;
  overflow: hidden;

  height: 150px;
  width: 150px;

  border: 2px dashed $c_border_light;
  border-radius: 10px;
}

.UploadMedia__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.UploadMedia__cover {
  position: absolute;
  inset: 0;
  opacity: 0;
  padding: 0 20px;

  transition: opacity 0.3s ease-in-out;
  background-color: rgba(0, 0, 0, 0.85);

  &:hover {
    opacity: 1;
  }
}

.UploadMedia__cover {
  display: flex;
  align-items: center;
  gap: 20px;
}

.UploadMedia__addMediaIcon {
  margin: 20px;
  color: $c_icon;
}

.UploadMedia__addMedia:hover {
  border-color: $c_primary;
  cursor: pointer;
}

.MediaGallery {
  width: 90vw;
}

.MediaGallery__content {
  height: 80vh;

  display: flex;
  justify-content: space-between;
  flex-direction: column;

  overflow: auto;
}

.MediaGallery__labelForFileUploader {
  background-color: $c_primary;
  color: $c_body;
  padding: 11px 20px;
  font-weight: 700;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}

.MediaGallery__mediaBox {
  padding-right: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
}

.MediaGallery__mediaBox_noData {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.MediaGallery__mediaItem {
  position: relative;
  overflow: hidden;

  aspect-ratio: 1/1;

  border: 2px dashed $c_border_light;
  border-radius: 10px;

  transition: border-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: $c_primary;
  }
}

.MediaGallery__img {
  object-fit: contain;

  height: 100%;
  width: 100%;
}

.MediaGallery__mediaIsChecked {
  position: absolute;
  top: 5px;
  right: 5px;

  width: 30px;
  height: 30px;
  padding: 5px;

  background-color: $c_success;
  border-radius: 50%;

  color: $c_body;
}

.MediaGallery_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
