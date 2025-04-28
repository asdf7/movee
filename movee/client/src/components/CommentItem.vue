<template>
    <div class="comment-container">
        <div class="comment-top">
            <div class="top-left-container">
                <div class="comment-username">{{ comment.username }}</div>
                <div v-if="comment.userID === $store.state.userInfo.userID" v-on:click="$emit('remove', comment)" class="remove-button">Удалить</div>
            </div>
            <div class="comment-date">{{ comment.date }}</div>
        </div>
        <div class="comment-body">{{ comment.body }}</div>
        <div class="comment-bottom">
            <div v-on:click="like" :class="liked ? 'like-button-active' : 'like-button'">Like {{ likeCount }}</div>
            <div v-on:click="dislike" :class="disliked ? 'dislike-button-active' : 'dislike-button'">Dislike {{ dislikeCount }}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import store from '@/store'

export default {
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            rates: [],
            liked: false,
            disliked: false,
            likeCount: 0,
            dislikeCount: 0
        }
    },
    methods: {
        async fetchCommentRates() {
            try {
                const response = await axios.get(`http://localhost:5000/auth/comments/${this.comment._id}/rates`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                this.rates = response.data
                this.checkRates();
            } catch (error) {
                console.log(error)
            }
        },
        checkRates() {
            this.likeCount = [...this.rates].filter(r => r.status === 'like').length
            this.dislikeCount = [...this.rates].filter(r => r.status === 'dislike').length
            this.liked = false
            this.disliked = false
            for (let i = 0; i < this.rates.length; i++) {
                if (this.rates[i].userID) {
                    if (this.rates[i].status === 'like') {
                        this.liked = true
                    } else if (this.rates[i].status === 'dislike') {
                        this.disliked = true
                    }
                }
            }
        },
        async like() {
            try {
                const data = {
                    status: 'like'
                }
                const response = await axios.post(`http://localhost:5000/auth/comments/${this.comment._id}/like`, data, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                store.commit('notify', response.data.message)
                await this.fetchCommentRates()
                this.checkRates();
            } catch (e) {
                console.log(e)
            }
        },
        async dislike() {
            try {
                const data = {
                    status: 'dislike'
                }
                const response = await axios.post(`http://localhost:5000/auth/comments/${this.comment._id}/dislike`, data, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                store.commit('notify', response.data.message)
                await this.fetchCommentRates()
                this.checkRates();
            } catch (e) {
                console.log(e)
            }
        }
    },
    mounted() {
        this.fetchCommentRates()
    }
}
</script>

<style scoped>
.comment-container {
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    font-size: 14px;
    margin-bottom: 5px;
}
.comment-top,
.comment-bottom {
    display: flex;
}
.comment-top {
    justify-content: space-between;
    margin-bottom: 10px;
}
.comment-username {
    font-weight: 500;
    margin-right: 10px;
}
.comment-date {
    font-weight: 300;
    opacity: 0.6;
}
.comment-body {
    margin-bottom: 50px;
    font-weight: 300;
    opacity: 0.6;
}
.like-button, .dislike-button {
    opacity: 0.4;
    margin-right: 10px;
}
.like-button-active, .dislike-button-active {
    margin-right: 10px;
}
.like-button:hover, .dislike-button:hover {
    cursor: pointer;
}
.like-button-active, .dislike-button-active {
    cursor: pointer;
}
.top-left-container {
    display: flex;
}
.remove-button:hover {
    cursor: pointer;
}
</style>