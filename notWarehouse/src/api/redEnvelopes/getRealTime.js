import request from '@/plugin/axios'

export function  getRealTime(data) {
  return request({
    url: '/redpacketreport/getRealtimerpreportlist',
    method: 'post',
    data
  })
}