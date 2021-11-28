<template>
  <div class="outterContainer" @click="jump">
    <div class="container" >
      <img class="image"  :src="data.picUrl || data.coverUrl" />
      <div class="fontContainer">
        <div class="name" >{{data.name}}</div>
        <div class="author" >{{data.copywriter || data.description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { getCurrentInstance } from '@vue/runtime-core';
export default {
  props: ['data'],
  setup(props){
    let {proxy} = getCurrentInstance();
    let data = reactive({});
    data = props.data;
    let jump = () => {
      proxy.$router.push(`/DJ/${data.id}`)
      //未设置页面
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
    height: 60px;
    padding: 5px;
    display: flex;
  }
  .fontContainer{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .name{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient: vertical;
    font-size: 14px;
    margin-top: 2px;
  }
  .author{
    font-size: 10px;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:1;
    -webkit-box-orient: vertical;
  }
  .image{
    width: 60px;
    height: 60px;
    margin-right: 5px;
    border-radius: 13px;
  }
</style>