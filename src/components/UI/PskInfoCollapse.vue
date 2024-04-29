<script setup lang="ts">
defineProps<{ title: string; type?: 'error' | 'warning' }>()
</script>

<template>
  <CollapseHOC class_name="PskInfoCollapse">
    <template #header="{ is_open }">
      <p class="PskInfoCollapse__title" :class="type">{{ title }}</p>
      <svg
        class="PskInfoCollapse__arrow"
        :class="{ is_open }"
        width="14"
        height="13"
        viewBox="0 0 14 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4237 4.49638L7.13092 8.15263L2.83814 4.49638C2.75772 4.42613 2.66385 4.391 2.55653 4.391C2.44921 4.391 2.35534 4.42613 2.27492 4.49638C2.19451 4.56663 2.1543 4.64863 2.1543 4.74238C2.1543 4.83613 2.19007 4.91425 2.26162 4.97675L6.836 8.86738C6.91642 8.93763 7.01487 8.97275 7.13135 8.97275C7.24783 8.97275 7.34627 8.93763 7.42669 8.86738L12.0011 4.98838C12.0726 4.91813 12.1084 4.83413 12.1084 4.73638C12.1084 4.63863 12.0682 4.55663 11.9878 4.49038C11.9074 4.42413 11.8135 4.39088 11.7062 4.39063C11.5988 4.39038 11.505 4.4255 11.4246 4.496L11.4237 4.49638Z"
          fill="#C0C4CC"
        />
      </svg>
    </template>

    <template #default>
      <div class="PskInfoCollapse__contentContainer">
        <slot />
      </div>
    </template>
  </CollapseHOC>
</template>

<style lang="scss">
.PskInfoCollapse {
  border-width: 1px 0;
  border-style: solid;
  border-color: #dcdfe6;
  margin-bottom: 30px;
  transition: border 0.2s ease-in-out;

  svg path {
    transition: fill 0.2s ease-in-out;
  }
}

.PskInfoCollapse__contentContainer {
  padding: 0 12px 14px 12px;
}

.PskInfoCollapse__title {
  transition: color 0.2s ease-in-out;
}

.PskInfoCollapse__header {
  padding: 12px 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.PskInfoCollapse__arrow {
  will-change: transition;
  transition: transform 0.2s ease-in-out;
  transform: rotate(-90deg);
}

.PskInfoCollapse__title.error {
  color: #f56c6c;
}

.PskInfoCollapse__title.warning {
  color: #e6a23c;
}

.PskInfoCollapse__arrow.is_open {
  transform: rotate(0);
}
</style>
