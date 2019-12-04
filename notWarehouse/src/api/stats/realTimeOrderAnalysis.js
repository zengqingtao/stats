import request from '@/plugin/axios'

export function realTimeOrderAnalysis(data) {
  return request({
    url: '/platformreport/getRealTimeHourList',
    method: 'post',
    data
  })
}