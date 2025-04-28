<template>
    <h3>Оставить комментарий</h3>
    <form v-on:submit.prevent>
        <textarea v-model="body" placeholder="Комментарий"></textarea>
        <my-button v-on:click="addComment">Отправить</my-button>
        <div class="comments-container">
            <h3>Комментарии</h3>
            <comment-item v-if="comments.length > 0" v-for="comment in comments" v-on:remove="removeComment" :comment="comment"></comment-item>
        </div>
    </form>
</template>

<script>
import myButton from '@/components/myButton.vue'
import CommentItem from '@/components/CommentItem.vue'
import axios from 'axios'
import store from '@/store'

export default {
    components: {
        myButton, CommentItem
    },
    data() {
        return {
            comments: [],
            body: ''
        }
    },
    methods: {
        async fetchComments() {
            try {
                const response = await axios.get(`http://localhost:5000/auth/comments/${this.$route.params._id}`)
                this.comments = response.data
                this.comments.reverse()
                this.body = ''
            } catch (error) {
                console.log(error)
            }
        },
        async addComment() {
            try {
                const comment = {
                    username: localStorage.getItem('username'),
                    body: this.body,
                    date: new Date().toLocaleDateString("ru-ru", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })
                }
                const response = await axios.post(`http://localhost:5000/auth/comments/${this.$route.params._id}`, comment, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                await this.fetchComments()
                store.commit('notify', response.data.message)
            } catch (e) {
                console.log(e)
            }
        },
        async removeComment(comment) {
            try {
                const response = await axios.delete(`http://localhost:5000/auth/comments/${comment._id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                store.commit('notify', response.data.message)
                await this.fetchComments()
            } catch (e) {
                console.log(e)
            }
        }
    },
    mounted() {
        this.fetchComments()
    }
}
</script>

<style scoped>
h3 {
    margin-bottom: 20px;
}
form {
    display: flex;
    flex-direction: column;
}
form textarea {
    resize: none;
    height: 135px;
    padding: 15px;
    margin-bottom: 5px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 5px;
    font-size: 14px;
}
button {
    align-self: flex-end;
}
</style>