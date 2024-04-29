<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type ICompilationListItem,
  fetchDeleteCompilation,
  fetchGetCompilationList
} from '@/services/REST/dom_admin/compilation'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Подборки',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Подборки' }],
  btn: {
    label: 'Добавить подборку',
    handleClick: () => router.push({ name: 'compilation', params: { uid: 'create' } })
  }
})

const { setList, data_list, sort, meta } = useListView<ICompilationListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetCompilationList,
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeleteCompilation(uid)
  await setList()
}
</script>

<template>
  <div class="CompilationListView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Название" sortable prop="name" min-width="300">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/compilations/${scope.row.uid}`" />
        </template>
      </el-table-column>
      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Активность" sortable min-width="160" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column width="140" fixed="right">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)"
              >Удалить
            </PskLink>
            <PskLink small-font-weight :to="`/compilations/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
