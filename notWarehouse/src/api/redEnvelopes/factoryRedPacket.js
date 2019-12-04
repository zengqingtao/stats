import request from '@/plugin/axios'

export function  factoryRedPacket(data) {
  return request({
    url: '/redpacketreport/GetRedPackReportBetweenDatesList',
    method: 'post',
    data
  })
}
