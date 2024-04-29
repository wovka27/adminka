<script setup lang="ts">
import { useRouter } from 'vue-router'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import { type IApiTagListItem, fetchGetApiTagList } from '@/services/REST/dom_admin/api_tag'

const router = useRouter()

useAppHeader({
  title: 'Теги',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Управление API' }, { label: 'Теги' }]
})

const { data_list } = useListView<IApiTagListItem>({
  router,
  sort: false,
  meta: false,
  fetchGetList: fetchGetApiTagList,
  getRightKindOfResponseForDataList: (response) => response
})
</script>

<template>
  <div class="TagsView ListView">
    <PskTable :data="data_list">
      <el-table-column label="Название тега" prop="name" min-width="350">
        <template #default="scope">
          <div class="TagsView__PskTableTdUid">
            <span class="croppedText">{{ scope.row.uid }}</span>
          </div>
          <PskLink class="croppedText" :to="`/tags/${scope.row.uid}`" color="primary_dark">
            {{ scope.row.name }}
          </PskLink>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="90">
        <template #default="scope">
          <PskLink small-font-weight :to="`/tags/${scope.row.uid}`">Изменить</PskLink>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>

<style lang="scss">
.TagsView__PskTableTdUid {
  @include setFontStyle8();
  color: $c_light;
}
</style>
