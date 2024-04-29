<script setup lang="ts">
import { useAppStateStore } from '@/stores'

const app_state_store = useAppStateStore()
</script>

<template>
  <section class="AppErrors" v-if="app_state_store.error_list.length" @click.self="app_state_store.error_list = []">
    <div class="AppErrors__content">
      <h1 class="AppErrors__h1">Ошибка</h1>

      <div class="AppErrors__errors">
        <div class="AppErrors__errorItem" v-for="(error, error_idx) of app_state_store.error_list" :key="error_idx">
          <h2 class="AppErrors__errorItemTitle">{{ error.title }}</h2>
          <div class="AppErrors__errorItemDescription">
            <p class="AppErrors__errorItemDescriptionItem" v-for="(description, description_idx) of error.description" :key="description_idx">
              {{ description }}
            </p>
          </div>
        </div>
      </div>

      <PskButton class="AppErrors__PskButton" @click="app_state_store.error_list = []" size="large"> Ок </PskButton>
    </div>
  </section>
</template>

<style lang="scss">
.AppErrors {
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: $c_body_disable;

  display: flex;
  align-items: center;
  justify-content: center;
}

.AppErrors__content {
  @include hideScroll();
  max-height: 70vh;
  padding: 20px;
  max-width: 500px;
  min-width: 200px;
  overflow: auto;
  background-color: $c_body;
  border-radius: 5px;
}

.AppErrors__h1 {
  @include setFontStyle1();
  margin: 0 0 20px 0;
}

.AppErrors__errors {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.AppErrors__errorItemTitle {
  @include setFontStyle2();
  overflow-wrap: break-word;

  margin: 0 0 5px 0;
}

.AppErrors__errorItemDescription {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.AppErrors__errorItemDescriptionItem {
  @include setFontStyle3();
  overflow-wrap: break-word;

  position: relative;
  padding: 0 0 0 20px;

  &::after {
    content: '';
    position: absolute;
    top: 7px;
    left: 5px;
    display: block;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background: $c_danger;
  }
}

.AppErrors__PskButton {
  margin: 15px 0 0 0;
  float: right;
}
</style>
