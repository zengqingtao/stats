import request from '@/plugin/axios'

export function getDetailInfo (data) {
  return request({
    url:"/platformreport/getPlatformReportInfo",
    method: 'post',
    data
  })
}
