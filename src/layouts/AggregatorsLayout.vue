<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAppStateStore } from '@/stores'

import type { IPskTabsProps } from '@/components/UI/PskTabs.vue'

export interface IAggregatorsLayoutProps {
  aggregators: {
    uid: string
    type: string
    label: string
    component: any
  }[]
  getIsStateBeforeEqualAfter: () => boolean
}

const props = defineProps<IAggregatorsLayoutProps>()
const emit = defineEmits(['pushCommonData'])

const router = useRouter()
const app_state_store = useAppStateStore()
const router_name_saved = router.currentRoute.value.name as string

const tab_options: IPskTabsProps['tabs'] = [{ label: 'Общие данные' }, { label: 'Агрегаторы' }]

const tab_active = computed({
  get: () => {
    const aggregator_uid = router.currentRoute.value.params.aggregator_uid
    return aggregator_uid && props.aggregators.find((i) => i.uid === aggregator_uid) ? tab_options[1] : tab_options[0]
  },

  set: (tab) => {
    if (tab === tab_options[0]) {
      router.replace({
        params: {
          uid: router.currentRoute.value.params.uid,
          aggregator_uid: ''
        }
      })
      emit('pushCommonData')
      return
    }

    router.replace({
      params: {
        uid: router.currentRoute.value.params.uid,
        aggregator_uid: props.aggregators[0].uid
      }
    })
  }
})

const aggregator_type_current = computed({
  get: () => props.aggregators.find((i) => i.uid === router.currentRoute.value.params.aggregator_uid)!,

  set: (aggregator: IAggregatorsLayoutProps['aggregators'][0]) => {
    router.replace({ params: { uid: router.currentRoute.value.params.uid, aggregator_uid: aggregator.uid } })
  }
})

const aggregator_component_ref = ref<{ getIsStateBeforeEqualAfter: () => boolean }>()

const aggregator_component_current = computed(
  () => props.aggregators.find((i) => i.type === aggregator_type_current.value.type)?.component
)

const setGetIsStateBeforeEqualAfter = async () => {
  if (tab_active.value.label === 'Общие данные') {
    app_state_store.getIsStateBeforeEqualAfter = props.getIsStateBeforeEqualAfter
    return
  }

  app_state_store.getIsStateBeforeEqualAfter = aggregator_component_ref.value!.getIsStateBeforeEqualAfter
}

watch(
  () => router.currentRoute.value,
  (value) => {
    if (value.name !== router_name_saved) return

    nextTick(setGetIsStateBeforeEqualAfter)
  }
)

onMounted(setGetIsStateBeforeEqualAfter)

onUnmounted(() => {
  app_state_store.getIsStateBeforeEqualAfter = null
})
</script>

<template>
  <div class="AggregatorsLayout">
    <div class="AggregatorsLayout__header">
      <PskTabs v-if="aggregators.length" class="AggregatorsLayout__PskTabs" v-model="tab_active" :tabs="tab_options" />

      <PskTabSelect
        class="AggregatorsLayout__tabSelect"
        v-model="aggregator_type_current"
        :options="aggregators"
        options_label="label"
        value_key="uid"
        v-if="tab_active.label === 'Агрегаторы'"
      />
    </div>

    <div class="AggregatorsLayout__content">
      <template v-if="tab_active.label === 'Общие данные'">
        <slot />
      </template>

      <template v-else>
        <component ref="aggregator_component_ref" :is="aggregator_component_current" />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.AggregatorsLayout {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: $c_body;
}

.AggregatorsLayout__header {
  padding-left: 20px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.AggregatorsLayout__tabSelect {
  padding-bottom: 5px;
}

.AggregatorsLayout__PskTabs {
  background-color: $c_body;
}

.AggregatorsLayout__content {
  height: 100%;
  overflow: auto;
}
</style>
