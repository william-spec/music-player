<template>
  <div class="container">
    <password-login v-if="active === 0"/>
    <identifying-code-login v-else/>
    <div class="chose">
      <div v-if="active===0" @click='choseIdentifyCode'>短信验证码登录</div>
      <div v-else @click='chosePassword'>账号密码登录</div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/runtime-core';
import passwordLogin from '../components/passwordLogin.vue'
import identifyingCodeLogin from '../components/identifyingCodeLogin.vue'
export default {
  name: 'Login',
  setup(){
    let active = ref(0);
    let choseIdentifyCode = () => {
      active.value = 1;
    }
    let chosePassword = () => {
      active.value = 0;
    }
    return {
      active,
      choseIdentifyCode,
      chosePassword
    }
  },
  components: {
    passwordLogin,
    identifyingCodeLogin
  }
}
</script>

<style scoped>
  .chose{
    position: fixed;
    top: 90%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
