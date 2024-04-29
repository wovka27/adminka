<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type IPlanRelativeListItem,
  fetchDeletePlanRelative,
  fetchGetPlanRelativeList
} from '@/services/REST/dom_admin/plans_relatives'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Связи',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Планировки' }, { label: 'Связи' }],
  btn: {
    label: 'Добавить связь',
    handleClick: () => router.push({ name: 'plan_relatives', params: { uid: 'create' } })
  }
})

const { setList, data_list, meta } = useListView<IPlanRelativeListItem>({
  router,
  sort: false,
  meta: true,
  fetchGetList: fetchGetPlanRelativeList,
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeletePlanRelative(uid)
  await setList()
}
</script>

<template>
  <div class="PlanRelativesListView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList">
      <el-table-column label="Название" prop="name" min-width="200px">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/plans_relatives/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="140">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)"
              >Удалить</PskLink
            >
            <PskLink small-font-weight :to="`/plans_relatives/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
