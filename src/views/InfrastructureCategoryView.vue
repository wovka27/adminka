<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type IInfrastructureCategoryListItem,
  fetchDeleteInfrastructureCategoryListItem,
  fetchGetInfrastructureCategoryList
} from '@/services/REST/dom_admin/infrastructure_category'

import { useModalImageStore } from '@/stores/useModalImageStore'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()
const modal_image_store = useModalImageStore()

useAppHeader({
  title: 'Список',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Инфраструктура' }, { label: 'Категории' }],
  btn: {
    label: 'Добавить категорию',
    handleClick: () => router.push({ name: 'infrastructure_category', params: { uid: 'create' } })
  }
})

const { setList, data_list, sort, meta, handleChangeFilter } = useListView<IInfrastructureCategoryListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetInfrastructureCategoryList,
  filter: {
    complex: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeleteInfrastructureCategoryListItem(uid)
  await setList()
}
</script>

<template>
  <div class="InfrastructureCategoryView ListView">
    <FilterComplex @selectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Категории" sortable prop="name" min-width="350px">
        <template #default="scope">
          <PskTableTdName
            :uid="scope.row.uid"
            :name="scope.row.name"
            :route="`/infrastructure_category/${scope.row.uid}`"
          />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Иконка для карты" prop="media" min-width="170">
        <template #default="scope">
          <div
            v-if="scope.row.media.length"
            style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              overflow: hidden;
              background-color: #fff;
              cursor: pointer;
            "
            @click="modal_image_store.openModal(scope.row.media?.[0]?.files?.[0].file)"
          >
            <img
              style="width: 100%; height: 100%; object-fit: cover"
              :src="scope.row.media?.[0]?.files?.[0].file"
              :alt="scope.row.name"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Активность" sortable prop="show" min-width="140">
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
            <PskLink small-font-weight :to="`/infrastructure_category/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
