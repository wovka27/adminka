<script setup lang="ts">
import { Delete, Plus, Select, ZoomIn } from '@element-plus/icons-vue'
import { computed, onMounted, onUpdated, ref } from 'vue'

import { useAppStateStore } from '@/stores'

import { fetchGetApiTagList } from '@/services/REST/dom_admin/api_tag'
import type { IImage } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

import { useModalImageStore } from '@/stores/useModalImageStore'

export interface IUploadImgProps {
  modelValue: IImage[]
}

const props = defineProps<IUploadImgProps>()
const emit = defineEmits(['update:modelValue'])
const modal_image_store = useModalImageStore()

const model = ref<IImage[]>([])

const img_list = computed(() => props.modelValue.filter((i) => i.name === tag.value?.name))
const _img_list = computed(() => model.value.filter((i) => i.name === tag.value?.name))

const tag = ref<{ name: string; uid: string; is_multiple: boolean }>()
const tag_options = ref<{ name: string; uid: string; is_multiple: boolean }[]>([])

const handleOnRemove = (img_uid: string) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((i) => i.uid !== img_uid)
  )
}

const handleClickAddMedia = async () => {
  await ImgGallery_setImgList()
  is_ImgGallery_open.value = true
}

// ------------------------------ ImgGallery (start) ------------------------------
interface IImgGalleryListItem extends IResponseImgListItem {
  is_checked?: boolean
}

interface IResponseImgListItem {
  uid: string
  name: string
  url: string
}

const is_ImgGallery_open = ref(false)
const ImgGallery_response_img_list = ref<IResponseImgListItem[]>([])
const ImgGallery_page_per = ref(20)
const ImgGallery_page_current = ref(1)
const ImgGallery_page_last = ref(1)

const ImgGallery_img_list = computed<IImgGalleryListItem[]>(() =>
  ImgGallery_response_img_list.value.map((i) => ({ ...i, is_checked: !!_img_list.value.find((j) => j.uid === i.uid) }))
)

const handleUpdatePagePer = () => {
  ImgGallery_page_current.value = 1
  handleClickAddMedia()
}

const ImgGallery_setImgList = async () => {
  ImgGallery_response_img_list.value = []

  const meta = {
    page_current: ImgGallery_page_current.value,
    page_last: ImgGallery_page_last.value,
    page_per: ImgGallery_page_per.value
  }

  const response = await api.get<IUseMeta<IResponseImgListItem[]>>('admin/files', {
    f: { tags: tag.value?.uid },
    page: meta.page_current,
    per_page: meta.page_per
  })

  if (!response) return

  ImgGallery_page_per.value = response.meta.per_page
  ImgGallery_page_last.value = response.meta.last_page

  ImgGallery_response_img_list.value = response.payload
}

const ImgGallery_handleClickImg = (img: IImgGalleryListItem) => {
  if (!tag.value!.is_multiple && img.is_checked) return

  if (!tag.value!.is_multiple && !img.is_checked) {
    emit('update:modelValue', [...props.modelValue, { name: tag.value!.name, uid: img.uid, path: img.url }])
    is_ImgGallery_open.value = false
    return
  }

  if (tag.value!.is_multiple && img.is_checked) {
    model.value = model.value.filter((i) => i.uid !== img.uid)
    return
  }

  if (tag.value!.is_multiple && !img.is_checked) {
    model.value = [...model.value, { name: tag.value!.name, uid: img.uid, path: img.url }]
    return
  }
}

const apply = () => {
  emit('update:modelValue', model.value)
  is_ImgGallery_open.value = false
}

interface IResponse {
  uid: string
  url: string
  hash: string
  name: string
  previews: null
  tag: {
    uid: string
    name: string
    title: string
    sort: number
    created_at: string
    updated_at: string
    deleted_at: null
  }
  created_at: string
  updated_at: string
  deleted_at: null
}

