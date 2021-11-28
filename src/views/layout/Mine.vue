<template>
  <div>
    <div class="profile" @click="jump">
      <img class="profileImg" :src="avatarUrl" alt="avatar" v-show="isLogin">
      <div class="fontContainer">
        <div class="nameFont">{{nickName}}</div>
        <div class="vipFont" v-show="isLogin">{{vipType === 0 ? '非会员' : 'vip'}}</div>
      </div>
      <van-icon name="arrow" class="arrow"/>
    </div>
    <div class="vanGridContainer">
      <van-grid :border="false">
        <van-grid-item icon="play-circle" text="最近播放" />
        <van-grid-item icon="star" text="收藏和赞" />
        <van-grid-item icon="friends" text="我的好友" />
        <van-grid-item icon="music" text="本地音乐" />
        <van-grid-item icon="back-top" text="上传云盘" />
        <van-grid-item icon="balance-o" text="已购" />
        <van-grid-item icon="photo" text="文字" />
        <van-grid-item icon="photo" text="文字" />
      </van-grid>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref } from '@vue/runtime-core'
export default {
  name: 'Mine',
  setup(){
    let {proxy} = getCurrentInstance()
    let isLogin = ref(false);
    let avatarUrl = computed(() => proxy.$store.state.User.avatarUrl)
    let nickName = computed(() => proxy.$store.state.User.nickName)
    let vipType = computed(() => proxy.$store.state.User.vipType)
    let token = computed(() => proxy.$store.state.User.token)
    if(token.value === '')  //如果vuex中的user数据失效那么就从storage中获取
      proxy.$store.commit('getUser')
    if(token.value !== '')  //如果storage中存在数据，那么就复制给vuex，
      isLogin.value = true; //由于是计算属性，会根据vuex的改变而改变，此时已经获取到User，那么就改变isLogin的状态
    let jump = () => {
      proxy.$router.push('/mine/detail')
    }
    return {
      avatarUrl,
      nickName,
      vipType,
      isLogin,
      jump
    }
  }
}
</script>

<style scoped>
  .profile{
    height: 60px;
  }
  .profile{
    display: flex;
    align-items: center;
  }
  .profileImg{
    margin: 0 0 0 20px;
    width: 40px;
    height: 40px;
    border: 3px solid white;
    border-radius: 23px;
  }
  .nameFont{
    margin-left: 10px;
  }
  .fontContainer{
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .vanGridContainer{
    border-radius: 15px;
    overflow: hidden;
  }
  .vanGridContainer :deep(.van-icon){
    color: red;
  }
  .vipFont{
    margin-left: 10px;
    font-size: 10px;
  }
  .arrow{
    margin-right: 10px;
    margin-left: auto;
  }
</style>