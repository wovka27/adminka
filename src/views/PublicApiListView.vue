<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'
import useRefs from '@/composables/app/useRefs'

import {
  type IPublicApiListItem,
  fetchDeletePublicApiItem,
  fetchGetPublicApiList
} from '@/services/REST/dom_admin/public_api'

const router = useRouter()
const modal_confirm_store = useModalConfirmStore()

const refs = useRefs('real-property-types', 'api-resource-settings-types')

useAppHeader({
  title: 'Публичное API',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Управление API' }, { label: 'Публичное API' }],
  btn: {
    label: 'Добавить выгрузку',
    handleClick: () => router.push({ name: 'public_api', params: { uid: 'create' } })
  }
})

const { setList, data_list, sort, meta } = useListView<IPublicApiListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetPublicApiList,
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeletePublicApiItem(uid)
  await setList()
}
</script>

<template>
  <div class="PromotionElementListView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Название" prop="name" min-width="250">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/public_api/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column label="Тип недвижимости" sortable min-width="220" prop="type">
        <template #default="scope">
          <p class="croppedText">
            {{
              refs.real_property_types
                .filter((i) => scope.row.flat_types.includes(i.value))
                .map((i) => ' ' + i.label)
                .toString()
            }}
          </p>
        </template>
      </el-table-column>

      <el-table-column label="Тип сущности" sortable min-width="180" prop="type">
        <template #default="scope">
          <p class="croppedText">
            {{ refs.api_resource_settings_types.find((i) => i.value === scope.row.type)?.label ?? scope.row.type }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Сортировка" sortable min-width="140" prop="weight" />
      <el-table-column label="Активность" sortable width="140" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="140">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)"
              >Удалить
            </PskLink>
            <PskLink small-font-weight :to="`/public_api/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
