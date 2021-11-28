import axios from 'axios'

//添加/api表示走代理解决跨域问题，无/api表示直接发请求
axios.defaults.baseURL = '/api'

export function getRecommendResource(){
  return axios.get('/recommend/resource')
}

export function getPersonalizedNewsong(){
  return axios.get('/personalized/newsong')
}

export function getPersonalizedDjprogram(){
  return axios.get('/personalized/djprogram')
}

export function getProgramRecommend(){
  return axios.get('/program/recommend')
}

export function getPersonalizedPrivatecontent(){
  return axios.get('/personalized/privatecontent')
}

export function login(username, password){
  return axios.get(`/login/cellphone?phone=${username}&password=${password}`)
}

export function sendIDCode(phone){
  return axios.get(`/captcha/sent?phone=${phone}`)
}

export function identifyIDCode(phone, sms){
  return axios.get(`/captcha/verify?phone=${phone}&captcha=${sms}`)
}

export function getLyrics(id){
  return axios.get(`/lyric?id=${id}`)
}

export function getPlaylistDetail(id){
  return axios.get(`/playlist/detail?id=${id}`)
}

export function getSongUrl(id){
  return axios.get(`/song/url?id=${id}`)
}

export function getSongDetail(id){
  return axios.get(`/song/detail?ids=${id}`)
}

export function getSearchHot(){
  return axios.get(`/search/hot`)
}

export function getSearchSuggest(keywords){
  return axios.get(`/search/suggest?keywords= ${keywords}`)
}
