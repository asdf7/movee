<template>
  <h3>{{ playlist.title }}</h3>
  <div class="playlist-container">
    <my-playlist-item v-for="item in items" v-on:remove="removeFromPlaylist" :item="item"></my-playlist-item>
  </div>
</template>

<script>
import myPlaylistItem from '@/components/myPlaylistItem.vue'
import store from '@/store'
import axios from 'axios'

export default {
  components: {
    myPlaylistItem
  },
  data() {
    return {
      items: []
    }
  },
  props: {
    playlist: {
      type: Object,
      required: true
    }
  },
  methods: {
    async getItems() {
      try {
        const response = await axios.get(`http://localhost:5000/auth/items/${localStorage.getItem('playlistID')}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        console.log(response.data)
        this.items = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async removeFromPlaylist(item) {
      try {
        const response = await axios.delete(`http://localhost:5000/auth/items/${item._id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        console.log(response.data)
        store.commit('notify', response.data.message)
        await this.getItems()
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.getItems()
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
.playlist-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 5px;
}
</style>