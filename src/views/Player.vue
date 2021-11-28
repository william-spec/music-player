<template>
  <div class="container">
    <van-nav-bar
      class="navBar"
      title="播放歌曲"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="innerContainer">
      <img :src="songDetail.img" alt="歌曲封面">
      <p class="name">{{songDetail.name}}</p>
      <p>{{songDetail.author}}</p>
      <div class="lyrics">
        <lyrics :id="songDetail.id" :currentTime ="currentTime" @changeTime='changeTime'/>
      </div>
    </div>
    <audio controls ref="audio" :src="songDetail.url" ></audio>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onBeforeUnmount, reactive, ref } from '@vue/runtime-core'
import lyrics from '../components/lyrics.vue'
import { getSongUrl,
         getSongDetail
        } from '../axios/request'
import {MinSecToSec} from '../utils/timeFormat.js'
export default {
  name: 'Player',
  setup(){
    let {proxy} = getCurrentInstance();
    let songDetail = reactive({
      id: proxy.$route.params.id,
      url: '',
      img: '',
      name: '',
      author: ''
    })
    getSongUrl(songDetail.id).then(res => {
      songDetail.url = res.data.data[0].url
    })
    getSongDetail(songDetail.id).then(res => {
      songDetail.img = res.data.songs[0].al.picUrl;
      songDetail.name = res.data.songs[0].name;
      songDetail.author = res.data.songs[0].ar[0].name;
    })
    let onClickLeft = () => {
      proxy.$router.back();
    }

    let currentTime = ref(0)
    onMounted(() => {
      let audio = proxy.$refs.audio
      audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime;
      })
    })
    
    onBeforeUnmount(() => {
      let audio = proxy.$refs.audio
      audio.removeEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime;
      });
    })
   
    let changeTime = (newTime) => {
      let audio = proxy.$refs.audio;
      audio.currentTime = MinSecToSec(newTime)
    }
    return {
      songDetail,
      currentTime,
      onClickLeft,
      changeTime
    }
  },
  components: {
    lyrics
  }
}
</script>

<style scoped>
  .navBar{
    opacity: 1;
  }
  .container{
    width: 100%;
    height: 667px;
    background-image: linear-gradient(rgba(232,245,200, 0.5), rgba(159,165,213, 0.3));
  }
  audio{
    position: fixed;
    top: 85%;
    left: 50%;
    transform: translate(-50%);
  }
  p{
    color: black;
    margin: 5px;
    font-size: 13px;
  }
  .name{
    font-size: 20px;
  }
  img{
    width: 200px;
    height: 200px;
    margin-bottom: 15px;
  }
  .innerContainer{
    position: fixed;
    top: 13%;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .lyrics{
    width: 340px;
    height: 130px;
    background-color: white;
    opacity: 0.5;
    margin-top: 20px;
    border-radius: 70px;
  }
</style>