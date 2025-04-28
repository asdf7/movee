<template>
    <div class="content">
        <h2>Новинки</h2>
        <div class="filters-container">
            <select v-on:change="YEAR = $event.target.value">
                <option disabled selected>Год</option>
                <option v-for="year in years" :value="year">{{ year }}</option>
            </select>
            <select v-on:change="RATE = $event.target.value">
                <option disabled selected>Рейтинг</option>
                <option v-for="rate in rates" :value="rate">{{ rate }}</option>
            </select>
            <select v-on:change="GENRE = $event.target.value">
                <option disabled selected>Жанр</option>
                <option v-for="genre in genres" :value="genre">{{ genre }}</option>
            </select>
            <div v-if="YEAR != '' || RATE != '' || GENRE != ''"  v-on:click="clearFilters" class="clear-button">Clear</div>
        </div>
        <div class="movies-container">
            <div v-for="movie in moviesByGenre" class="movie-card-container">
                <div class="imdb-container">{{ movie.imdb }}</div>
                <div class="movie-card">
                    <img :src="movie.img">
                    <div class="title">{{ movie.titleRu }}</div>
                    <div class="year">{{ movie.year }}</div>
                </div>
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
            genres: ['Комедия', 'Мультфильм', 'Ужасы', 'Фантастика', 'Триллер', 'Боевик', 'Мелодрама', 'Детектив'],
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
.content h2 {
  margin-bottom: 30px;
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
  padding: 2px;
  margin: 5px;
  background: #0f0f0f;
  position: absolute;
}
.filters-container {
    margin-bottom: 30px;
}
.filters-container select {
    background: none;
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    font-size: 14px;
    margin-right: 5px;
}
.filters-container select option {
    color: black;
}
</style>