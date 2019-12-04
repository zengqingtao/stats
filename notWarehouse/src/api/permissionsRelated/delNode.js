//删除权限
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function delNode(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/node/delNode',
        headers: { Authorization },
        method: 'post',
        data
    })
}