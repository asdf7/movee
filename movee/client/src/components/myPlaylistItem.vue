<template>
  <div class="item">
    <img :src="movie.img">
    <div>
      <div v-on:click="$router.push(`/movies/${item.movieID}`)" class="item-main-title">{{ movie.titleRu }}</div>
      <div class="item-secondary-title">{{ movie.imdb }} {{ movie.titleEn }}, {{ movie.year }}</div>
      <div v-on:click="$emit('remove', item)" class="remove-button">Удалить</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      movie: {}
    }
  },
  methods: {
    async getMovie() {
      try {
        const response = await axios.get(`http://localhost:5000/auth/movies/${this.item.movieID}`);
        console.log(response.data)
        this.movie = response.data
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.getMovie()
  }
}
</script>

<style scoped>
.remove-button {
  width: fit-content;
  color: red;
  font-size: 14px;
  cursor: pointer;
}
.item {
  display: flex;
  border-radius: 5px;
  margin-bottom: 5px; 
}
.item:last-child {
  margin-bottom: 0;
}
.item img {
  width: 60px;
  margin-right: 10px;
  border-radius: 5px;
}
.item-main-title {
  margin-bottom: 10px;
}
.item-main-title {
  cursor: pointer;
}
.item-secondary-title {
  font-size: 14px;
  font-weight: 200;
  opacity: 0.6;
}
</style>