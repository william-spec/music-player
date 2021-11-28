<template>
  <div class="outterContainer">
    <div class="container" @click="jump">
      <img class="image" :src="data.picUrl" />
      <div class="name" >{{data.name}}</div>
      <div class="author" >{{data.copywriter || data.song.artists[0].name}}</div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { getCurrentInstance } from '@vue/runtime-core';
export default {
  props: ['data', 'type'],
  setup(props){
    let {proxy} = getCurrentInstance();
    let data = reactive({});
    data = props.data;
    let jump = () => {
      if(props.type === '推荐歌单')
        proxy.$router.push(`/detail/${data.id}`)
      else if(props.type === '推荐歌曲')
        proxy.$router.push(`/player/${data.id}`)
    }
    return {
      data,
      jump
    }
  }
}
</script>

<style scoped>
  .outterContainer{
    background-color: #F7F8FA;
  }
  .container{
    width: 120px;
    height: 160px;
    padding: 2px;
  }
  .image{
    width: 120px;
    height: 120px;
    border-radius: 15px;
  }
  .name{
    font-size: 15px;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
  }
  .author{
    font-size: 10px;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
  }
</style>