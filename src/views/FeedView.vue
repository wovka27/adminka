<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FeedCategoryFilterList from '@/components/FeedCategoryFilterList.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type IFeedListItem,
  fetchDeleteFeedListItem,
  fetchGenerateFeed,
  fetchGetFeedList
} from '@/services/REST/dom_admin/feed'

const router = useRouter()

const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Управление фидами',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Управление фидами' }],
  btn: {
    label: 'Добавить фид',
    handleClick: () => router.push({ name: 'feed', params: { uid: 'create' } })
  }
})

const { meta, setList, data_list, sort, handleChangeFilter } = useListView<IFeedListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetFeedList,
  getRightKindOfResponseForDataList: (response) => response.payload,
  filter: {
    filterFn: (query, params) => {
      if (feed_category_selected.value) query.type = params.type = feed_category_selected.value
    }
  },

  handleChangeFilterCallback: (name) => {
    feed_category_selected.value = feed_category_selected.value === name ? '' : name
  },
  onBeforeMountCallback: async () => {
    feed_category_selected.value = (router.currentRoute.value.query?.type as string) || ''
  }
})

const feed_category_selected = ref<string>('')

modal_confirm_store.callback = async (uid) => {
  await fetchDeleteFeedListItem(uid)
  await setList()
}
</script>

<template>
  <div class="FeedView ListView">
    <FeedCategoryFilterList :modelValue="feed_category_selected" @update:modelValue="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Название фида" sortable prop="name" min-width="300">
        <template #default="scope">
          <PskTableTdName :route="`/feed/${scope.row.uid}`" :name="scope.row.name" :uid="scope.row.uid" />
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Активность" sortable min-width="140" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="210">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="fetchGenerateFeed(scope.row.uid)">Генерация</PskLink>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)">
              Удалить
            </PskLink>
            <PskLink small-font-weight :to="`/feed/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>
