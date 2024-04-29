<script setup lang="ts">
import { useModalImageStore } from '@/stores/useModalImageStore'

const modal_image_store = useModalImageStore()
</script>

<template>
  <el-dialog class="ModalImage" v-model="modal_image_store.is_open" @closed="modal_image_store.closeModal">
    <div class="ModalImage__content">
      <img class="ModalImage__img" :src="modal_image_store.image_url" alt="" />
    </div>
  </el-dialog>
</template>

<style lang="scss">
.ModalImage {
  width: 90vw;
}

.ModalImage__content {
  width: 100%;
  height: 85vh;
}

.ModalImage__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
