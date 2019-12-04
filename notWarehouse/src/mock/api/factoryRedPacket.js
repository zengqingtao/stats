const data1 = {
	list: [
		{ "pickup_name": "莆田xxxx", "pay_num": 2, "share_num": 3, "invite_num": 4, "lock_num": 5, "invite_pay_num": 6, "click_red_num": 4, "withdraw_num": 7, "money_num": 8, "new_user_num": 9, "order_only_num": 8, "new_user_order_num": 6, "new_user_order_money": 5, "order_num": 3, "order_money": 4, },
		{ "pickup_name": "莆田xxxx", "pay_num": 2, "share_num": 3, "invite_num": 4, "lock_num": 5, "invite_pay_num": 6, "click_red_num": 4, "withdraw_num": 7, "money_num": 8, "new_user_num": 9, "order_only_num": 8, "new_user_order_num": 6, "new_user_order_money": 5, "order_num": 3, "order_money": 4, },
		{ "pickup_name": "莆田xxxx", "pay_num": 2, "share_num": 3, "invite_num": 4, "lock_num": 5, "invite_pay_num": 6, "click_red_num": 4, "withdraw_num": 7, "money_num": 8, "new_user_num": 9, "order_only_num": 8, "new_user_order_num": 6, "new_user_order_money": 5, "order_num": 3, "order_money": 4, },
		{ "pickup_name": "莆田xxxx", "pay_num": 2, "share_num": 3, "invite_num": 4, "lock_num": 5, "invite_pay_num": 6, "click_red_num": 4, "withdraw_num": 7, "money_num": 8, "new_user_num": 9, "order_only_num": 8, "new_user_order_num": 6, "new_user_order_money": 5, "order_num": 3, "order_money": 4, }
	]
}
const data2 = {
	list: [{ "pickup_name": "莆田xxxx", "pay_num": 2, "share_num": 3, "invite_num": 4, "lock_num": 5, "invite_pay_num": 6, "click_red_num": 4, "withdraw_num": 7, "money_num": 8, "new_user_num": 9, "order_only_num": 8, "new_user_order_num": 6, "new_user_order_money": 5, "order_num": 3, "order_money": 4, }]
}
export default [
	{
		path: "/admin/redpacketreport/factoryRedPacket",
		method: "post",
		handle({ body }) {
			if (body.pickup_id == 0) {
				return {
					code: 1,
					msg: "success",
					data: data1
				}
			} else {
				return {
					code: 1,
					msg: "success",
					data: data2
				}
			}
		}
	}
]