<template>
  <div class="lyricsContainer">
    <div class="center" v-show="touchmove" >
      <van-icon name="play" @click="changeTime"/>
      <div class="centerLine"></div>
      <div >{{touchMoveTime}}</div>
    </div>
    
    <div class='lyricsWordsContainer' ref="a">
      <p v-for="(value, index) in lyricsWords" :key="index" :class="{active: index === nIndex}" class="p">{{value}}</p>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUpdated, reactive, ref, watch } from '@vue/runtime-core'
import {getLyrics} from '../axios/request'
import {secToMinSec} from '../utils/timeFormat.js'
import {throttle} from 'throttle-debounce'
export default {
  props: ['id', 'currentTime'],
  setup(props){
    let {proxy} =getCurrentInstance();
    let lyrics = reactive({});
    let lyricsTimes = reactive([]);
    let lyricsWords = reactive([]);
    let lyricsTop = reactive([]);   //每句歌词对应的位置，第一句歌词从下标为1开始
    let lyricsTopComputedTimes = ref(0);
    let nIndex = ref();   //当前歌词索引
    let touchmove = ref(false);
    let touchMoveTime = ref()
    let touchMoveLyricsIndex = ref()   //滑动到的那句歌词的索引
    let timer = reactive([])    //存放计时器，touchend时延迟取消显示使用到计时器，如果此时又进行拖动，就需要取消计时器
    getLyrics(props.id).then(res => {
      let str = res.data.lrc.lyric;
      let t = str.split('\n');
      t.map(item => {
        let res = item.match(/^\[(.*)\:(.*)\.(.*)\](.*)/);
        if(res === null)return;
        let min = Number(res[1]);
        let sec = Number(res[2]);
        let ms = Number(res[3]);
        let words = res[4];
        if(words === '')return;
        res = min * 60 + sec + ms / 1000;
        lyrics[res] = words;
        lyricsWords.push(words)
        lyricsTimes.push(res);
      })
    })
    let getLyricsTop = () => {
      lyricsTopComputedTimes.value ++;
      let arr = document.querySelectorAll('.p');
      let preTop = getComputedStyle(proxy.$refs.a,null).top    //初始位置，位于容器中央
      let preTopN = Number(preTop.substring(0, preTop.length - 2))   //将当前距离顶部位置转换成数字 
      lyricsTop.push(preTop);    //下标为0的位置存储初始位置
      arr.forEach((i, index) => {
          let preP;   //前一句歌词
          let nowP = arr[index]     //获取本句歌词
          let prePHeight = 0;   //前一句歌词高度，默认为第一句歌词，所以没有前一句歌词，高度为0
          let nowPHeight =  parseInt(getComputedStyle(nowP,null).height);  //获取本句歌词高度
          let margin = parseInt(getComputedStyle(nowP,null).margin);   //歌词外边距，默认为第一句时只有一个外边距
          if(index !== 0){    //非第一句歌词
            preP = arr[index - 1];    //获取上一句歌词
            prePHeight =  parseInt(getComputedStyle(preP,null).height);  //获取上一句歌词高度
            margin = margin * 2;    //获取歌词外边距，如果有前一句歌词则为两倍外边距
          }
          let res = prePHeight / 2 + nowPHeight / 2 + margin    //计算移动距离
          let newTop = preTopN - res + 'px';    //操作DOM滚动歌词
          preTopN = Number(newTop.substring(0, newTop.length - 2));
          lyricsTop.push(newTop);
      })
    }
    watch(() => props.currentTime, (newValue, oldValue) => {
      if(newValue - oldValue > 2) return;  //如果是滑动跳转时间的（间隔大于2s）就停止监视这一次
      //监听时间，使歌词滚动
      //此处可以优化，  当前已经记录下了当前歌词的索引，下次只要判断当前索引的下一句即可，不用全部遍历
      lyricsTimes.forEach((i, index) => {
        if(i <= props.currentTime && lyricsTimes[index + 1]>props.currentTime){
          if(nIndex.value === index) return;    //如果该句歌词和上一句歌词一样则返回
          proxy.$refs.a.style.top = lyricsTop[index + 1];
          nIndex.value = index    //更新当前歌词索引
        }
      })
    })
    onMounted(() => {
      //歌词拖动
      proxy.$refs.a.addEventListener('touchmove', throttle(100, () => {   //使用节流节省性能
        console.log(proxy.$refs.a.style.top);
        if(timer.length !== 0){
          timer.forEach(i => {
            clearTimeout(i)
          })
          timer.length = 0;
        }
        touchmove.value = true
        let arr = document.querySelectorAll('.p');
        let lineY = document.querySelector('.centerLine').getBoundingClientRect().y;
        let pY = [];
        arr.forEach(p => { pY.push(p.getBoundingClientRect().y) })
        pY.forEach((p, index) => {
          if(pY[index] <= lineY && pY[index+1] > lineY){
            touchMoveTime.value = secToMinSec(lyricsTimes[index]);
            touchMoveLyricsIndex.value = index + 1;
            console.log(`滑动到${lyricsWords[index]},其位置为${lyricsTop[touchMoveLyricsIndex.value]}`);
          }
        })
      }));
      proxy.$refs.a.addEventListener('touchend', () => {
        timer.push(setTimeout(() => {
          touchmove.value = false
          timer.length = 0;
        }, 1000))
      });
    })
    onUpdated(() => {
      if(lyricsTopComputedTimes.value === 0)
        getLyricsTop();
    })
    let changeTime = () => {
      proxy.$emit('changeTime', touchMoveTime.value)
      touchmove.value = false;
      proxy.$refs.a.style.top = lyricsTop[touchMoveLyricsIndex.value]
      console.log(proxy.$refs.a.style.top);
    }
    return {
      lyrics,
      lyricsWords,
      nIndex,
      touchmove,
      touchMoveTime,
      changeTime
    }
  }
}
/* 
歌词滚动组件
  歌词滚动：
    1、监听audio元素上的timeupdate事件，实时获取当前时间
    2、v-for遍历歌词，歌词首次onUpdated的时候计算出每句歌词对应的Top滚动距离，放在数组中
    3、监听当前时间并与每句歌词对应的时间进行对比，使用JS操作DOM（top属性）进行滚动到对应歌词的位置
  歌词超出长度折行后导致歌词高度不同，如何计算高度：
    获取到当前句歌词和上一句歌词的DOM元素，获取他们的高度再操作DOM进行滚动（两个DOM元素高度的一半之和再加外边距）
  滑屏时显示播放按钮、横线和当前滑动到的歌词对应的时间
    1、在touchmove事件里控制横线的显示
    2、根据横线和每句歌词的相对位置（此处获取横线和每句歌词距离屏幕的y距离），
      如果某句歌词的y小于横线的y并且下一句歌词的y大于横线的y，那么就获取该句歌词对应的时间显示出来
    3、touchend时延迟取消显示，并将该计时器id保存下来，下次进入touchmove时取消未执行的计时器
  touchmove导致top定位失准
*/ 
</script>

<style scoped>
  .lyricsContainer{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  p{
    margin: 6px;
  }
  .lyricsWordsContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    transition: top 0.5s;
  }
  .active{
    color: red;
  }
  p{
    word-break: break-all;
    max-width: 250px;
    text-align: center;
  }
  .center{
    position: fixed;
    top: 365px;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    align-items: center;
  }
  .centerLine{
    width: 80%;
    margin: 0 10px;
    height: 1px;
    background-color: gray;
    opacity: 0.5;
    z-index: -1;
  }
</style>