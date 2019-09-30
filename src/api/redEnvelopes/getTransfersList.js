import request from '@/plugin/axios'

export function  getTransfersList(data) {
  return request({
    url: '/redpacketreport/getTransfersList',
    method: 'post',
    data
  })
}