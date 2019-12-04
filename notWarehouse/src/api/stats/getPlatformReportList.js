import request from '@/plugin/axios'

export function getPlatformReportList (data) {
  return request({
    url: '/platformreport/getPlatformReportList',
    method: 'post',
    data
  })
}
