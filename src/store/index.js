import { createStore } from 'vuex'
import {setItem, getItem, removeItem, clear} from '../utils/localStorage'

export default createStore({
  state: {
    User: {
      nickName: '未登录',
      vipType: -1,
      avatarUrl: '',
      token: ''
    }
  },
  mutations: {
    getUser(state){
        let res = getItem('user');
        if(res){
          for(let i in state.User)
            state.User[i] = res[i]
        }
    },
    setUser(state,obj){
      for(let i in state.User)
        state.User[i] = obj[i]
      setItem('user', state.User)
      console.log('set success', state.User);
    }
  },
  actions: {
  },
  modules: {
  }
})
