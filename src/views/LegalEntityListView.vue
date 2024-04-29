<script setup lang="ts">
import { useRouter } from 'vue-router'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type ILegalEntityListItem, fetchGetLegalEntityList } from '@/services/REST/dom_admin/legal_entity'

const router = useRouter()

useAppHeader({
  title: 'Юридические лица',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Застройщики' }, { label: 'Юридические лица' }],
  btn: {
    label: 'Добавить застройщика',
    handleClick: () => router.push({ name: 'legal_entity', params: { uid: 'create' } })
  }
})

const { setList, data_list, sort, meta } = useListView<ILegalEntityListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetLegalEntityList,
  getRightKindOfResponseForDataList: (response) => response.payload
})
</script>

<template>
  <div class="LegalEntityListView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Сокращенное наименование" sortable prop="abbreviated_name" min-width="350px">
        <template #default="scope">
          <PskTableTdName
            :uid="scope.row.uid"
            :name="scope.row.name"
            :route="`/real_estate_developers_legal_entities/${scope.row.uid}`"
          />
        </template>
      </el-table-column>

      <el-table-column class="croppedText" label="Группа компаний" sortable prop="name" min-width="200px">
        <template #default="scope">
          <span class="croppedText">{{ scope.row.company_group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Активность" sortable min-width="150" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="85">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight :to="`/real_estate_developers_legal_entities/${scope.row.uid}`">
              Изменить
            </PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
