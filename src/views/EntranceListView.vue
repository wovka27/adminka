<script setup lang="ts">
import { useRouter } from 'vue-router'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import FilterHouse from '@/components/Filter/FilterHouse.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IEntranceListItem, fetchGetEntranceList } from '@/services/REST/dom_admin/entrance'

const router = useRouter()

useAppHeader({
  title: 'Подъезды/Секции',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Подъезды/Секции' }]
})

const { sort, meta, setList, data_list, handleChangeFilter } = useListView<IEntranceListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetEntranceList,
  getRightKindOfResponseForDataList: (response) => response.payload,
  filter: {
    complex: true,
    house: true
  }
})
</script>

<template>
  <div class="EntranceListView ListView">
    <FilterComplex @selectedChange="handleChangeFilter" />

    <FilterHouse @selectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Подъезды/секции" sortable prop="name" width="350px">
        <template #default="scope">
          <PskTableTdName :uid="scope.row.uid" :name="scope.row.name" :route="`/entrances/${scope.row.uid}`" />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Этажность" sortable prop="floors" min-width="130">
        <template #default="scope">
          {{ scope.row.floors }}
        </template>
      </el-table-column>

      <el-table-column label="Материалы секции" sortable prop="construction_material" min-width="200">
        <template #default="scope">
          {{ scope.row.construction_material }}
        </template>
      </el-table-column>

      <el-table-column label="Квартир на этаже" sortable prop="flat_count" min-width="200">
        <template #default="scope">
          {{ scope.row.flat_count }}
        </template>
      </el-table-column>
      <el-table-column label="Дом" sortable prop="house_name" min-width="120">
        <template #default="scope">
          <span class="croppedText">{{ scope.row.house_name }}</span>
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
            <PskLink small-font-weight :to="`/entrances/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
