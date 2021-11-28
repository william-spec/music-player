<template>
  <div class="container">
    <div class="fontContainer">
      <div class="left">{{title}}</div>
    </div>
    <van-tabs v-model:active="data.active" ref="tabs">
      <van-tab title="电台">
        <RadioStationList @DJmore='DJmore' :data='data.dataRS' />
      </van-tab>
      <van-tab title="节目">
        <RadioStationList @DJmore='DJmore' :data='data.dataP' />
      </van-tab>
      <van-tab title="独家放送">
        <RadioStationList @DJmore='DJmore' :data='data.dataPrivate' />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import RadioStationList from './RadioStationList.vue'
import { getCurrentInstance, onMounted, onUpdated, reactive, watch } from '@vue/runtime-core';
export default {
  props: ['dataRS', 'title', 'dataP', 'dataPrivate'],
  setup(props){
    let {proxy} = getCurrentInstance();
    let data = reactive({
      title: props.title,
      dataRS: props.dataRS,
      dataP: props.dataP,
      dataPrivate: props.dataPrivate,
      active: 0
    })
    watch(data, () => {
      proxy.$refs.tabs.resize();
    })
    let DJmore = () => {
      proxy.$emit('DJmore', data.active)
    }
    return {
      data,
      DJmore
    }
  },
  components: {
    RadioStationList
  }
}
</script>

<style scoped>
  .container{
    background-color: white;
  }
  .fontContainer{
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .left{
    padding-left: 10px;
    font-size: 20px;
  }
</style>