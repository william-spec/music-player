<template>
  <div class="container">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="phone"
          label="手机号"
          placeholder="请输入手机号"
        >
          <template #button>
            <van-button size="small" type="primary" @click="sendCode">发送验证码</van-button>
          </template>
        </van-field>
        <van-field
          v-model="sms"
          label="验证码"
          placeholder="请输入验证码"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          确定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/runtime-core';
import {
  sendIDCode,
  identifyIDCode
} from '../axios/request'
export default {
  setup(){
    const {proxy} = getCurrentInstance();
    const phone = ref('');
    const sms = ref('');
    const code = '';
    //接口挂掉，验证码登录方式失效
    let sendCode = () => {
      sendIDCode(phone.value).then(res => {
        
      })
    }
    let onSubmit = () => {
      identifyIDCode(phone.value, sms.value).then(res => {
        
      })
    }
    return {
      phone,
      sms,
      sendCode,
      onSubmit
    }
  }
}
</script>

<style>
  .container{
    padding: 10px 0;
  }
  .button{
    box-sizing: content-box;
    padding: 10px;
  }
</style>