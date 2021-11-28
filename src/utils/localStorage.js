if(!window.localStorage) alert('浏览器不支持localStorage')

let storage = window.localStorage;

export function setItem(key, value){
  if(typeof value !== 'object'){
    storage.setItem(key, value);
  }
  else{
    let str = JSON.stringify(value);
    storage.setItem(key, str);
  }
}

export function getItem(key){
  let res;
  if(res = storage.getItem(key)){
    if(res[0] === '{')  return JSON.parse(res);
    return storage.getItem(key)
  }
  else console.log(`${key}不存在`);
}

export function removeItem(key){
  if(storage.getItem(key))
    storage.removeItem(key)
  else console.log(`${key}不存在，无法移除`);
}

export function clear(){
  storage.clear();
  console.log('清除成功');
}
