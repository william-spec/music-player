<template>
  <div>
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="songs">
      <musicItem v-for="item in recommendAlbums" :key="item.id" :data="item" :type="title" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from '@vue/runtime-core'
import musicItem from '../components/musicItem.vue'
import {getPlaylistDetail} from '../axios/request'
export default {
  name: 'Detail',
  setup(){
    let {proxy} = getCurrentInstance();
    let recommendAlbums = reactive([])
    let title = ref('')
    let getData = () => {
      if(recommendAlbums.length === 20){
        proxy.$toast('已经掏空啦')
        return ;
      }
      getPlaylistDetail(proxy.$route.params.id).then(res => {
        title.value = res.data.playlist.name
        let temp = res.data.playlist.tracks.map(item => {
          let author = '';
          if(Array.isArray(item.ar)){
            let t = item.ar.map(item=>item.name);
            author = t.join(', ');
          }
          return {
            id: item.al.id,
            name: item.al.name,
            picUrl: item.al.picUrl,
            copywriter: author
          }
        })
        recommendAlbums.push(...temp);
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
      recommendAlbums,
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
    padding-top: 8px;
  }
  :deep(.van-nav-bar__title) {
    max-width: 50%;
  }
</style>