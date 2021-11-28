<template>
  <div>
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="songs">
      <musicItem v-for="item in data" :key="item.id" :data="item" :type="title" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from '@vue/runtime-core'
import musicItem from '../components/musicItem.vue'
import {
  getRecommendResource,
  getPersonalizedNewsong
} from '../axios/request'
export default {
  name: 'More',
  setup(){
    let {proxy} = getCurrentInstance();
    let data = reactive([])
    let title = ref('')
    title = proxy.$route.params.type;
    let getData = () => {
      if(data.length === 20 && title === '推荐歌单' || 
        data.length === 10 && title === '推荐歌曲'){
        proxy.$toast('已经掏空啦')
        return ;
      }
      let res;
      if(title === '推荐歌单')
        res = getRecommendResource();
      else if(title === '推荐歌曲')
        res = getPersonalizedNewsong()
      res.then(res => {
        const temp = res.data.recommend || res.data.result
        data.push(...temp)
      }, reason => {
        let {msg} = reason.response.data
        proxy.$dialog.confirm({
          title: msg,
          message: '',
        })
        .then(() => {
          proxy.$router.push('/login')
        })
      })
    }
    getData()
    let onClickLeft = () => {
      proxy.$router.push('/home');
    }
    onMounted(() => {
      let container = document.querySelector('.songs');
      container.addEventListener('scroll', () => {
        let container = document.querySelector('.songs');
        let pageHeight = container.scrollHeight
        let scrollTop = container.scrollTop;
        let clientHeight = container.clientHeight ;
        if(pageHeight === scrollTop + clientHeight){
          getData();
        }
      })
    })

    return {
      title,
      data,
      onClickLeft
    }
  },
  
  components: {
    musicItem
  }
}
</script>

<style lang='less' scoped>
  .songs{
    position: fixed;
    top: 6%;
    bottom: 0%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    overflow-y: scroll;
  }
  :deep(.van-nav-bar__title) {
    max-width: 50%;
  }
</style>