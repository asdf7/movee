<template>
  <div v-if="show" v-on:click="hideDialog" class="dialog-background">
    <div v-on:click.stop class="dialog-container">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      require: true
    }
  },
  methods: {
    hideDialog() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped>
.dialog-background {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
}
.dialog-container {
  background: #191919;
  min-width: 300px;
  width: fit-content;
  height: fit-content;
  padding: 10px;
  margin: auto;
  border-radius: 5px;
}
</style>