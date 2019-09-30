var data={
    total:15,
    list:[
      {"date":"2019-08-20","new_user_num":25,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-19","new_user_num":84,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-18","new_user_num":22,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-17","new_user_num":16,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-16","new_user_num":62,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-15","new_user_num":34,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-14","new_user_num":65,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-13","new_user_num":32,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-12","new_user_num":65,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-11","new_user_num":32,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-10","new_user_num":46,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-09","new_user_num":65,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-08","new_user_num":24,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-07","new_user_num":26,"up_order_num":15,"order_num":189,"order_money":1089},
      {"date":"2019-08-06","new_user_num":53,"up_order_num":15,"order_num":189,"order_money":1089}
    ]
  }
  
  export default [
      {
        path: '/user/getNewAnalysis',
        method: 'post',
        handle ({body}) {
          if(JSON.stringify(data) == "{}"){
            return {
              code:0,
              msg:"fail",
              data:{}
            }
          }else{
            return {
              code:1,
              msg:"success",
              data:data
            }
          }
        }
      }
    ]
    