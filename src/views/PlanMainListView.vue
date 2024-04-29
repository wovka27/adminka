<script setup lang="ts">
import { useRouter } from 'vue-router'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IPlansMainListItem, fetchGetPlansMainList } from '@/services/REST/dom_admin/plans_main'

const router = useRouter()

useAppHeader({
  title: 'Список',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Планировки' }, { label: 'Список' }]
})

const { setList, data_list, meta, handleChangeFilter, sort } = useListView<IPlansMainListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetPlansMainList,
  filter: {
    complex: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})
</script>

<template>
  <div class="PlanMainListView ListView">
    <FilterComplex @complexSelectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Название" sortable prop="name" width="300px">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/plans_main/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Артикул" sortable prop="article" min-width="140">
        <template #default="scope">
          <span class="croppedText">{{ scope.row.article }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Площадь" sortable prop="square" min-width="120">
        <template #default="scope">
          {{ scope.row.square }}
        </template>
      </el-table-column>

      <el-table-column label="Кол-во комнат" sortable prop="rooms" min-width="160">
        <template #default="scope">
          {{ scope.row.rooms }}
        </template>
      </el-table-column>

      <el-table-column label="Активность" sortable min-width="140" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="85">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight :to="`/plans_main/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
