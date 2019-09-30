var data={
    total:19543,
    list:[
      {"origin":"砍价","new_user_num":25,"up_order_num":15,"order_num":189,"order_money":1783},
      {"origin":"红包","new_user_num":84,"up_order_num":15,"order_num":189,"order_money":2349},
      {"origin":"自然量","new_user_num":22,"up_order_num":15,"order_num":189,"order_money":1089},
      {"origin":"其它","new_user_num":16,"up_order_num":15,"order_num":189,"order_money":1089},
      {"origin":"总计","new_user_num":456,"up_order_num":150,"order_num":2189,"order_money":10089}
    ]
  }
  export default [
      {
        path: '/user/getInfo',
        method: 'post',
        handle ({body}) {
          console.log("info:",body);
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
    