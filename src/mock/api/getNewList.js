var data1=[
    {date:"00:00-00:59",new_add:66,money:77,order_num:88},
    {date:"01:00-01:59",new_add:80,money:54,order_num:76},
    {date:"02:00-02:59",new_add:80,money:54,order_num:76},
    {date:"03:00-03:59",new_add:60,money:54,order_num:76},
    {date:"04:00-04:59",new_add:30,money:53,order_num:73},
    {date:"05:00-05:59",new_add:70,money:54,order_num:73},
    {date:"06:00-06:59",new_add:20,money:54,order_num:76},
    {date:"07:00-07:59",new_add:50,money:56,order_num:72},
    {date:"08:00-08:59",new_add:70,money:34,order_num:71},
    {date:"09:00-09:59",new_add:20,money:24,order_num:76},
    {date:"10:00-10:59",new_add:54,money:54,order_num:26},
    {date:"11:00-11:59",new_add:36,money:14,order_num:26},
    {date:"12:00-12:59",new_add:64,money:54,order_num:56},
    {date:"13:00-13:59",new_add:32,money:64,order_num:76},
    {date:"14:00-14:59",new_add:80,money:14,order_num:16},
    {date:"15:00-15:59",new_add:86,money:54,order_num:66},
    {date:"16:00-16:59",new_add:20,money:54,order_num:16},
    {date:"17:00-17:59",new_add:50,money:54,order_num:56},
    {date:"18:00-18:59",new_add:50,money:54,order_num:36},
    {date:"19:00-19:59",new_add:34,money:24,order_num:76},
    {date:"20:00-20:59",new_add:32,money:64,order_num:36},
    {date:"21:00-21:59",new_add:80,money:14,order_num:86},
    {date:"22:00-22:59",new_add:80,money:54,order_num:36},
    {date:"23:00-23:59",new_add:80,money:54,order_num:76},
]
var data2=[
    {date:"00:00-00:59",new_add:63,money:77,order_num:43},
    {date:"01:00-01:59",new_add:23,money:54,order_num:12},
    {date:"02:00-02:59",new_add:23,money:54,order_num:76},
    {date:"03:00-03:59",new_add:45,money:54,order_num:34},
    {date:"04:00-04:59",new_add:23,money:53,order_num:45},
    {date:"05:00-05:59",new_add:45,money:53,order_num:73},
    {date:"06:00-06:59",new_add:46,money:23,order_num:74},
    {date:"07:00-07:59",new_add:35,money:54,order_num:45},
    {date:"08:00-08:59",new_add:56,money:23,order_num:71},
    {date:"09:00-09:59",new_add:23,money:24,order_num:72},
    {date:"10:00-10:59",new_add:54,money:54,order_num:43},
    {date:"11:00-11:59",new_add:36,money:14,order_num:54},
    {date:"12:00-12:59",new_add:64,money:54,order_num:23},
    {date:"13:00-13:59",new_add:32,money:45,order_num:54},
    {date:"14:00-14:59",new_add:23,money:14,order_num:16},
    {date:"15:00-15:59",new_add:34,money:54,order_num:54},
    {date:"16:00-16:59",new_add:20,money:76,order_num:34},
    {date:"17:00-17:59",new_add:50,money:54,order_num:32},
    {date:"18:00-18:59",new_add:50,money:54,order_num:43},
    {date:"19:00-19:59",new_add:34,money:24,order_num:65},
    {date:"20:00-20:59",new_add:32,money:64,order_num:23},
    {date:"21:00-21:59",new_add:80,money:14,order_num:54},
    {date:"22:00-22:59",new_add:80,money:54,order_num:32},
    {date:"23:00-23:59",new_add:80,money:54,order_num:65},
]
  
  export default [
      {
        path: '/api/index/getNewList',
        method: 'post',
        handle ({body}) {
          if(body.time_status == 'today'){
            return {
                code:1,
                msg:"success",
                data:{
                  list:data1
                }
              }
          }else{
            return {
                code:1,
                msg:"success",
                data:{
                  list:data2
                }
              }
          }
        }
      }
    ]
    