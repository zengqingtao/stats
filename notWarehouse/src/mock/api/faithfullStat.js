const data = {
    list: [
        { date: "2019-10-04", user_num: 250, visi_num: 125 },
        { date: "2019-10-05", user_num: 250, visi_num: 125 },
        { date: "2019-10-06", user_num: 220, visi_num: 125 },
        { date: "2019-10-07", user_num: 210, visi_num: 125 },
        { date: "2019-10-08", user_num: 240, visi_num: 125 },
        { date: "2019-10-09", user_num: 200, visi_num: 125 },
        { date: "2019-10-10", user_num: 180, visi_num: 125 }
    ]
}
export default [
    {
        path: "/admin/UsersReport/getFaithfulStat",
        method: "post",
        handle({ body }) {
            return {
                code: 1,
                msg: "success",
                data: data
            }
        }
    }
]