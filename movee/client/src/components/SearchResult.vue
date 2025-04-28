<template>
  <div v-if="show" class="search-result-container">
    <div v-if="results.length > 0">
      <a v-on:click="$router.push(`/movies/${result._id}`)" v-for="result in results.slice(0, 5)" href="?">
        <img :src="result.img">
        <div>
          <div class="result-main-title">{{result.titleRu}}</div>
          <div class="result-secondary-title">{{result.imdb}} {{result.titleEn}}, {{result.year}}</div>
        </div>
      </a>
      <div v-on:click="this.$router.push(`/results/${searchQuery}`)" class="redirect-to-results">Показать все</div>
    </div>
    <div v-else>
      <div class="no-results">Ничего не найдено</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchQuery: {
      type: String,
      required: true
    },
    results: {
      type: Array,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.search-result-container {
  background: #191919;
  backdrop-filter: blur(40px);
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  width: 300px;
  border-radius: 5px;
}
.search-result-container a {
  text-decoration: none;
  color: white;
  margin: 0 5px;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
}
.search-result-container a:hover {
  background: rgba(255, 255, 255, 0.1);
}
.redirect-to-results {
  text-decoration: none;
  color: white;
  margin: 0 5px;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
}
.redirect-to-results:hover {
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.search-result-container a img {
  width: 60px;
  margin-right: 10px;
  border-radius: 5px;
}
.result-main-title {
  margin-bottom: 10px;
}
.result-secondary-title {
  font-size: 14px;
  font-weight: 200;
  opacity: 0.6;
}
.no-results {
  padding: 10px;
  opacity: 0.4;
}
</style>