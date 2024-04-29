<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useFiltersStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IComplexListItem, fetchGetComplexList } from '@/services/REST/dom_admin/complex'

const router = useRouter()
const filters_store = useFiltersStore()

useAppHeader({
  title: 'Жилые комплексы',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Жилые комплексы' }]
})

const { setList, data_list, meta, sort } = useListView<IComplexListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetComplexList,
  getRightKindOfResponseForDataList: (response) => response.payload
})
</script>

<template>
  <div class="ComplexListView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Название ЖК" sortable prop="name" width="350px">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/complexes/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column label="Коммерческое название" sortable prop="title" min-width="240" />
      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />
      <el-table-column label="Класс ЖК" sortable prop="class_type" min-width="150" />

      <el-table-column label="Активность" sortable min-width="150" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn
            :uid="scope.row.uid"
            v-model="scope.row.show"
            @update:modelValue="filters_store.setFiltersComplex"
          />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="85">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight :to="`/complexes/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
