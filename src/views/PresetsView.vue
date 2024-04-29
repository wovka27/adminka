<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type IPreset,
  type IPresetListItem,
  type IPresetSettingsItem,
  type IPresetType,
  type IPresetTypeSettingTemplate,
  type IPresetTypeSettingTemplateGroup,
  fetchCreatePreset,
  fetchDeletePreset,
  fetchGetPreset,
  fetchGetPresetList,
  fetchGetPresetTypes,
  fetchStartWorkPreset,
  fetchUpdatePreset
} from '@/services/REST/dom_admin/presets'

import { message } from '@/utils/message'

import getNumString from '@/helpers/getNumString'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Загрузчик',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Загрузчик' }],
  btn: {
    label: 'Добавить таблицу',
    handleClick: () => {
      title.value = 'Создание шаблона'
      open_modal.value = true
    }
  }
})

const { setList, data_list, meta, sort } = useListView<IPresetListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetPresetList,
  getRightKindOfResponseForDataList: (response) => response.payload,
  onBeforeMountCallback: async () => {
    await getTypes()
  }
})

const open_modal = ref<boolean>(false)
const name = ref('')
const title = ref('')
const type_list = ref<IPresetType[]>([])
const preset_uid = ref('')
const selected_type = ref<IPresetType | IPreset | null>(null)
const selected_type_settings_template_group = reactive<IPresetTypeSettingTemplateGroup>({
  'long-string': [],
  'short-string': [],
  bool: [],
  int: []
})

const alertBoolText = {
  true: 'Будут загружены или обновлены только колонки тегов изображений. Не заполненные будут пропущены и сохранены',
  false:
    'Внимание! Изображения, которым не указана колонка таблицы будут удалены! Активируйте переключатель чтобы сохранить все картинки.'
}

const boolValueForAlert = ref<boolean>(false)

const createGroup = <T extends IPresetType | IPreset, K extends IPresetTypeSettingTemplate | IPresetSettingsItem>(
  key: 'settings' | 'settings_template'
) => {
  const group = Object.groupBy((selected_type.value as T)[key], (i: K) => i.type)
  for (const groupKey in group) {
    selected_type_settings_template_group[groupKey as keyof typeof selected_type_settings_template_group] =
      group[groupKey]
  }
}

const changeField = (key: keyof IPresetTypeSettingTemplateGroup, value: any, name: any) => {
  const current = selected_type_settings_template_group[key].find((i) => i.name === name)
  if (!current) return
  selected_type_settings_template_group[key as keyof typeof selected_type_settings_template_group] =
    selected_type_settings_template_group[key].map((i) => ({ ...i, value: i.name === name ? value : i.value }))

  if (key === 'bool') {
    boolValueForAlert.value = value
  }
}
const changeSelectedType = (value: IPresetType) => {
  selected_type.value = value
  createGroup<IPresetType, IPresetTypeSettingTemplate>('settings_template')
}

modal_confirm_store.callback = async (uid) => {
  await fetchDeletePreset(uid)
  await setList()
}

const getRequestSettings = () => {
  return Object.entries(selected_type_settings_template_group)
    .map(([key, arr]) =>
      key === 'int'
        ? arr.map((i) => ({ code: i.name, value: +i.value }))
        : arr.map((i) => ({ code: i.name, value: i.value }))
    )
    .flat(Infinity)
}

const defaultSettingsValue = {
  int: <T,>(val: T) => getNumString(val),
  bool: <T,>(val: T) => !!val
}
const openChangeModal = async (uid: string) => {
  preset_uid.value = uid
  const response = await fetchGetPreset(uid)
  if (!response) return
  selected_type.value = response
  title.value = response.title
  selected_type.value = {
    ...selected_type.value,
    settings: selected_type.value.settings.map((j) => {
      ;[j.value as string | boolean] = [
        defaultSettingsValue?.[j.type as keyof typeof defaultSettingsValue]?.(j.value) || j.value || ''
      ]

      return j
    })
  }
  createGroup<IPreset, IPresetSettingsItem>('settings')
  open_modal.value = true
}

const resetModal = () => {
  ;[open_modal.value, name.value, title.value, selected_type.value, preset_uid.value] = [false, '', '', null, '']

  for (const key in selected_type_settings_template_group) {
    selected_type_settings_template_group[key as keyof typeof selected_type_settings_template_group] = []
  }
}

const updatePreset = async () => {
  const request_data = { ...selected_type.value, settings: getRequestSettings() }
  const response = await fetchUpdatePreset(preset_uid.value, request_data)
  if (!response) return
  message('Успешно изменено')
  resetModal()
}

const createPreset = async () => {
  const request_data = { title: name.value, settings: getRequestSettings(), type: selected_type.value?.value }
  const response = await fetchCreatePreset(request_data)
  if (!response) return
  await setList()
  message('Таблица успешно создана')
  resetModal()
}

const startWork = async () => {
  const response = await fetchStartWorkPreset(preset_uid.value)
  if (!response) {
    resetModal()
    return
  }
  message(response.message)
  resetModal()
}

