<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue'])

const feed_category_list = [
  { id: 1, name: 'cian', icon: '/icons/icon_cian.svg' },
  { id: 2, name: 'avito', icon: '/icons/icon_avito.svg' },
  { id: 3, name: 'yandex', icon: '/icons/icon_yandexRealEstate.svg' },
  { id: 4, name: 'dom_click', icon: '/icons/icon_domClick.svg' }
]
</script>

<template>
  <div class="FeedCategoryFilterList">
    <div
      v-for="item of feed_category_list"
      :key="item.id"
      class="FeedCategoryFilterList__item"
      :class="{ active: modelValue === item.name }"
      @click="$emit('update:modelValue', item.name)"
    >
      <img :src="item.icon" :alt="item.name" />
    </div>
  </div>
</template>

<style lang="scss">
.FeedCategoryFilterList {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  margin-left: 10px;
}

.FeedCategoryFilterList__item {
  cursor: pointer;
  padding: 0 10px;
  min-height: 76.47px;
  display: flex;
  flex-shrink: 0;
  will-change: transition;
  transition:
    box-shadow 0.2s ease-in-out,
    transform 0.2s ease-in-out;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow:
    0 0 8px #0000000a,
    0 4px 12px #00000008,
    0 4px 16px 2px #00000005;
  border-radius: 4px;

  &:not(.active):hover {
    box-shadow:
      0 5px 8px #0000000a,
      0 10px 12px #00000008,
      0 12px 25px 2px #00000005;
    transform: scale(1.02);
  }

  img {
    transition:
      filter 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
    width: 100px;
    height: auto;
    opacity: 0.2;
    filter: grayscale(1);
  }

  &.active {
    img {
      opacity: 1;
      filter: grayscale(0);
    }
  }
}
</style>
