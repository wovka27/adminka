<template>
  <div class="PskLoader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss">
.PskLoader {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.PskLoader div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid $c_primary;
  border-radius: 50%;
  animation: PskLoader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $c_primary transparent transparent transparent;
}

.PskLoader div:nth-child(1) {
  animation-delay: -0.45s;
}

.PskLoader div:nth-child(2) {
  animation-delay: -0.2s;
}

.PskLoader div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes PskLoader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
