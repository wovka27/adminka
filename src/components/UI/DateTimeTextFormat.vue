<script lang="ts" setup>
import { computed } from 'vue'

import { Clock } from '@element-plus/icons-vue'
interface IDateTimeTextFormat {
  date: Date | string
}

const props = defineProps<IDateTimeTextFormat>()

const date_view = computed(() => new Date(props.date).toLocaleDateString('ru'))
const time_view = computed(() =>
  new Date(props.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
)
</script>

<template>
  <div class="DateTimeTextFormat">
    <div class="DateTimeTextFormat__date">
      <el-icon class="DateTimeTextFormat__dateIcon" size="large"> <Clock /> </el-icon>{{ date_view }}
    </div>
    <div class="DateTimeTextFormat__time">{{ time_view }}</div>
  </div>
</template>

<style lang="scss">
.DateTimeTextFormat {
  display: flex;
  gap: 10px;
}

.DateTimeTextFormat__date {
  display: flex;
  align-items: center;
  gap: 5px;
}

.DateTimeTextFormat__dateIcon {
  opacity: 0.5;
}

.DateTimeTextFormat__time {
  opacity: 0.5;
}
</style>
