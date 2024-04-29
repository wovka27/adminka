<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useModalConfirmStore } from '@/stores'

import ChangedActiveListItemBtn from '@/components/ChangedActiveListItemBtn.vue'
import FilterComplex from '@/components/Filter/FilterComplex.vue'
import TableActionsContainer from '@/components/TableActionsContainer.vue'

import useAppHeader from '@/composables/app/useAppHeader'
import useListView from '@/composables/app/useListView'

import {
  type IPromotionCategoryListItem,
  fetchDeletePromotionCategoryListItem,
  fetchGetPromotionCategoryList
} from '@/services/REST/dom_admin/promotion_category'

const router = useRouter()
const modal_confirm_store = useModalConfirmStore()

useAppHeader({
  title: 'Категории',
  docs_link: router.currentRoute.value.path,
  breadcrumbs: [{ label: 'Акционные блоки' }, { label: 'Категории' }],
  btn: {
    label: 'Добавить категорию',
    handleClick: () => router.push({ name: 'promotion_category', params: { uid: 'create' } })
  }
})

const { setList, data_list, sort, meta, handleChangeFilter } = useListView<IPromotionCategoryListItem>({
  router,
  sort: true,
  meta: true,
  fetchGetList: fetchGetPromotionCategoryList,
  filter: {
    complex: true
  },
  getRightKindOfResponseForDataList: (response) => response.payload
})

modal_confirm_store.callback = async (uid) => {
  await fetchDeletePromotionCategoryListItem(uid)
  await setList()
}
</script>

<template>
  <div class="PromotionCategoryView ListView">
    <FilterComplex @complexSelectedChange="handleChangeFilter" />

    <PskTable :data="data_list" v-model:meta="meta" @update:meta="setList" v-model:sort="sort">
      <el-table-column label="Категории" sortable prop="name" min-width="350px">
        <template #default="scope">
          <div class="PromotionCategoryView__PskTableTdUid">
            <span class="croppedText">{{ scope.row.uid }}</span>
          </div>
          <PskLink class="croppedText" :to="`/promotion_category/${scope.row.uid}`" color="primary_dark">
            {{ scope.row.name }}
          </PskLink>
        </template>
      </el-table-column>

      <el-table-column label="Сортировка" sortable prop="weight" min-width="150" />

      <el-table-column label="Активность" sortable min-width="140" prop="show">
        <template #default="scope">
          <ChangedActiveListItemBtn :uid="scope.row.uid" v-model="scope.row.show" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="140">
        <template #default="scope">
          <TableActionsContainer>
            <PskLink small-font-weight to="" @click="modal_confirm_store.openModal(() => scope.row.uid)"
              >Удалить</PskLink
            >
            <PskLink small-font-weight :to="`/promotion_category/${scope.row.uid}`">Изменить</PskLink>
          </TableActionsContainer>
        </template>
      </el-table-column>
    </PskTable>
  </div>
</template>

<style lang="scss">
.PromotionCategoryView__PskTableTdUid {
  @include setFontStyle8();
  color: $c_light;
}
</style>
