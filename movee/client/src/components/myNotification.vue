<template>
  <div class="notification-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
.notification-container {
  background: rgba(255, 255, 255, 0.1);
  width: fit-content;
  min-width: 200px;
  backdrop-filter: blur(40px);
  padding: 0 10px;
  height: 45px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 300;
  position: fixed;
  bottom: 10px;
  left: 10px;
  justify-content: space-between;
}
</style>