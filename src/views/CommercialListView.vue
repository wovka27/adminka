<script setup lang="ts">
import { useRouter } from 'vue-router'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import FilterHouse from '@/components/Filter/FilterHouse.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IEstateListItem, fetchGetCommercialList } from '@/services/REST/dom_admin/estate'

const router = useRouter()

useAppHeader({
  title: 'Коммерция',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Объекты недвижимости' }, { label: 'Коммерция' }]
})

const { setList, data_list, sort, meta, handleChangeFilter } = useListView<IEstateListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetCommercialList,
  filter: {
    complex: true,
    house: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})
</script>

<template>
  <div class="CommercialListView ListView">
    <FilterComplex @selectedChange="handleChangeFilter" />

    <FilterHouse @selectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Коммерция" sortable prop="name" min-width="350px">
        <template #default="scope">
          <PskTableTdName
            :uid="scope.row.uid"
            :name="scope.row.name"
            :route="`/real_properties_commercials/${scope.row.uid}`"
          />
        </template>
      </el-table-column>

      <el-table-column label="Статус" sortable prop="status" min-width="140" />

      <el-table-column label="Площадь" sortable prop="square" min-width="150">
        <template #default="scope">
          {{ scope.row.square }}
        </template>
      </el-table-column>

      <el-table-column label="Этаж" sortable prop="floor" min-width="150">
        <template #default="scope">
          {{ scope.row.floor }}
        </template>
      </el-table-column>

      <el-table-column label="Кол-во комнат" sortable prop="rooms" min-width="180">
        <template #default="scope">
          {{ scope.row.rooms }}
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
            <PskLink small-font-weight :to="`/real_properties_commercials/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
