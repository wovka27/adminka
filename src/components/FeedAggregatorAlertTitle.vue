<script setup lang="ts">
interface IFeedAggregatorAlertTitleProps {
  type: AggregatorItemType
}

defineProps<IFeedAggregatorAlertTitleProps>()

const aggregator_name: Record<AggregatorItemType, string> = {
  cian: 'Циан',
  avito: 'Авито',
  yandex: 'Яндекс.Недвижимость',
  m2: 'M2',
  dom_click: 'ДомКлик',
  idalite: 'Идалайт',
  etagi: 'Этажи'
}
</script>

<template>
  <PskAlert
    class="span-3"
    style="margin-top: 10px"
    type="info"
    :text="`Данная информация будет использоваться для вывода на ${aggregator_name[type]}`"
  />
</template>
