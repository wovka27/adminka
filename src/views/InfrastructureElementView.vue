<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type IInfrastructureElementListItem,
  fetchDeleteInfrastructureElementListItem,
  fetchGetInfrastructureElementList
} from '@/services/REST/dom_admin/infrastructure_element'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Объекты',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Инфраструктура' }, { label: 'Объекты' }],
  btn: {
    label: 'Добавить объект',
    handleClick: () => router.push({ name: 'infrastructure_element', params: { uid: 'create' } })
  }
})

const { setList, data_list, sort, meta, handleChangeFilter } = useListView<IInfrastructureElementListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetInfrastructureElementList,
  filter: {
    complex: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeleteInfrastructureElementListItem(uid)
  await setList()
}
</script>

<template>
  <div class="InfrastructureCategoryView ListView">
    <FilterComplex @complexSelectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Категории" sortable prop="name" width="450px">
        <template #default="scope">
          <PskTableTdName
            :uid="scope.row.uid"
            :name="scope.row.name"
            :route="`/infrastructure_element/${scope.row.uid}`"
          />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Категория" prop="category" sortable min-width="140">
        <template #default="scope">
          <span class="croppedText">{{ scope.row.category }}</span>
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
            <PskLink small-font-weight :to="`/infrastructure_element/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
