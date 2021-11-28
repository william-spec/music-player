import moment from 'moment'

export function secToMinSec(sec){
  let time = moment.duration(sec, 'seconds');
  let minutes = time.minutes();
  let seconds = time.seconds();
  return moment({m:minutes, s:seconds}).format('mm:ss')
}

export function MinSecToSec(time){
  return moment.duration('00:' + time).as('seconds');
}