<script setup lang="ts">
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AsideMenu from '@/components/AsideMenu/AsideMenu.vue'
</script>

<template>
  <div class="DefaultLayout">
    <AsideMenu />

    <div class="DefaultLayout_right">
      <AppHeader />
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.DefaultLayout {
  height: 100%;
  display: flex;
}

.DefaultLayout_right {
  height: 100%;
  width: 100%;
  background-color: $c_bg;

  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: auto;
}
</style>
