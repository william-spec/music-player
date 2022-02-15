# lyricsui使用

## 安装

```npm i lyricsui```

## 引入

```
import { createApp } from 'vue'

import Lyrics from 'lyricsui'
import 'lyricsui/style/lyricsUI.css'

createApp(App).use(Lyrics).mount('#app')
```

## 使用

```
<Lyrics :lyricsWords="lyricsWords" :lyricsTimes="lyricsTimes" :currentTime ="currentTime" @changeTime='changeTime'/>
```

## 参数传递

你需要为它传递三个参数

* lyricsWords：一个数组，存储歌词
* lyricsTimes：一个数组，存储歌词对应的时间
* currentTime：audio组件对应的时间

## 定义方法

你需要为它定义一个方法

* changeTime：一个函数，用来响应lyricsui组件传递出的点击事件，跳转到对应的时间

## example

```
<template>
  <div>
    <Lyrics :lyricsWords="lyricsWords" :lyricsTimes="lyricsTimes" :currentTime ="currentTime" @changeTime='changeTime'/>
    <audio controls ref="audio" :src="songDetail.url" ></audio>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onBeforeUnmount, reactive, ref } from '@vue/runtime-core'
export default {
  setup(){
    let {proxy} = getCurrentInstance();
    let lyricsWords = reactive(['作词：abc', '作曲：abc', '阳光', '河水']);
    let lyricsTimes = reactive([0.5, 1.5, 10, 100]);  //以秒为单位，与歌词一一对应
    let currentTime = ref(0)
    onMounted(() => {
      let audio = proxy.$refs.audio
      audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime;
      })
    })
    onBeforeUnmount(() => {
      let audio = proxy.$refs.audio
      audio.removeEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime;
      });
    })
    let changeTime = (newTime) => {
      let audio = proxy.$refs.audio;
      audio.currentTime = MinSecToSec(newTime)
    }
    return {
      currentTime,
      changeTime,
      lyricsTimes,
      lyricsWords
    }
  },
}
</script>

<style scoped>

</style>
```