const getTypes = async () => {
  const response_preset_types = await fetchGetPresetTypes()
  if (!response_preset_types) return

  type_list.value = response_preset_types.map((i) => {
    return {
      ...i,
      settings_template: i.settings_template.map((j) => ({
        ...j,
        value:
          j.value !== null ? j.value : j.type === 'bool' ? !!j.value : j.type === 'int' ? getNumString(j.value) : ''
      }))
    }
  })
}
</script>

<template>
  <div class="PresetView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Таблицы" sortable prop="title" min-width="150px">
        <template #default="scope">
          <div class="PresetView__PskTableTdUid">
            <span class="croppedText">{{ scope.row.uid }}</span>
          </div>
          <PskLink to="" @click="openChangeModal(scope.row.uid)" class="croppedText" color="primary_dark">
            {{ scope.row.title }}
          </PskLink>
        </template>
      </el-table-column>

      <el-table-column label="Тип" sortable min-width="150px" prop="type">
        <template #default="scope">
          <span class="croppedText">{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="75">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)"
              >Удалить
            </PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>

    <el-dialog class="PresetView__modal" v-model="open_modal" @close="resetModal">
      <template #header>
        <h3 class="PresetView__modalH1">{{ title }}</h3>
      </template>
      <template #default>
        <el-scrollbar max-height="500" always aria-orientation="vertical">
          <div class="PresetView__modalContainer">
            <PskSelect
              v-if="!preset_uid"
              style="grid-column: span 2"
              :model-value="selected_type"
              @update:model-value="changeSelectedType"
              :options="type_list"
              label="Тип загрузки"
              placeholder="Выберите тип"
              required
            />
            <PskInput
              v-if="!preset_uid && selected_type"
              required
              v-model="name"
              label="Название шаблона"
              placeholder="Введите название"
            />
            <div
              v-if="selected_type_settings_template_group['long-string']?.length"
              class="PresetView__modalLongStringAndInt"
            >
              <PskInput
                v-for="input of selected_type_settings_template_group['long-string']"
                :key="input.name"
                :label="input.title"
                :required="input.rules.includes('required')"
                :model-value="input.value"
                @update:modelValue="changeField('long-string', $event, input.name)"
              />
              <PskInput
                v-for="input of selected_type_settings_template_group.int"
                :key="input.name"
                :label="input.title"
                type="number"
                :required="input.rules.includes('required')"
                :model-value="input.value"
                @update:modelValue="changeField('int', $event, input.name)"
              />
            </div>
            <div v-if="selected_type_settings_template_group.bool?.length" class="PresetView__modalBool">
              <PskSwitch
                class="PresetView__modalBoolItem"
                v-for="input of selected_type_settings_template_group.bool"
                :key="input.name"
                :label="input.title"
                :required="input.rules.includes('required')"
                :model-value="input.value"
                @update:modelValue="changeField('bool', $event, input.name)"
              />
              <PskAlert type="info" :text="alertBoolText[`${boolValueForAlert}`]" />
            </div>
            <div
              v-if="selected_type_settings_template_group['short-string']?.length"
              class="PresetView__modalShortString"
            >
              <template v-for="input of selected_type_settings_template_group['short-string']" :key="input.name">
                <PskInput
                  v-if="input.is_multiple"
                  :label="input.title"
                  placeholder=" "
                  limit="2"
                  class="PresetView__modalShortStringItem"
                  size="large"
                  type="uppercase"
                  :model-value="input.value"
                  @update:modelValue="changeField('short-string', $event, input.name)"
                >
                  <el-popover placement="top" trigger="hover" width="fit-content">
                    <template #reference>
                      <el-icon class="iconHover_default" style="font-size: 13px">
                        <Warning />
                      </el-icon>
                    </template>
                    Для загрузки нескольких изображений, в одной ячейке перечислите ссылки, разделяя их ";". <br />
                    Пример - "https://ссылка;https://ссылка".
                  </el-popover>
                </PskInput>
                <PskInput
                  v-if="!input.is_multiple"
                  :label="input.title"
                  placeholder=" "
                  limit="2"
                  class="PresetView__modalShortStringItem"
                  size="large"
                  type="uppercase"
                  :model-value="input.value"
                  @update:modelValue="changeField('short-string', $event, input.name)"
                />
              </template>
            </div>
          </div>
        </el-scrollbar>
      </template>

      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 10px; width: 100%; height: max-content">
          <PskButton v-if="!preset_uid" @click="createPreset" type="primary">Создать шаблон</PskButton>
          <PskButton v-if="preset_uid" @click="startWork" type="primary">Запустить шаблон</PskButton>
          <PskButton v-if="preset_uid" @click="updatePreset" type="success">Сохранить шаблон</PskButton>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.PresetView__PskTableTdUid {
  @include setFontStyle8();
  color: $c_light;
}

.PresetView__modalH1 {
  @include setFontStyle2();
}

.PresetView__modal {
  width: 90vw;
}

.PresetView__modalContainer {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding-right: 10px;
}

.PresetView__modalLongStringAndInt {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px 0;
}

.PresetView__modalBool {
  display: flex;
  gap: 20px 30px;
  align-items: flex-end;
}

.PresetView__modalBoolItem {
  flex-shrink: 0;
}

.PresetView__modalShortString {
  display: grid;
  gap: 20px 30px;
  align-items: end;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

  .PskInput__label {
    font-size: 12px;
  }

  input {
    font-size: 25px;
    text-align: center;
  }
}
</style>