const handleChangeFileInput = async (event: Event) => {
  // ---------------------- загрузить картинку на сервер (start) ----------------------
  const target = event.target as HTMLInputElement
  const files = target.files || []
  const request_data = new FormData()

  for await (const file of files) {
    request_data.set('tag', tag.value!.uid)
    request_data.set('file', file, file.name)

    const response = await api.post<IResponse>('admin/files', request_data, null, {
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response) return

    model.value = [
      ...props.modelValue,
      { ...response, uid: response.uid, path: response.url, name: response.tag.title }
    ]
  }

  if (tag.value!.is_multiple) {
    ImgGallery_page_current.value = 1
    ImgGallery_setImgList()
    return
  }

  if (!tag.value?.is_multiple) {
    apply()
    return
  }

  is_ImgGallery_open.value = false
}

onMounted(async () => {
  const response_tags = await fetchGetApiTagList()
  if (!response_tags) return

  tag_options.value = response_tags

  model.value = props.modelValue
})

onUpdated(() => {
  is_ImgGallery_open.value && (model.value = props.modelValue)
})
</script>

<template>
  <div class="UploadImg span-3" v-if="tag_options.length">
    <PskTabSelect :options="tag_options" v-model="tag" options_label="name" />

    <div class="UploadImg__imgBoxList">
      <template v-for="img of img_list" :key="img.uid">
        <div class="UploadImg__imgBox">
          <img class="UploadImg__img" :src="img.path" alt="" />

          <div class="UploadImg__cover">
            <Delete class="iconHover_danger" @click="handleOnRemove(img.uid)" />
            <ZoomIn class="iconHover_contrast" @click="modal_image_store.openModal(img.path)" />
          </div>
        </div>
      </template>

      <div class="UploadImg__addMedia" v-if="tag?.is_multiple || !img_list.length" @click="handleClickAddMedia">
        <Plus class="UploadImg__addMediaIcon" />
      </div>
    </div>

    <el-dialog class="ImgGallery" v-model="is_ImgGallery_open" @close="model = []">
      <template #default>
        <div class="ImgGallery__content">
          <PskAlert style="margin: 20px 0" type="info" text="Максимальный размер загружаемых файлов - 10мб" />
          <el-scrollbar class="ImgGallery__main">
            <div class="ImgGallery__mediaBox">
              <div
                class="ImgGallery__mediaItem"
                v-for="img of ImgGallery_img_list"
                :key="img.uid"
                @click="ImgGallery_handleClickImg(img)"
              >
                <img class="ImgGallery__img" :src="img.url" alt="" />

                <div class="ImgGallery__mediaIsChecked" v-if="img.is_checked"><Select /></div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </template>
      <template #footer>
        <footer class="ImgGallery_footer">
          <el-pagination
            class="PskPaginator"
            v-model:current-page="ImgGallery_page_current"
            @update:current-page="ImgGallery_setImgList"
            v-model:page-size="ImgGallery_page_per"
            @update:page-size="handleUpdatePagePer"
            :page-count="ImgGallery_page_last"
            layout="sizes, prev, pager, next"
            :page-sizes="[1, 5, 10, 20, 30, 50, 100]"
          />
          <div class="ImgGallery__header">
            <PskButton @click="apply" size="large">Применить</PskButton>
            <label class="ImgGallery__labelForFileUploader" for="file_uploader">Добавить</label>
            <input
              style="display: none"
              id="file_uploader"
              @change="handleChangeFileInput"
              type="file"
              :multiple="tag?.is_multiple"
            />
          </div>
        </footer>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.UploadImg {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.ImgGallery__header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.UploadImg__imgBoxList {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.UploadImg__imgBox,
.UploadImg__addMedia {
  position: relative;
  overflow: hidden;

  height: 150px;
  width: 150px;

  border: 2px dashed $c_border_light;
  border-radius: 10px;
}

.UploadImg__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.UploadImg__cover {
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

.UploadImg__cover {
  display: flex;
  align-items: center;
  gap: 20px;
}

.UploadImg__addMediaIcon {
  margin: 20px;
  color: $c_icon;
}

.UploadImg__addMedia:hover {
  border-color: $c_primary;
  cursor: pointer;
}

.UploadImg__modal {
  width: 90vw;
}

.UploadImg__modalContent {
  width: 100%;
  height: 85vh;
}

.UploadImg__modalImg {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.ImgGallery {
  width: 90vw;
}

.ImgGallery__content {
  height: 80vh;

  display: flex;
  justify-content: space-between;
  flex-direction: column;

  overflow: auto;
}

.ImgGallery__labelForFileUploader {
  background-color: $c_primary;
  color: $c_body;
  padding: 10px;
  font-weight: 700;
  padding: 11px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}

.ImgGallery__mediaBox {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.ImgGallery__mediaItem {
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

.ImgGallery__img {
  object-fit: contain;

  height: 100%;
  width: 100%;
}

.ImgGallery__mediaIsChecked {
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

.ImgGallery_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
