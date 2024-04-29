<script setup lang="ts">
import { useModalConfirmStore } from '@/stores'

const modal_confirm_store = useModalConfirmStore()
</script>

<template>
  <Teleport to="body">
    <el-dialog class="ModalConfirm" v-model="modal_confirm_store.is_open_modal">
      <div class="ModalConfirm__title">{{ modal_confirm_store.title_text || 'Удалить' }}</div>
      <div class="ModalConfirm-actions">
        <el-button class="ModalConfirm-btn" size="large" type="primary" @click="modal_confirm_store.handle">
          ДА
        </el-button>
        <el-button size="large" @click="modal_confirm_store.closeModal">НЕТ</el-button>
      </div>
    </el-dialog>
  </Teleport>
</template>

<style lang="scss">
.ModalConfirm {
  border-radius: 4px;
  max-width: 362px;
  box-shadow:
    0 0 8px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 4px 16px 2px rgba(0, 0, 0, 0.02);

  .el-button--primary span {
    color: #fff;
  }
}

.ModalConfirm__title {
  text-align: center;
  font-weight: 700;
  font-size: 22px;
}

.ModalConfirm-actions {
  display: flex;
  justify-content: center;
  margin: 40px 0 20px 0;

  span {
    font-weight: 700;
  }
}
</style>
