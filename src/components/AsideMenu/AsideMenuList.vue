<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import type { MenuType } from '@/services/REST/dom_admin/aside_menu'

interface IAsideMenuProps {
  menu_list: MenuType[]
}

defineProps<IAsideMenuProps>()

const router = useRouter()
const default_active = computed(() => `/${router.currentRoute.value.path.split('/')[1]}`)
</script>

<template>
  <el-scrollbar class="AsideMenu__list">
    <el-menu router :default-active="default_active">
      <AsideMenuItemList :menu_list="menu_list" />
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss">
.AsideMenu__list {
  .el-menu-item {
    &:hover {
      color: #409eff !important;
    }
  }

  .el-sub-menu {
    span:hover {
      background: none;
      color: #409eff !important;
    }

    &__title {
      height: 38px;
      line-height: 0;
      padding-left: 10px !important;
      color: $c_body;

      &:hover {
        background: none;
      }
    }

    .el-menu-item {
      padding-left: 34px !important;
      opacity: 0.5;

      &:hover {
        color: #409eff !important;
        opacity: 1;
      }

      &.is-active {
        opacity: 1;
      }
    }
  }

  .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item,
  .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container)
    .el-menu-item-group__title,
  .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-sub-menu__title {
    padding-left: 0;
  }

  .el-menu {
    border-right: none;
    background: none;

    &-item {
      font-size: 14px;
      line-height: 0;
      height: 38px;
      //padding: 0;
      padding-left: 10px !important;
      color: $c_body;

      &.is-active {
        color: $c_body_saturated;
      }

      &:hover {
        background: none;
      }

      &-group__title {
        padding: 0;
      }
    }
  }
}
</style>
