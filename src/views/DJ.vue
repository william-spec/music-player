<template>
  <div>
    DJ
  </div>
</template>

<script>
import { getCurrentInstance, ref, onUnmounted } from '@vue/runtime-core'
export default {
  name: 'DJ',
  setup(){
    let {proxy} = getCurrentInstance();
    let id = ref('');
    id = proxy.$route.params.id;
  }
}
</script>

<style scoped>

</style>