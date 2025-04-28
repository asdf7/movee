<template>
  <playlist :playlist="playlist"></playlist>
</template>

<script>
import axios from 'axios'
import Playlist from '@/components/Playlist.vue'

export default {
  components: {
    Playlist
  },
  data() {
    return {
      playlist: {}
    }
  },
  methods: {
    async getPlaylists() {
      try {
        const response = await axios.get(`http://localhost:5000/auth/playlists/${localStorage.getItem('userID')}`, {
          headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
        console.log('Playlists: ', response.data)
        this.playlist = response.data
        localStorage.setItem('playlistID', response.data._id)
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.getPlaylists()
  }
}
</script>

<style scoped>

</style>