<script lang="ts" setup>
import { useAppHeaderStore } from '@/stores'

import IconArrow from '@/components/Icons/IconArrow.vue'

const app_header_state = useAppHeaderStore()
</script>

<template>
  <header class="AppHeader">
    <div class="AppHeader__row">
      <div class="AppHeader__breadcrumbs">
        <el-breadcrumb :separator-icon="IconArrow">
          <el-breadcrumb-item v-for="link of app_header_state.breadcrumbs" :to="link.route" :key="link.label">
            {{ link.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <a
        class="AppHeader__docLink"
        :class="{ hidden: !app_header_state.docs_link }"
        :href="app_header_state.docs_link"
        target="_blank"
        title="Инструкция по разделу"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 0C8.97933 0.052 10.6278 0.736833 11.9455 2.0545C13.2632 3.37217 13.948 5.02067 14 7C13.948 8.97933 13.2632 10.6278 11.9455 11.9455C10.6278 13.2632 8.97933 13.948 7 14C5.02067 13.948 3.37217 13.2632 2.0545 11.9455C0.736833 10.6278 0.052 8.97933 0 7C0.052 5.02067 0.736833 3.37217 2.0545 2.0545C3.37217 0.736833 5.02067 0.052 7 0ZM7 11C7.22933 10.9897 7.4195 10.9115 7.5705 10.7655C7.7215 10.6195 7.797 10.432 7.797 10.203C7.797 9.974 7.7215 9.78383 7.5705 9.6325C7.4195 9.48117 7.22933 9.40567 7 9.406C6.77067 9.40633 6.5805 9.48183 6.4295 9.6325C6.2785 9.78317 6.203 9.97333 6.203 10.203C6.203 10.4327 6.2785 10.6202 6.4295 10.7655C6.5805 10.9108 6.77067 10.989 7 11ZM7 6.797C6.83333 6.80733 6.69267 6.86717 6.578 6.9765C6.46333 7.08583 6.406 7.2265 6.406 7.3985C6.406 7.5705 6.46333 7.71367 6.578 7.828C6.69267 7.94233 6.83333 7.99967 7 8C7.68767 7.98967 8.2815 7.77083 8.7815 7.3435C9.2815 6.91617 9.594 6.364 9.719 5.687C9.81267 5.01 9.69033 4.39017 9.352 3.8275C9.01367 3.26483 8.51633 2.869 7.86 2.64C7.20367 2.43167 6.5735 2.44983 5.9695 2.6945C5.3655 2.93917 4.89667 3.36367 4.563 3.968L5.5785 4.6085C5.7555 4.25417 6.01333 3.999 6.352 3.843C6.69067 3.687 7.05 3.6635 7.43 3.7725C7.81 3.8815 8.10167 4.0925 8.305 4.4055C8.50833 4.7185 8.58133 5.07 8.524 5.46C8.46667 5.85 8.29733 6.16767 8.016 6.413C7.73467 6.65833 7.39617 6.786 7.0005 6.796L7 6.797Z"
            fill="#303133"
          />
        </svg>
      </a>
    </div>

    <div class="AppHeader__row">
      <div class="AppHeader__title">
        <PskLink
          to=""
          class="AppHeader__linkBack"
          v-if="app_header_state.handleBack"
          @click="app_header_state.handleBack"
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.5 4.5H11.5C11.646 4.5 11.7658 4.54683 11.8595 4.6405C11.9532 4.73417 12 4.854 12 5C12 5.146 11.9532 5.26583 11.8595 5.3595C11.7658 5.45317 11.646 5.5 11.5 5.5H1.5C1.354 5.5 1.23417 5.45317 1.1405 5.3595C1.04683 5.26583 1 5.146 1 5C1 4.854 1.04683 4.73417 1.1405 4.6405C1.23417 4.54683 1.354 4.5 1.5 4.5ZM1.703 5L5.8595 9.1405C5.95317 9.24483 6 9.36467 6 9.5C6 9.63533 5.9505 9.7525 5.8515 9.8515C5.7525 9.9505 5.63533 10 5.5 10C5.36467 10 5.24483 9.95317 5.1405 9.8595L0.6405 5.3595C0.546833 5.25517 0.5 5.13533 0.5 5C0.5 4.86467 0.546833 4.74483 0.6405 4.6405L5.1405 0.1405C5.24483 0.0468334 5.36467 0 5.5 0C5.63533 0 5.7525 0.0495 5.8515 0.1485C5.9505 0.2475 6 0.364667 6 0.5C6 0.635333 5.95317 0.755167 5.8595 0.8595L1.703 5Z"
              fill="#409eff"
            />
          </svg>
          Назад
        </PskLink>
        <i v-if="app_header_state.handleBack" class="AppHeader__line"></i>
        <span>{{ app_header_state.title }}</span>
      </div>

      <PskButton
        class="AppHeader__addBtn"
        :class="{ hidden: !app_header_state.btn?.handleClick }"
        @click="app_header_state.btn?.handleClick"
      >
        {{ app_header_state.btn?.label }}
      </PskButton>
    </div>
  </header>
</template>

<style lang="scss">
.AppHeader {
  width: 100%;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.AppHeader__line {
  width: 2px;
  height: 70%;
  background-color: #81818180;
}

.AppHeader__row {
  display: flex;
  justify-content: space-between;
}

.AppHeader__docLink {
  background-color: $c_body;
  padding: 4px 16px;
  border-radius: 4px;
  border: 1px solid $c_border_light;
  transition: transform 0.1s ease-in-out;

  &.hidden {
    transform: scale(0);
  }
}

.AppHeader__addBtn {
  transition: transform 0.1s ease-in-out;

  &.hidden {
    transform: scale(0);
  }
}

.AppHeader__title {
  @include setFontStyle1();

  display: flex;
  align-items: center;
  gap: 10px;
}

.AppHeader__linkBack {
  position: relative;
  top: 2px;
}
</style>
