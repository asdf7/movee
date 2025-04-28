<template>
  <div class="content">
    <div class="header">
      <h3>Все фильмы</h3>
      <div class="filters-container">
        <select v-on:change="YEAR = $event.target.value" :class="{'active': YEAR != '', 'inactive': YEAR == ''}">
          <option disabled selected>Год</option>
          <option v-for="year in years" :value="year">{{ year }}</option>
        </select>
        <select v-on:change="RATE = $event.target.value" :class="{'active': RATE != '', 'inactive': RATE == ''}">
          <option disabled selected>Рейтинг</option>
          <option v-for="rate in rates" :value="rate">{{ rate }}</option>
        </select>
        <select v-on:change="GENRE = $event.target.value" :class="{'active': GENRE != '', 'inactive': GENRE == ''}">
          <option disabled selected>Жанр</option>
          <option v-for="genre in genres" :value="genre">{{ genre }}</option>
        </select>
      <div v-if="YEAR != '' || RATE != '' || GENRE != ''" v-on:click="clearFilters" class="clear-button">Очистить фильтры</div>
    </div>
  </div>
    <div class="movies-container">
      <div v-if="moviesByGenre.length != 0" v-for="movie in moviesByGenre" v-on:click="$router.push(`/movies/${movie._id}`)" class="movie-card-container">
        <div class="imdb-container" :class="{'imdb-low': movie.imdb < 5, 'imdb-mid': movie.imdb >= 5 && movie.imdb < 7, 'imdb-high': movie.imdb >= 7}">{{ movie.imdb }}</div>
        <div class="movie-card">
          <img :src="movie.img">
          <div class="title">{{ movie.titleRu }}</div>
          <div class="year">{{ movie.year }}</div>
        </div>
      </div>
      <div v-else>
        <div style="color: white">Ничего не найдено</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      movies: [],
      genres: ['Комедия', 'Мультфильм', 'Ужасы', 'Фантастика', 'Триллер', 'Боевик', 'Мелодрама', 'Драма', 'Детектив'],
      YEAR: '',
      RATE: '',
      GENRE: '',
    }
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get('http://localhost:5000/auth/movies')
        this.movies = response.data
      } catch (error) {
        console.log(error)
      }
    },
    clearFilters() {
      this.YEAR = ''
      this.RATE = ''
      this.GENRE = ''
    }
  },
  mounted() {
    this.fetchMovies()
  },
  computed: {
    years() {
      let years = []
      let j = 0
      for (let i = 1990; i <= 2024; i++) {
        years[j++] = i
      }
      return years
    },
    rates() {
      let rates = []
      let j = 0
      for (let i = 1; i <= 10; i++) {
        rates[j++] = i
      }
      return rates
    },
    moviesByYear() {
      return [...this.movies].filter(movie => movie.year.includes(this.YEAR))
    },
    moviesByRating() {
      return this.moviesByYear.filter(movie => movie.imdb >= this.RATE)
    },
    moviesByGenre() {
      return this.moviesByRating.filter(movie => movie.genre.toLowerCase().includes(this.GENRE.toLowerCase()))
    }
  }
}
</script>

<style scoped>
.content h3 {
  margin-right: 10px;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.movies-container {
  display: flex;
  flex-wrap: wrap;
}
.movie-card-container {
  width: 16.6%;
  margin-bottom: 30px;
}
.movie-card {
  margin-right: 10px;
  font-size: 15px;
}
.movie-card img {
  width: 100%;
  margin-bottom: 5px;
  cursor: pointer;
}
.movie-card .title {
  margin-bottom: 5px;
}
.movie-card .year {
  color: rgba(255, 255, 255, 0.4);
}
.imdb-container {
  padding: 3px;
  margin: 5px;
  position: absolute;
  font-size: 14px;
}
.imdb-low {
  background: red;
}
.imdb-mid {
  background: #222222;
}
.imdb-high {
  background: seagreen;
}
.filters-container {
  display: flex;
  align-items: center;
}
.inactive {
  height: 45px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 5px;
}
.active {
  height: 45px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.95);
  color: black;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 5px;
}
.filters-container select option {
  color: black;
}
.clear-button {
  margin-left: 5px;
  opacity: 0.6;
}
.clear-button:hover {
  cursor: pointer;
}
</style>