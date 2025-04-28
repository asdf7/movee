import {createRouter, createWebHistory} from 'vue-router'
import Movies from '@/pages/Movies.vue'
import Movie from '@/pages/Movie.vue'
import Results from '@/pages/Results.vue'
import Playlists from '@/pages/Playlists.vue'
import Filter from '@/pages/Filter.vue'

const routes = [
    {
        path: '/',
        component: Movies
    },
    {
        path: '/movies/:_id',
        component: Movie
    },
    {
        path: '/results/:searchQuery',
        component: Results
    },
    {
        path: '/playlists',
        component: Playlists
    },
    {
        path: '/filter',
        component: Filter
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router