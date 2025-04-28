<template>
  <button>
    <slot></slot>
  </button>
</template>

<script>
export default {
  
}
</script>

<style scoped>
button {
  height: 45px;
  padding: 0 20px;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  font-weight: 300;
}
button:hover {
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}
</style>