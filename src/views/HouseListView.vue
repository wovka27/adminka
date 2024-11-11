<script setup lang="ts">
import { useRouter } from 'vue-router'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IHouseListItem, fetchGetHouseList } from '@/services/REST/dom_admin/house'

const router = useRouter()

useAppHeader({
  title: 'Дома',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Дома' }]
})

const { setList, data_list, sort, meta, handleChangeFilter } = useListView<IHouseListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetHouseList,
  filter: {
    complex: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})
</script>

<template>
  <div class="HouseListView ListView">
    <FilterComplex @selectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Дом" sortable prop="name" min-width="350px">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/houses/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Этажность" sortable prop="floors" min-width="140">
        <template #default="scope">
          {{ scope.row.floors }}
        </template>
      </el-table-column>

      <el-table-column label="Срок сдачи" sortable prop="ready_date" min-width="160">
        <template #default="scope">
          <div class="croppedText">{{ scope.row.ready_date }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Активность" sortable min-width="150" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="85">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight :to="`/houses/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
