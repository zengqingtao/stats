import request from '@/plugin/axios'

export function getAllFactory (data) {
  return request({
    url: '/platformreport/getPickupList',
    method: 'post',
    data
  })
}
