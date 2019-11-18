const data = {
    list: [
        {
            signIn_num: 250,
            order_num: 125,
            share_num: 100,
            bargain_num: 100,
            pickup_name: "莆田力奴鞋业"
        },
        {
            signIn_num: 220,
            order_num: 105,
            share_num: 130,
            bargain_num: 120,
            pickup_name: "莆田百合鞋业"
        }
    ],
    total: 2
}
export default [
    {
        path: "/admin/DashBoard/integralDetails",
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