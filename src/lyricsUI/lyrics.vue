<template>
  <div class="lyrics">
    <div class="lyricsContainer" ref="a">
      <div class="center" v-show="touchmove" >
        <van-icon name="play" class="name" @click="changeTime"/>
        <div class="centerLine"></div>
        <div class="time">{{touchMoveTime}}</div>
      </div>
      <div class="blank"></div>
      <!-- <p v-for="(value, index) in [1, 2, 3]" :key="index">{{value}}</p> -->
      <p v-for="(value, index) in lyricsWords" :key="index" :class="{active: index === nIndex}" class="p">{{value}}</p>
      <div class="blank"></div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUpdated, reactive, ref, watch } from 'vue'
import {secToMinSec} from '../utils/timeFormat.js'
export default {
  name: 'Lyrics',
  props: ['lyricsTimes', 'currentTime', 'lyricsWords'],
  setup(props, context){
    let a = ref();
    let lyricsTimes = props.lyricsTimes;   //只保存时间
    let lyricsWords = props.lyricsWords;   //只保存歌词
    let lyricsTop = reactive([]);   //每句歌词对应的位置，第一句歌词从下标为1开始
    let lyricsTopComputedTimes = ref(0);  //表示歌词位置的计算次数，只需要计算一次
    let nIndex = ref();   //当前歌词索引
    let touchmove = ref(false);   //表示是否处于滑动状态
    let touchMoveTime = ref()   //滑动位置所对应的时间
    let touchMoveLyricsIndex = ref()   //滑动到的那句歌词的索引
    let timer = reactive([])    //存放计时器，touchend时延迟取消显示使用到计时器，如果此时又进行拖动，就需要取消计时器
    
    //计算歌词高度，滚动距离由当前句歌词和上一句歌词的高度决定
    let getLyricsScrollTop = () => {
      lyricsTopComputedTimes.value ++;  //记录歌词位置的计算次数，只需要计算一次即可，否则onUpdated中会重复计算
      let arr = document.querySelectorAll('.p');
      let preScrollTop = 0    //初始位置，滚动高度为0
      lyricsTop.push(preScrollTop);    //下标为0的位置存储初始位置
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
          let newScrollTop = preScrollTop + res;    //操作DOM滚动歌词
          lyricsTop.push(newScrollTop);
          preScrollTop = newScrollTop;
      })
    }
    watch([() => props.currentTime, touchmove], () => {
      if(touchmove.value) return;   //如果在播放时进行滑动，那么暂停对时间的监视；如果是停止滑动，那么回到当前歌词所在位置
      //监听时间，使歌词滚动
      //此处可以优化，  当前已经记录下了当前歌词的索引，下次只要判断当前索引的下一句即可，不用全部遍历
      lyricsTimes.forEach((i, index) => {
        if(i <= props.currentTime && (lyricsTimes[index + 1]>props.currentTime || index + 1 === lyricsTimes.length /* 如果是最后一句歌词 */)){
          // if(nIndex.value === index) return;    //如果该句歌词和上一句歌词一样则返回，但是会产生如果是暂停情况下，nIndex始终等于index从而无法回到原位置
          a.value.scrollTop = lyricsTop[index + 1];   //lyricsTop第一项为初始位置，从1开始才是歌词对应的位置，所以要加1
          nIndex.value = index    //更新当前歌词索引
        }
      })
    })
    onMounted(() => {
      //歌词拖动
      a.value.addEventListener('touchmove', () => {   //此处不能使用节流节省性能，因为如果用户最后是快速放开触发了惯性滚动的话，
                                                            //由于touchmove事件在最后触发，又因为节流产生延迟，所以会出现手指放开touchend事件发生后再触发touchmove事件，清除定时器从而出现问题
                                                            //而如果是最后没有触发惯性滚动，因为手指在离开屏幕前一段时间内就已经停止了touchmove，所以不会产生touchmove延时触发的现象
                                                            //说到底是手指最后触发touchmove和touchend的时间间隔是否大于了节流的时间，若小于就会出现该问题
        //如果拖动时存在未执行的定时器，那么清除他们
        if(timer.length !== 0){
          timer.forEach(i => {
            clearTimeout(i)
          })
          timer.length = 0;
        }
        touchmove.value = true
        //计算当前scrollTop对应的歌词
        let arr = document.querySelectorAll('.p');
        let lineY = document.querySelector('.centerLine').getBoundingClientRect().y;
        let pY = [];
        arr.forEach(p => { pY.push(p.getBoundingClientRect().y) })
        pY.forEach((p, index) => {
          if(pY[index] <= lineY && pY[index+1] > lineY){
            touchMoveTime.value = secToMinSec(lyricsTimes[index]);
            touchMoveLyricsIndex.value = index + 1;
          }
        })
      });
      //滑动事件结束时，启动定时器延时隐藏元素
      a.value.addEventListener('touchend', (e) => {
        timer.push(setTimeout(() => {
          touchmove.value = false
          timer.length = 0;
        }, 2000))
      });
    })
    onUpdated(() => {
      if(lyricsTopComputedTimes.value === 0)    //初次渲染时计算歌词的位置
        getLyricsScrollTop();
    })
    let changeTime = () => {
      context.emit('changeTime', touchMoveTime.value)
      touchmove.value = false;
    }
    return {
      lyricsWords,
      nIndex,
      touchmove,
      touchMoveTime,
      changeTime,
      a
    }
  },
}
/* 
歌词滚动组件
  功能：
    1、歌词滚动：
      1、监听audio元素上的timeupdate事件，实时获取当前时间
      2、v-for遍历歌词（带有对应时间），歌词首次onUpdated的时候计算出每句歌词对应的scrollTop(该属性在touchmove事件下不会失效，而top属性会失效)滚动距离，放在数组中
      3、watch监听当前时间并与每句歌词对应的时间进行对比，使用JS操作DOM（scrollTop属性）进行滚动到对应歌词的位置
    2、滑屏时停止歌词自动滚动并显示播放按钮、横线和当前滑动到的歌词对应的时间
      1、touchmove事件触发时watch监听时间进行歌词滚动的行为暂停
      2、在touchmove事件里控制横线的显示
      3、根据横线和每句歌词的相对位置（此处获取横线和每句歌词距离屏幕的y距离），
        如果某句歌词的y小于横线的y并且下一句歌词的y大于横线的y，那么就获取该句歌词对应的时间显示出来
      4、touchend时延迟取消显示，并将该计时器id保存下来，下次进入touchmove时取消未执行的计时器
    3、滑屏结束时点击播放按钮跳转到所滑到的位置
      改变时间即可（watch会监听到时间变化进行自动跳转）
    4、滑屏结束不点击播放按钮1s后自动回到播放位置
      监听touchmove属性，当它发生变化且当前状态为false时将歌词滚动到对应位置
  bugs：    
    歌词超出长度折行后导致歌词高度不同，如何计算高度：
      获取到当前句歌词和上一句歌词的DOM元素，获取他们的高度再操作DOM进行滚动（两个DOM元素高度的一半之和再加外边距）
    touchmove导致top定位失准
      使用scrollTop代替top
    如果最后用户手指快速离开屏幕出现惯性滚动时，会出现由于对touchmove事件进行了节流导致其在touchend事件后延迟触发，导致定时器被清除
      取消节流
    维护当前高亮歌词nIndex和index，判断其是否相等，若相等则无需操作DOM用以提高性能，但是会出现滑动结束后需要回位时，若歌词还是停留在原句，则无法回位
      取消该行为
    防止惯性滚动时就回位
      将touchend定时器的延迟设的长一些
    打包后出现的问题：
      见CSDN文章
    打包优化：
      将三方库使用external不打包到最后文件中，减小打包后的体积

    
*/ 
</script>

<style scoped>
  .lyrics{
    width: 340px;
    height: 130px;
    background-color: white;
    opacity: 0.5;
    margin-top: 20px;
    border-radius: 70px;
  }
  .lyricsContainer{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    scroll-behavior: smooth;
  }
  .lyricsContainer::-webkit-scrollbar {display:none}  /*隐藏滚动条*/
  .blank{
    width: 100%;
    height: 65px;
    flex-shrink: 0;
  }
  .active{
    color: red;
  }
  p{
    margin: 6px;
    font-size: 15px;
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
  .name{
    font-size: 18px;
  }
  .centerLine{
    width: 80%;
    margin: 0 10px;
    height: 1px;
    background-color: gray;
    opacity: 0.5;
    z-index: -1;
  }
  .time{
    font-size: 12px;
  }
</style>