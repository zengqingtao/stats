import request from '@/plugin/axios'

export function  redPacketReportInfo(data) {
  return request({
    url: '/redpacketreport/GetRedPacketReportDateDetailList',
    method: 'post',
    data
  })
}
