<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAsideMenuStore } from '@/stores'

import AsideMenuList from '@/components/AsideMenu/AsideMenuList.vue'

const aside_menu_store = useAsideMenuStore()
const router = useRouter()

const AsideMenu_style = computed(() => ({
  width: (aside_menu_store.is_aside_menu_open ? 240 : 0) + 'px'
}))

const logout = async () => {
  localStorage.removeItem('dom_admin_token')
  Object.values(await import('@/stores')).forEach((i) => i().$reset())
  await router.replace('/login')
}
</script>

<template>
  <aside class="AsideMenu" :style="AsideMenu_style">
    <div class="AsideMenu__content">
      <button
        class="AsideMenu__btnHideMenu"
        :class="{ open: aside_menu_store.is_aside_menu_open }"
        @click="aside_menu_store.is_aside_menu_open = !aside_menu_store.is_aside_menu_open"
      >
        <svg
          class="AsideMenu__btnHideMenuArrow"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M7.13672 1.74596L3.25772 5.74196C3.18747 5.81221 3.15234 5.89621 3.15234 5.99396C3.15234 6.09171 3.18747 6.17959 3.25772 6.25759L7.13672 10.2536C7.20697 10.3161 7.28897 10.3473 7.38272 10.3473C7.47647 10.3473 7.55847 10.3122 7.62872 10.242C7.69897 10.1717 7.73409 10.0897 7.73409 9.99596C7.73409 9.90221 7.69897 9.82021 7.62872 9.74996L3.97247 5.99996L7.62872 2.24996C7.69897 2.17971 7.73409 2.09771 7.73409 2.00396C7.73409 1.91021 7.69897 1.82821 7.62872 1.75796C7.55847 1.68771 7.47647 1.65259 7.38272 1.65259C7.28897 1.65259 7.20697 1.68384 7.13672 1.74634V1.74596Z"
            fill="#E5EAF3"
          />
        </svg>
      </button>

      <RouterLink to="/">
        <img class="AsideMenu__logo" src="/icons/icon_dom-admin.svg" alt="иконка админки" />
      </RouterLink>

      <AsideMenuList class="AsideMenu__AsideMenuList" :menu_list="aside_menu_store.aside_menu" />
      <PskButton class="AsideMenu__btn" type="primary" @click="logout">Выйти</PskButton>
    </div>
  </aside>
</template>

<style lang="scss">
.AsideMenu {
  position: relative;

  height: 100%;
  border-radius: 0 4px 4px 0;

  box-shadow: 0 2px 4px 0 #232531;
  background-color: $c_body_saturated;

  transition: width 0.2s ease-in-out;
}

.AsideMenu__content {
  height: 100%;
  padding: 12px 0 12px 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.AsideMenu__btnHideMenu {
  width: 15px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #fff;
  border-radius: 4px;
  background: #222b45;
  cursor: pointer;

  position: absolute;
  right: -12px;
  z-index: 10;
}

.AsideMenu__btnHideMenuArrow {
  transition: transform 0.2s ease-in-out;
  transform: scale(-1);
}

.AsideMenu__btnHideMenu.open .AsideMenu__btnHideMenuArrow {
  transform: scale(1);
}

.AsideMenu__AsideMenuList {
  height: 100%;
}
</style>
