<template>
  <div v-if="show" class="login-container">
    <h1>Вход</h1>
    <div class="message">{{ message }}</div>
    <form v-on:submit.prevent>
      <input v-model="username" type="text" placeholder="Имя пользователя">
      <input v-model="password" type="password" placeholder="Пароль">
      <my-button v-on:click="login">Войти</my-button>
    </form>
    <div v-on:click="redirect" class="redirect-link">Еще нет аккаунта? <a href="#">Зарегистрируйтесь</a>.</div>
  </div>
</template>

<script>
import myButton from '@/components/myButton.vue'
import axios from 'axios'
import store from "@/store";

export default {
  components: {
    myButton
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      username: '',
      password: '',
      message: ''
    }
  },
  methods: {
    redirect() {
      this.$emit('redirect')
    },
    async login() {
      try {
        const user = {
          username: this.username,
          password: this.password
        }
        const response = await axios.post('http://localhost:5000/auth/login', user)
        console.log(response)
        store.commit('setAuth', true)
        store.commit('setUser', response.data.userData)
        localStorage.setItem('userID', response.data.userData.userID)
        localStorage.setItem('username', response.data.userData.username);
        localStorage.setItem('token', response.data.userData.token)
        this.$emit('hide')
      } catch (e) {
        console.log(e)
        this.message = e.response.data.message
      }
    }
  }
}
</script>

<style scoped>

.login-container h1 {
  margin-bottom: 30px;
}
.login-container form {
  display: flex;
  flex-direction: column;
}
.login-container form input {
  height: 45px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 14px;
  margin-bottom: 10px;
}
.login-container form button {
  margin-bottom: 20px;
}
.redirect-link {
  font-size: 14px;
}
.redirect-link a {
  text-decoration: none;
}
.message {
  color: red;
  margin-bottom: 10px;
  height:20px;
  font-size: 14px
}
</style>