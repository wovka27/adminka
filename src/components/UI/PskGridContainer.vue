<script lang="ts" setup>
defineProps<{
  wrapClass?: string
  title?: string
  gridColumnCount?: number | string
  gridSpan?: number | string
}>()
</script>

<template>
  <div class="UiFormSection" :class="gridSpan && `span-${gridSpan}`">
    <h2 v-if="title" class="UiFormSection__title">{{ title }}</h2>
    <div
      class="UiFormSection__body"
      :class="{ wrapClass, [`UiFormSection__gridColumnCount-${gridColumnCount}`]: gridColumnCount }"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.UiFormSection {
  &__body {
    display: grid;
    gap: 20px 30px;
    align-items: end;
  }

  @for $i from 1 to 6 {
    .UiFormSection__gridColumnCount-#{$i} {
      grid-template-columns: repeat($i, 1fr);
    }
  }
  @for $i from 1 to 6 {
    .span-#{$i} {
      grid-column: span $i;
    }
  }
}

.UiFormSection__title {
  font-weight: 700;
  font-size: 14px;
  color: #212529;
  margin: 30px 0;
}
</style>
