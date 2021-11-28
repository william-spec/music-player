<template>
  <div class="container">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名或手机号' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/runtime-core';
import {login} from '../axios/request'
import store  from '../store/index.js'
export default {
  setup(){
    const {proxy} = getCurrentInstance();
    const username = ref('');
    const password = ref('');
    const onSubmit = () => {
      login(username.value, password.value).then(res => {
        proxy.$toast('登录成功');
        proxy.$router.push('/home')
        console.log(res);
        let temp = {
          nickName: '',
          vipType: 0,
          avatarUrl: '',
          token: ''
        }
        temp.nickName = res.data.profile.nickname;
        temp.vipType = res.data.profile.vipType;
        temp.avatarUrl = res.data.profile.avatarUrl;
        temp.token = res.data.token
        console.log(temp);
        store.commit('setUser', temp)
      }, reason => {
        let {code} = reason.response.data
        let msg = '';
        switch(code){
          case 400:
            msg = '用户名或密码错误';
            break
        }
        proxy.$toast(msg);
      })
    };

    return {
      username,
      password,
      onSubmit,
    };
  }
}
</script>

<style scoped>
  .container{
    padding: 10px 0;
  }
</style>
