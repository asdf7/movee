import {createStore} from 'vuex'

export default createStore({
    state: {
        isAuth: false,
        userInfo: [],
        notificationVisible: false,
        notificationMessage: ''
    },
    mutations: {
        setAuth(state, bool) {
            state.isAuth = bool
        },
        setUser(state, user) {
            state.userInfo = user
        },
        notify(state, message) {
            state.notificationVisible = true
            state.notificationMessage = message
            setTimeout(() => state.notificationVisible = false, 2000)
        }
    }
})