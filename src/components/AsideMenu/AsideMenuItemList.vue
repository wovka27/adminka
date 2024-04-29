<script lang="ts" setup>
import type { MenuType } from '@/services/REST/dom_admin/aside_menu'

interface AsideMenuItemList {
  menu_list: MenuType[]
}

defineProps<AsideMenuItemList>()
</script>

<template>
  <template v-for="item of menu_list" :key="item.slug">
    <el-menu-item v-if="!('children' in item)" :index="`/${item.slug}`" :route="`/${item.slug}`">
      {{ item.title }}
    </el-menu-item>

    <el-sub-menu v-else :index="item.slug">
      <template #title>
        <span>
          {{ item.title }}
        </span>
      </template>
      <AsideMenuItemList :menu_list="item.children" />
    </el-sub-menu>
    <div v-if="item.has_underline" class="AsideMenuItemList__line"></div>
  </template>
</template>

<style lang="scss">
.AsideMenuItemList__line {
  width: 100%;
  height: 1px;
  background-color: $c_body;
  margin: 10px 0;
}
.el-menu-item.is-active {
  color: #409eff !important;
}
</style>
