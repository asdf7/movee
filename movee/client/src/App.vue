<template>
  <div class="main-container">
    <my-notification v-if="$store.state.notificationVisible">{{ $store.state.notificationMessage }}</my-notification>
    <router-view></router-view>
  </div>
  <my-navbar v-on:openDialog="showDialog" class="navbar" />
  <my-dialog v-model:show="dialogVisible">
    <login-form :show="loginVisible" v-on:hide="hideDialog" v-on:redirect="toggleForm" />
    <registration-form :show="registrationVisible" v-on:hide="hideDialog" v-on:redirect="toggleForm" />
  </my-dialog>
</template>
  
<script>
import myNavbar from '@/components/myNavbar.vue'
import myDialog from '@/components/myDialog.vue'
import LoginForm from '@/components/LoginForm.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import myNotification from '@/components/myNotification.vue'
import store from '@/store'

export default
  {
    components:
    {
      myNavbar, myDialog, LoginForm,
      RegistrationForm, myNotification
    },
    data() {
      return {
        dialogVisible: false,
        loginVisible: true,
        registrationVisible: false,
        notificationVisible: false,
        message: ''
      }
    },
    methods:
    {
      checkAuth() {
        if (localStorage.getItem('token')) {
          store.commit('setAuth', true)
          const user = { userID: localStorage.getItem('userID'), username: localStorage.getItem('username') }
          store.commit('setUser', user)
        }
      },
      showDialog() {
        this.dialogVisible = true
      },
      hideDialog() {
        this.dialogVisible = false
      },
      toggleForm() {
        if (this.loginVisible) {
          this.loginVisible = false
          this.registrationVisible = true
        }
        else {
          this.loginVisible = true
          this.registrationVisible = false
        }
      }
    },
    mounted() {
      this.checkAuth()
    }
  }
</script>

<style>
html {
  overflow-y: scroll;
}
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  color: white;
  scrollbar-color: rgb(111, 111, 111) rgb(40, 40, 40);
}
.main-container {
  padding: 101px 20% 0 20%;
  width: 100%;
  min-height: 100vh;
  position: absolute;
  /* background-image: linear-gradient(45deg, #000000, #131313); */
  background: black;
}
.navbar {
  position: fixed;
  top: 0;
}
</style>