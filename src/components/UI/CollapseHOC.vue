<script lang="ts" setup>
import { ref } from 'vue'

/**
 * CollapseHOC - базовый компонент аккордеона (HOC - High Order Component)
 * @property class_name - название класса для своей стилизации
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @description - Визуально без каких-либо стилей.
 * Базовые стили предоставлены чисто под анимацию открытия/закрытия аккордеона.
 * При создании нужного по макету компонента аккордеона просто используешь данный компонент, в пропсе class_name
 * указываешь нужный для тебя класс и стилизуешь согласно макету уже без написания анимации открытия/закрытия.
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * При введенном пропсе class_name сразу будет сформирована структура классов, которую можно стилизовать:
 * <class_name> {Какие-то стили}
 * <class_name>__header {Какие-то стили}
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * Пример использования компонента:
 * <script>
 *
 * <template>
 *  <CollapseHOC class_name="Какой-то класс">
 *   <template #header="{is_open}"> is_open флаг открытия/закрытия для инициализации своих анимаций в контенте шапки
 *     Контент в шапке аккордеона
 *   </template>
 *
 *   <template #default>
 *    <div class="CollapseHOC__content">
 *      <slot />
 *    </div>
 *   </template>
 *  </CollapseHOC>
 * </template>
 *
 * <style>
 * ---------------------------------------------------------------------------------------------------------------------
 */
interface ICollapseHOCProps {
  class_name: string
}

defineProps<ICollapseHOCProps>()
const is_open = ref<boolean>(false)
</script>

<template>
  <div class="CollapseHOC" :class="class_name">
    <div @click="is_open = !is_open" class="CollapseHOC__header" :class="`${class_name}__header`">
      <slot name="header" :is_open="is_open" />
    </div>
    <div class="CollapseHOC__body" :class="{ is_open }">
      <div class="CollapseHOC__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.CollapseHOC__header {
  cursor: pointer;
  user-select: none;
}

.CollapseHOC__body {
  display: grid;
  grid-template-rows: 0fr;
  will-change: transition;
  transition: grid-template-rows 0.2s linear;
  overflow: hidden;
}

.CollapseHOC__body.is_open {
  grid-template-rows: 1fr;
}

.CollapseHOC__content {
  min-height: 0;
}
</style>
