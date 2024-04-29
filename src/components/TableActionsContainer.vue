<template>
  <div class="TableActionsContainer">
    <slot />
  </div>
</template>

<style lang="scss">
.TableActionsContainer {
  display: flex;
  flex-wrap: nowrap;
  gap: 5px;
  align-items: center;
}
</style>
