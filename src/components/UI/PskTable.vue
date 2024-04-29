<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'

export interface IPskTableProps {
  data: any
  meta?: IMeta
  sort?: ISort
}

const props = defineProps<IPskTableProps>()
const emit = defineEmits(['sortChange', 'update:meta', 'update:sort'])

const page_current = computed({
  get: () => props.meta?.page_current || 0,
  set: (page: number) => {
    emit('update:meta', { ...props.meta, page_current: page })
  }
})

const page_per = computed({
  get: () => props.meta?.page_per || 0,
  set: (page: number) => {
    emit('update:meta', { ...props.meta, page_per: page, page_current: 1 })
  }
})

const is_show_footer = computed(() => props.meta && props.data.length)

const default_sort = ref()

const handleSortChange = (event: { prop: string; order: 'ascending' | 'descending' | null }) => {
  if (!event.order) {
    emit('update:sort', undefined)
    emit('update:meta', { ...props.meta, page_current: 1 })
    return
  }

  const valueOrder = new Map([
    ['ascending', 'asc'],
    ['descending', 'desc']
  ])

  emit('update:sort', { [event.prop]: valueOrder.get(event.order) })
  emit('update:meta', { ...props.meta, page_current: 1 })
}

onBeforeMount(() => {
  if (!props.sort) return

  const [key, val] = Object.entries(props.sort)[0]

  default_sort.value = {
    prop: key,
    order: new Map([
      ['asc', 'ascending'],
      ['desc', 'descending']
    ]).get(val)
  }
})
</script>

<template>
  <div class="PskTable">
    <div class="PskTable__table">
      <el-table
        height="100%"
        width="100%"
        max-width="100%"
        @sort-change="handleSortChange"
        :data="data"
        :default-sort="default_sort"
      >
        <slot />
      </el-table>
    </div>

    <footer v-if="is_show_footer" class="PskTable__footer">
      <el-pagination
        class="PskPaginator"
        v-model:current-page="page_current"
        v-model:page-size="page_per"
        :page-count="meta?.page_last"
        layout="sizes, prev, pager, next"
        :page-sizes="[1, 5, 10, 20, 30, 50, 100]"
      />
      <slot name="footer" />
    </footer>
  </div>
</template>

<style lang="scss">
.PskTable {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  background-color: $c_body;
}

.PskTable__table {
  height: 100%;
  overflow: auto;
  width: 100%;
}

.PskTable__footer {
  padding: 12px 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
