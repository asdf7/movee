<template>
  <h3>Результаты поиска по запросу: <span class="search-query">{{ this.$route.params.searchQuery }}</span></h3>
  <div v-for="result in results" class="result">
    <img :src="result.img">
    <div>
      <div v-on:click="$router.push(`/movies/${result._id}`)" class="result-main-title">{{ result.titleRu }}</div>
      <div class="result-secondary-title">{{ result.imdb }} {{ result.titleEn }}, {{ result.year }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      results: []
    }
  },
  methods: {
    async search() {
      try {
        const search = this.$route.params.searchQuery
        const query = {
          searchQuery: search
        }
        const response = await axios.post('http://localhost:5000/auth/search', query)
        this.results = response.data.result
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.search()
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
.search-query {
  opacity: 0.4;
}
.result {
  padding: 5px;
  display: flex;
}
.result img {
  width: 80px;
  margin-right: 10px;
  border-radius: 5px;
}
.result-main-title {
  margin-bottom: 10px;
}
.result-main-title:hover {
  cursor: pointer;
}
.result-main-title {
  font-size: 18px;
}
.result-secondary-title {
  font-weight: 300;
  opacity: 0.6;
}</style>