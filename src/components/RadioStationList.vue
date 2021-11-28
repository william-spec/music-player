<template>
  <div class = 'DJcontainer' ref="a">
    <RadioStationItem v-for="item in data" :data='item' :key="item.id"/>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, onMounted } from '@vue/runtime-core';
import RadioStationItem from './RadioStationItem.vue'
export default {
  props: ['data'],
  setup(props){
    let data = reactive({});
    data = props.data;
    onMounted(() => {
      let {proxy} = getCurrentInstance();
      let container = proxy.$refs.a;
      
      container.addEventListener('scroll', () => {
        let pageHeight = container.scrollHeight
        let scrollTop = container.scrollTop;
        let clientHeight = container.clientHeight ;
        if(pageHeight === scrollTop + clientHeight){
          proxy.$emit('DJmore')
        }
      })
    })
    return {
      data
    }
  },
  components: {
    RadioStationItem,
  }
}
</script>

<style scoped>
  .DJcontainer{
    height: 250px;
    overflow-y: scroll;
  }
</style>