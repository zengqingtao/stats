var data=[
    {
      new_user_num:89,
      visit_num: 99,
      order_num:22,
      up_order_num:11,
      order_money:1000.89
    },
    {
        new_user_num:64,
        visit_num: 35,
        order_num:87,
        up_order_num:43,
        order_money:1360.89
    }
  ]
  
  export default [
      {
        path: '/api/index/getTYList',
        method: 'post',
        handle ({body}) {
          return {
            code:1,
            msg:"success",
            data:{
              list:data
            }
          }
        }
      }
    ]
    