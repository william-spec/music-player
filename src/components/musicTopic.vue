<template>
  <div>
    <div class="fontContainer">
      <div class="left">{{title}}</div>
      <div class="right" @click="more">更多</div>
    </div>
    <div class="songs">
      <musicItem v-for="item in data" :key="item.id" :data="item" :type="title" />
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import musicItem from "./musicItem"
import { getCurrentInstance } from '@vue/runtime-core';
export default {
  props: ['data', 'title'],
  setup(props){
    let {proxy} = getCurrentInstance();
    let data = reactive([]);
    let title = props.title
    data = props.data;
    let more = () => {
      proxy.$router.push(`/more/${title}`)
    }
    return {
      data,
      title,
      more
    }
  },
  components: {
    musicItem
  }
}
</script>
  
<style scoped>
  .fontContainer{
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .left{
    padding-left: 10px;
    font-size: 20px;
  }
  .right{
    padding-right: 10px;
    font-size: 13px;
  }
  .songs{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
</style>