<script setup lang="ts">
import { useRouter } from 'vue-router'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import FilterHouse from '@/components/Filter/FilterHouse.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IEstateListItem, fetchGetFlatList } from '@/services/REST/dom_admin/estate'

import { downloadFile } from '@/utils/downloadFile'

import { useProgressStore } from '@/stores/useProgressStore'

const router = useRouter()
const progress = useProgressStore()

useAppHeader({
  title: 'Квартиры',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Объекты недвижимости' }, { label: 'Квартиры' }]
})

const { setList, data_list, meta, sort, handleChangeFilter } = useListView<IEstateListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetFlatList,
  filter: {
    complex: true,
    house: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})
</script>

<template>
  <div class="FlatListView ListView">
    <FilterComplex @complexSelectedChange="handleChangeFilter" />

    <FilterHouse @houseSelectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Квартира" sortable prop="name" min-width="350px">
        <template #default="scope">
          <PskTableTdName
            :uid="scope.row.uid"
            :name="scope.row.name"
            :route="`/real_properties_flats/${scope.row.uid}`"
          />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Площадь" sortable prop="square" min-width="130px">
        <template #default="scope">
          {{ scope.row.square }}
        </template>
      </el-table-column>

      <el-table-column label="Этаж" sortable prop="floor" min-width="100px">
        <template #default="scope">
          {{ scope.row.floor }}
        </template>
      </el-table-column>

      <el-table-column label="Кол-во комнат" sortable prop="rooms" min-width="170px">
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
            <PskLink small-font-weight :to="`/real_properties_flats/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
      <template #footer>
        <span class="PskLink" @click="downloadFile($route.query, progress)">Экспорт в XLSX</span>
      </template>
    </PskTable>
  </div>
</template>
