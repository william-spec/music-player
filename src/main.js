import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './css/common.css'
import { Tab, Tabs, Dialog, Form, Field, CellGroup, 
  Button, Toast, NavBar, Icon, Grid, GridItem, Search } from 'vant'
import axios from 'axios'
import 'amfe-flexible'    //根据不同设备可以改变html元素的fontSize属性
import Lyrics from '../lyricsUI/lyricsUI.common'
import '../lyricsUI/lyricsUI.css'


const app = createApp(App).use(store).use(router)
app.use(Tab)
app.use(Tabs)
app.use(Dialog);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Button);
app.use(Toast);
app.use(NavBar);
app.use(Icon);
app.use(Grid);
app.use(GridItem);
app.use(Search);
app.use(Lyrics);
app.config.globalProperties.$axios=axios
app.mount('#app')
