<template>
  <div v-if="show" class="menu">
    <div class="username">{{$store.state.userInfo.username}}</div>
    <hr>
    <div v-on:click="logout" class="option">Выйти</div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    logout() {
      if (store.state.isAuth) {
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        localStorage.removeItem('username')
        localStorage.removeItem('playlistID')
        store.commit('setUser', [])
        store.commit('setAuth', false)
        console.log('Вы вышли из аккаунта')
      } else {
        console.log('Вы не авторизованы')
      }
    }
  }
}
</script>

<style scoped>
.menu {
  background: #191919;
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
  border-radius: 5px;
  color: white;
}
.username {
  margin: 5px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.6;
}
.option {
  margin: 0 5px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}
.option:hover {
  background: rgba(255, 255, 255, 0.1);
}
hr {
  height: 1px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 5px;
}
</style>