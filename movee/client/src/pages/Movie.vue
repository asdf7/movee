<template>
  <div class="content">
    <div class="banner-container">
      <div class="cover-container">
        <img :src="movie.img" alt="">
      </div>
      <div class="banner-info-container">
        <div class="banner-info-top">
          <h1>{{ movie.titleRu }} ({{ movie.year }})</h1>
          <div class="banner-secondary-title">{{ movie.titleEn }} &#x2022 {{ movie.pg }} &#x2022 {{ movie.time }}</div>
          <div class="banner-description">{{ movie.description }}</div>
        </div>
        <div class="banner-info-bottom">
          <div class="rating-container">
            <div class="rating-imdb">
              <h1 :class="{'imdb-low': movie.imdb < 5, 'imdb-mid': movie.imdb >= 5 && movie.imdb < 7, 'imdb-high': movie.imdb >= 7}">{{movie.imdb}}</h1>
              <div>IMDb</div>
            </div>
            <div class="rating-kinopoisk">
              <h1>{{ movie.kinopoisk }}</h1>
              <div>KP</div>
            </div>
            <div class="user-rate">
              <select v-on:change="rateFilm" v-model="rate" id="select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
              <label for="select">Ваша оценка</label>
            </div>
          </div>
          <div class="banner-buttons">
            <my-button>Смотреть</my-button>
            <my-button v-on:click="addToPlaylist"><img src="@/images/watch-later-unchecked.png" alt="">Смотреть позже</my-button>
          </div>
        </div>
      </div>
    </div>
    <div class="movie-additional-info">
      <div class="trailer-container">
        <h3>Трейлер</h3>
        <video src="#" controls></video>
        <div>Трейлер (дублированный)</div>
      </div>
      <div class="about-movie-container">
        <h3>О фильме</h3>
        <div class="ul-container">
          <ul class="ul-1">
            <li>Режиссеры</li>
            <li>В ролях</li>
            <li>Страна</li>
            <li>Жанр</li>
            <li>Год производства</li>
            <li>Возраст</li>
            <li>Время</li>
          </ul>
          <ul>
            <li>{{movie.director}}</li>
            <li>{{movie.actors}}</li>
            <li>{{movie.country}}</li>
            <li>{{movie.genre}}</li>
            <li>{{movie.year}}</li>
            <li>{{movie.pg}}</li>
            <li>{{movie.time}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="player-container" id="player-container">
      <div class="player">
        <video src="#" controls></video>
      </div>
    </div>
    <comment-section></comment-section>
  </div>
</template>

<script>
import myButton from '@/components/myButton.vue'
import axios from 'axios'
import store from '@/store'
import CommentSection from '@/components/CommentSection.vue'

export default {
  components: {
    myButton,
    CommentSection,
    isInPlaylist: true
  },
  data() {
    return {
      movie: {},
      rate: '',
      RATE: ''
    }
  },
  methods: {
    async fetchMovie() {
      try {
        const response = await axios.get(`http://localhost:5000/auth/movies/${this.$route.params._id}`)
        this.movie = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async fetchRate() {
      try {
        const response = await axios.get(`http://localhost:5000/auth/rates/${this.$route.params._id}`, {
          headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
        this.rate = response.data.rate.value
      } catch (e) {
        console.log(e)
      }
    },
    async rateFilm() {
      try {
        const data = {
          rate: this.rate
        }
        const response = await axios.post(`http://localhost:5000/auth/rates/${this.$route.params._id}`, data, {
          headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
        store.commit('notify', response.data.message)
      } catch (e) {
        console.log(e)
      }
    },
    async addToPlaylist() {
      try {
        const data = {
          playlistID: localStorage.getItem('playlistID'),
          movieID: this.movie._id
        }
        const response = await axios.post('http://localhost:5000/auth/items', data, {
          headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
        console.log(response.data)
        store.commit('notify', response.data.message)
      } catch (e) {
        console.log(e)
      }
    },
  },
  mounted() {
    this.fetchMovie()
    this.fetchRate()
  }
}
</script>

<style scoped>
.banner-container {
  width: 100%;
  display: flex;
  margin-bottom: 30px;
}
.cover-container img {
  width: 280px;
  margin-right: 30px;
}
.banner-secondary-title {
  font-weight: 300;
  opacity: 0.8;
}
.banner-description {
  font-size: 14px;
  font-weight: 300;
  opacity: 0.8;
  width: 700px;
}
.banner-info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.banner-info-top div {
  margin-bottom: 10px;
}
.banner-info-top h1 {
  margin-bottom: 10px;
}
.rating-container {
  display: flex;
  margin-bottom: 30px;
}
.rating-imdb {
  margin-right: 60px;
}
.rating-kinopoisk {
  margin-right: 60px;
}
.rating-imdb, .rating-kinopoisk {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rating-imdb h1, .rating-kinopoisk h1 {
  margin-bottom: 5px;
}
.rating-imdb div, .rating-kinopoisk div {
  font-size: 13px;
}
.imdb-low {
  color: red;
}
.imdb-mid {
  color: white;
}
.imdb-high {
  color: seagreen;
}
.banner-buttons {
  display: flex;
}
.banner-buttons button {
  margin-right: 10px;
  margin-bottom: 5px;
}
.movie-additional-info {
  width: 100%;
  display: flex;
  margin-bottom: 30px;
}
.trailer-container {
  margin-right: 30px;
}
.trailer-container video {
  width: 300px;
  margin-bottom: 5px;
}
.trailer-container div {
  font-size: 14px;
  font-weight: 500;
}
.content h3 {
  margin-bottom: 20px;
}
.ul-container {
  display: flex;
  font-size: 13px;
}
.ul-container ul li {
  list-style: none;
  margin-bottom: 20px;
}
.ul-1 {
  opacity: 0.6;
  margin-right: 30px;
}
.player-container {
  margin-bottom: 50px;
}
.player video {
  width: 100%;
}
select option {
  color: white;
}
.user-rate {
  display: flex;
  flex-direction: column;
}
.user-rate label {
  font-size: 14px;
  font-weight: 400;
}
.user-rate select {
  height: 45px;
  padding: 0 10px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  font-size: 14px;
  color: white;
  margin-bottom: 10px;
}
.user-rate select option {
  color: black;
}
button img {
  margin-right: 10px;
}
</style>