<script setup lang="ts">
interface IPskTableTdNameProps {
  uid: string
  route: string
  name: string
}

defineProps<IPskTableTdNameProps>()
</script>

<template>
  <div class="PskTableTdName croppedText">
    <div class="PskTableTdName__uid">{{ uid }}</div>
    <PskLink :to="route" color="primary_dark">{{ name }}</PskLink>
  </div>
</template>

<style lang="scss">
.PskTableTdName__uid {
  @include setFontStyle8();
  color: $c_light;
}
</style>
