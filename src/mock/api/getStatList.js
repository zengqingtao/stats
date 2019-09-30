// var data={
//     total:15,
//     list:[
//       {"date":"2019-08-05","order_num":25,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-06","order_num":84,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-07","order_num":22,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-08","order_num":16,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-09","order_num":62,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-10","order_num":34,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-11","order_num":65,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-12","order_num":32,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-13","order_num":65,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-14","order_num":32,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-15","order_num":46,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-16","order_num":65,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-17","order_num":24,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-18","order_num":26,"uv_num":15,"uv_order_to":0.4},
//       {"date":"2019-08-20","order_num":53,"uv_num":15,"uv_order_to":0.4}
//     ]
//   }
  
//   export default [
//       {
//         path: '/api/stat/getStatList',
//         method: 'post',
//         handle ({body}) {
//           console.log("body----：",body);
//           if(JSON.stringify(data) == "{}"){
//             return {
//               code:0,
//               msg:"fail",
//               data:{}
//             }
//           }else{
//             return {
//               code:1,
//               msg:"success",
//               data:data
//             }
//           }
//         }
//       }
//     ]
    