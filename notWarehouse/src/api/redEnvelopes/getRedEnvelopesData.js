import request from '@/plugin/axios'

export function  getRedEnvelopesData(data) {
  return request({
    url: '/redpacketreport/getredpacketreportlist',
    method: 'post',
    data
  })
}
