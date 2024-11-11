<script setup lang="ts">
interface IFormLayoutProps {
  apply: (...args: any[]) => any
}

defineProps<IFormLayoutProps>()
</script>

<template>
  <form @submit.prevent="apply" class="FormLayout">
    <el-scrollbar>
      <div class="FormLayout__content">
        <slot ref="from" />
      </div>
    </el-scrollbar>

    <footer class="FormLayout__footer">
      <PskButton native_type="submit">Сохранить</PskButton>
    </footer>
  </form>
</template>

<style lang="scss">
.FormLayout {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $c_body;
  overflow: auto;
  @include hideScroll();

  .el-scrollbar__bar.is-vertical {
    right: 2px;
  }
}

.FormLayout__content {
  padding: 20px;
}

.FormLayout__footer {
  border-top: 1px solid $c_border_light;
  padding: 15px 20px;
}
</style>
