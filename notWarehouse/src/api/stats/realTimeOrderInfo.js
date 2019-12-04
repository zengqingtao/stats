import request from '@/plugin/axios'

export function realTimeOrderInfo (data) {
  return request({
    url:"/platformreport/getRealTimeHourDetails",
    method: 'post',
    data
  })
}
