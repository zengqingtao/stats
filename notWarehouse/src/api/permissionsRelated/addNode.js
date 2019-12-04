//添加权限
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function addNode(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/node/addNode',
        headers: { Authorization },
        method: 'post',
        data
    })
}