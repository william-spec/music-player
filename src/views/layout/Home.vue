<template>
    <div class="homeContainer">
      <music-topic class='a' :title="songs.recommendAlbumTitle" :data = songs.recommendAlbum />
      <music-topic class='a' :title="songs.recommendSongsTitle" :data = songs.recommendSongs />
      <musicRadioStation 
        :title="songs.recommendRadioStationTitle" 
        :dataRS = songs.recommendRadioStation
        :dataP = songs.recommendProgram
        :dataPrivate= songs.personalizedPrivatecontent 
        @DJmore='DJmore' />
    </div>
</template>

<script>
import { getCurrentInstance, onUnmounted, reactive } from '@vue/runtime-core'
import musicTopic from "../../components/musicTopic.vue"
import musicRadioStation from '../../components/musicRadioStation.vue'
import {  getRecommendResource,
          getPersonalizedNewsong,
          getPersonalizedDjprogram,
          getProgramRecommend,
          getPersonalizedPrivatecontent
      } from '../../axios/request'
export default {
  name: 'Home',
  setup(){
    let songs = reactive({
      recommendAlbumTitle: '推荐歌单',
      recommendAlbum: [],
      recommendSongsTitle: '推荐歌曲',
      recommendSongs: [],
      recommendRadioStationTitle: '推荐电台',
      recommendRadioStation: [],
      recommendProgram: [],
      personalizedPrivatecontent: []
    })
    let  {proxy}  = getCurrentInstance();
    let homeGetRecommendResource = () => {
      getRecommendResource().then(res => {
        const temp = res.data.recommend.slice(0, 6)
        songs.recommendAlbum.push(...temp)
      }, reason => {
        let {msg} = reason.response.data
        proxy.$dialog.confirm({
          title: msg,
        })
        .then(() => {
          proxy.$router.push('/login')
        })
      })
    }
    let homeGetPersonalizedNewsong = () => {
      getPersonalizedNewsong().then(res => {
        const temp = res.data.result.slice(0, 6)
        songs.recommendSongs.push(...temp)
      })
    }
    let homeGetPersonalizedDjprogram = () => {
      if(songs.recommendRadioStation.length >= 10){
        proxy.$toast('已经掏空啦')
        return ;
      }
      getPersonalizedDjprogram().then(res => {
        const temp = res.data.result
        songs.recommendRadioStation.push(...temp)
      })
    }
    let homeGetProgramRecommend = () => {
      if(songs.recommendProgram.length >= 20){
        proxy.$toast('已经掏空啦')
        return ;
      }
      getProgramRecommend().then(res => {
        const temp = res.data.programs
        songs.recommendProgram.push(...temp)
      })
    }
    let homeGetPrivatecontent = () => {
      if(songs.personalizedPrivatecontent.length >= 10){
        proxy.$toast('已经掏空啦')
        return ;
      }
      getPersonalizedPrivatecontent().then(res => {
        const temp = res.data.result
        songs.personalizedPrivatecontent.push(...temp)
      })
    }
    homeGetRecommendResource();
    homeGetPersonalizedNewsong();
    homeGetPersonalizedDjprogram();
    homeGetProgramRecommend();
    homeGetPrivatecontent();
    let DJmore = (active) => {
      switch(active){
        case 0:
          homeGetPersonalizedDjprogram();
          break;
        case 1:
          homeGetProgramRecommend();
          break;
        case 2:
          homeGetPrivatecontent();
          break;
      }
    }
    return {
      songs,
      DJmore
    }
  },
  components: {
    musicTopic,
    musicRadioStation
  }
}
</script>

<style scoped>
  .a{
    margin-bottom: 20px;
  }
  .homeContainer{
    position: fixed;
    top: 6%;
    bottom: 0%;
    overflow-y: scroll;
  }
</style>
