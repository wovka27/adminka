<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type IApiFlatPropsListItem,
  fetchDeleteApiFlatPropsItem,
  fetchGetApiFlatPropsList
} from '@/services/REST/dom_admin/api_flat_props'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Свойства квартир',
  breadcrumbs: [{ label: 'Управление API' }, { label: 'Свойства квартир' }],
  btn: {
    label: 'Добавить свойство',
    handleClick: () => router.push({ name: 'flat_property', params: { uid: 'create' } })
  }
})

const { setList, data_list, meta, sort } = useListView<IApiFlatPropsListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetApiFlatPropsList,
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeleteApiFlatPropsItem(uid)
  await setList()
}
</script>

<template>
  <div class="FlatListView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Название" sortable prop="title" min-width="350px">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.title" :route="`/flat_properties/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="sort" min-width="150" />

      <el-table-column label="Активность" sortable min-width="140" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.active" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="140">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)">
              Удалить
            </PskLink>
            <PskLink small-font-weight :to="`/flat_properties/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
