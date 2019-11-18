//获取权限列表
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function getNodeList(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/node/getNodeList',
        headers: { Authorization },
        method: 'post',
        data
    })
}