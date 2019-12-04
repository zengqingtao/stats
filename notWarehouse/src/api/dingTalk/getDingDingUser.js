//获取钉钉用户
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function getDingDingUser(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/dingding/getDingDingUser',
        headers: { Authorization },
        method: 'post',
        data
    })
}