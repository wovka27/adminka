<script setup lang="ts">
import { computed, ref } from 'vue'

interface IFeedCollapseTableProps {
  title: string
  data_list: {
    uid: string
    name: string
    uid_aggregator: string
    override_global_price: boolean
    force_load: boolean
    status: string
  }[]
  name_key: string
}

const props = defineProps<IFeedCollapseTableProps>()

const page_per = ref(5)
const page_current = ref(1)
const curr_list = computed(() =>
  props.data_list.slice((page_current.value - 1) * page_per.value, page_per.value * page_current.value)
)

const page_last = computed(() => Math.ceil(props.data_list.length / page_per.value))

const meta = computed({
  get: () => ({ page_per: page_per.value, page_current: page_current.value, page_last: page_last.value }),
  set: (meta: IMeta) => {
    ;(page_per.value = meta.page_per), (page_current.value = meta.page_current)
  }
})
</script>

<template>
  <PskInfoCollapse class="span-2" v-if="curr_list.length" :title="title" marginBottom="0">
    <PskTable :data="curr_list" v-model:meta="meta">
      <el-table-column label="Квартира" prop="name">
        <template #default="scope">
          <PskLink :to="{ name: 'flat', params: { uid: scope.row.uid, aggregator_uid: scope.row.uid_aggregator } }">{{
            scope.row.name
          }}</PskLink>
        </template>
      </el-table-column>

      <el-table-column label="Статус" prop="status" width="150" />

      <!-- <el-table-column label="Активность" prop="name" width="150">
        <template #default="scope">
          <PskSwitch v-model="scope.row[name_key]" />
        </template>
      </el-table-column> -->
    </PskTable>
  </PskInfoCollapse>
</template>

<style lang="scss"></style>
