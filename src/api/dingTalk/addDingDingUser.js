//添加钉钉用户
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function addDingDingUser(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/dingding/addDingDingUser',
        headers: { Authorization },
        method: 'post',
        data
    })
}