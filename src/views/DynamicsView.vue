<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IDynamicsListItem, fetchDeleteDynamics, fetchGetDynamicsList } from '@/services/REST/dom_admin/dynamics'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Динамика строительства',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Динамика строительства' }],
  btn: {
    label: 'Добавить динамику',
    handleClick: () => {
      router.push({ name: 'dynamics', params: { uid: 'create' } })
    }
  }
})

const { meta, setList, data_list, sort, handleChangeFilter } = useListView<IDynamicsListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetDynamicsList,
  filter: {
    complex: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeleteDynamics(uid)
  await setList()
}
</script>

<template>
  <div class="DynamicsView ListView">
    <FilterComplex @complexSelectedChange="handleChangeFilter" />
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Категории" sortable prop="name" width="350px">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/dynamics/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Ссылка на видео" sortable prop="link_video" min-width="180">
        <template #default="scope">
          <PskLink class="croppedText" native :to="scope.row.link_video" target="_blank">
            {{ scope.row.link_video }}
          </PskLink>
        </template>
      </el-table-column>

      <el-table-column label="Активность" sortable min-width="140" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="140">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)"
              >Удалить</PskLink
            >
            <PskLink small-font-weight :to="`/dynamics/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
