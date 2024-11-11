<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

import type { IEstateSmartPrice } from '@/services/REST/dom_admin/estate'

interface IProfitDomPricesItemProps {
  price: IEstateSmartPrice
}

const props = defineProps<IProfitDomPricesItemProps>()
const emit = defineEmits(['handleUpdateField', 'removeCost'])
</script>

<template>
  <div class="ProfitDomPrices__priceItem">
    <el-icon class="ProfitDomPrices__btnClose" @click="emit('removeCost', price.price_type_uid)">
      <Close class="iconHover_danger" />
    </el-icon>

    <PskInput
      @update:model-value="emit('handleUpdateField', 'cost', $event, price)"
      :model-value="price.cost"
      :label="price.price_type + ', ₽'"
      :label_uid="price.price_type_uid"
      type="cash"
    />

    <PskInput
      @update:model-value="emit('handleUpdateField', 'old_cost', $event, price)"
      :model-value="price.old_cost || '0'"
      label="Старая цена, ₽"
      type="cash"
    />

    <PskInput
      @update:model-value="emit('handleUpdateField', 'comm_remune', $event, price)"
      :model-value="price.comm_remune"
      label="КВ"
    />
  </div>
</template>

<style lang="scss">
.ProfitDomPrices__priceItem {
  position: relative;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid $c_border_light;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: border-color 150ms ease-in-out;

  &:hover {
    border-color: darken($c_border_light, 15%);
  }
}

.ProfitDomPrices__btnClose {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
