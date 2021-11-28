<template>
  <div>
    <van-tabs v-model:active="active">
      <van-tab>
        <template #title> <router-link to="/home">发现</router-link> </template>
      </van-tab>
      <van-tab>
        <template #title> <router-link to="/community">云村</router-link> </template>
      </van-tab>
      <van-tab>
        <template #title> <router-link to="/search">搜索</router-link> </template>
      </van-tab>
      <van-tab>
        <template #title> <router-link to="/mine">我的</router-link> </template>
      </van-tab>
    </van-tabs>
    <router-view v-slot="{ Component }">
      <keep-alive exclude="Mine">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script>
import { getCurrentInstance, onUnmounted, reactive, ref, watch } from '@vue/runtime-core';
export default {
  name: 'Layout',
  setup () {
    let {proxy} = getCurrentInstance();
    let active = ref();
    //首次渲染根据路径来判断当前活跃的tab标签
    switch(proxy.$route.path){
      case '/mine': 
        active.value = 3;
        break;
      case '/search':
        active.value = 2;
        break;
      case '/community':
        active.value = 1;
        break;
      case '/home':
        active.value = 0;
        break;
    }
    //监听路由变化，
    watch(() => proxy.$route, () => {
      switch(proxy.$route.path){
        case '/mine': 
          active.value = 3;
          break;
        case '/search':
          active.value = 2;
          break;
        case '/community':
          active.value = 1;
          break;
        case '/home':
          active.value = 0;
          break;
      }
    })

    return {
      active,
    }
  },
};
</script>

<style scoped>
a{
  color: black;
}
</style>
