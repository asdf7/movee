<template>
  <nav>
    <div class="left-side">
      <a href="/"><img src="@/images/movee-logo-cut.png"></a>
      <router-link to="/">Все фильмы</router-link>
      <router-link to="/playlists">Смотреть позже</router-link>
      <div>
        <input v-on:blur="hideResults" v-on:focus="showResults" v-on:input="search" v-model="searchQuery" type="search" placeholder="Поиск">
        <search-result v-if="searchQuery !== ''" :show="resultsVisible" :searchQuery="searchQuery" :results="results" class="search-result"/>
      </div>
    </div>
    <div class="right-side">
      <my-button v-if="!$store.state.isAuth" v-on:click="openDialog">Войти</my-button>
      <div v-else>
        <div v-on:click="toggleMenu" class="profile" id="click-ignore">
          <div class="profile-pic" id="click-ignore">
          </div>
        </div>
        <my-dropdown :show="menuVisible" class="dropdown-menu" id="click-ignore"></my-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
import myButton from '@/components/myButton.vue'
import myDropdown from '@/components/myDropdown.vue'
import SearchResult from '@/components/SearchResult.vue'
import axios from 'axios'

export default {
  components: {
    SearchResult, myDropdown,
    myButton
  },
  data() {
    return {
      searchQuery: '',
      results: [],
      resultsVisible: false,
      menuVisible: false
    }
  },
  methods: {
    openDialog() {
      this.$emit('openDialog')
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible
    },
    hideMenu() {
      this.menuVisible = false
    },
    showResults() {
      this.resultsVisible = true
    },
    hideResults() {
      setTimeout(() => {
        this.resultsVisible = false;
      }, 200);
    },
    async search() {
      try {
        const query = {
          searchQuery: this.searchQuery
        }
        const response = await axios.post('http://localhost:5000/auth/search', query)
        this.results = response.data.result
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    window.addEventListener('click', (event) => {
      if (event.target.id != 'click-ignore') {
        this.hideMenu()
      }
    })
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  background: transparent;
  backdrop-filter: blur(40px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20%;
}
nav a {
  text-decoration: none;
  color: white;
  margin-right: 40px;
}
nav input {
  height: 45px;
  min-width: 300px;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  font-weight: 300;
}
.search-result {
  margin-top: 10px;
  position: fixed;
}
.dropdown-menu {
  margin-top: 10px;
  position: fixed;
}
.profile {
  padding: 0 10px;
  height: 70px;
  display: flex;
  align-items: center;
}
.profile:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
}
.profile-pic {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 45px;
  height: 45px;
}
.left-side {
  display: flex;
  align-items: center;
}
.right-side {
  display: flex;
}
</style>