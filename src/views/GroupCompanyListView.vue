<script setup lang="ts">
import { useRouter } from 'vue-router'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IGroupCompanyListItem, fetchGetGroupCompanyList } from '@/services/REST/dom_admin/group_company'

const router = useRouter()

useAppHeader({
  title: 'Группа компаний',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Застройщики' }, { label: 'Группа компаний' }],
  btn: {
    label: 'Добавить компанию',
    handleClick: () => router.push({ name: 'group_company', params: { uid: 'create' } })
  }
})

const { setList, data_list, sort, meta } = useListView<IGroupCompanyListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetGroupCompanyList,
  getRightKindOfResponseForDataList: (response) => response.payload
})
</script>

<template>
  <div class="GroupCompanyListView ListView">
    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Группа компаний" sortable prop="name" width="350px">
        <template #default="scope">
          <PskTableTdName
            :uid="scope.row.uid"
            :name="scope.row.name"
            :route="`/real_estate_developers_group_companies/${scope.row.uid}`"
          />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Активность" sortable min-width="150" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column sortable prop="website_url" label="Ссылка на сайт" min-width="180">
        <template #default="scope">
          <PskLink class="croppedText" :to="scope.row.website_url || ''" native target="_blank">
            {{ scope.row.website_url }}
          </PskLink>
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="85">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight :to="`/real_estate_developers_group_companies/${scope.row.uid}`">
              Изменить
            </PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
