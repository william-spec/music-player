<template>
  <div>
    <van-search 
      v-model="input" 
      shape="round"
      background="#FFFFFF"
      :placeholder="placeholder" 
      @click="handleClick"
      @blur="handleBlur"
    />
    <div v-show="showSearchHot">
      <div class="search" v-for="(item, index) in hot" :key="index">{{item.first}}</div>
    </div>
    <div v-show="showSearchSuggest">
      <div class="search" v-for="(item, index) in searchSuggest" :key="index">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from '@vue/runtime-core'
import {getSearchHot, getSearchSuggest} from '../../axios/request'
import {debounce} from 'throttle-debounce'
export default {
  name: 'Search',
  setup(){
    let input = ref()
    let showSearchHot = ref(false)
    let showSearchSuggest = ref(false)
    let placeholder = ref()
    let hot = reactive([]);
    let searchSuggest = reactive([])
    let handleClick = () => {
      if(!input.value)
        showSearchHot.value = true;
    }
    let handleBlur = () => {
      if(!input.value)
        showSearchHot.value = false;
    }
    getSearchHot().then(res => {
      res.data.result.hots.forEach(i => {
        hot.push(i)
      })
      placeholder.value = hot[0].first;
    })
    watch(input, debounce(500, () => {
      if(!input.value){
        showSearchHot.value = true;
        return;
      }
      showSearchHot.value = false;
      getSearchSuggest(input.value).then(res => {
        searchSuggest.length = 0;
        if(res.data.result && res.data.result.songs){
          res.data.result.songs.forEach(i => {
            searchSuggest.push(i)
          })
          showSearchSuggest.value = true;
        }
      })
    }))
    return {
      input,
      showSearchHot,
      handleClick,
      handleBlur,
      placeholder,
      hot,
      searchSuggest,
      showSearchSuggest
    }
  }
}
</script>

<style scoped>
  .search{
    background-color: white;
    padding: 7px 0 7px 20px;
  }
</style>
