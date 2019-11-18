<template>
  <d2-container>
    <template slot="header">实时红包报表</template>
     <!-- 表格部分 此处自定义的和分页的还没添加-->
    <div>
      <d2-crud
        :columns="crudColumns"
        :data="crudList"
        :loading="loading"
        :pagination="pagination" 
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getRealTime } from '@/api/redEnvelopes/getRealTime'
export default {
  name: 'realTime',
  data:function(){
    return {
      // crud初始数据
      crudColumns:[
        {title:'日期',key:'date'},
        {title:'下单领红包的人数',key:'pay_num'},
        {title:'有多少人进行过邀请（发送邀请链接）',key:'share_num'},
        {title:'有多少人点击了邀请链接',key:'invite_num'},
        {title:'关系链建立了多少(锁定的)',key:'lock_num'},
        {title:'邀请来并且下单的人数',key:'invite_pay_num'},
        {title:'红包点击提现多少个',key:'click_red_num'},
        {title:'红包提现多少笔',key:'withdraw_num'},
        {title:'累计费用(元)',key:'money_num'},
        // {title:'第一次打开小程序(全新用户)',key:'new_user_num'},
        // {title:'受邀请进来购物的去重人数',key:'order_only_num'},
        // {title:'购物次数',key:'order_num'},
        // {title:'购物总金额(元)',key:'order_money'}
      ],
      crudList:[],
      loading:false,
      pagination:{
        currentPage:1,
        pageSize:20,
        total:0
      },
    }
  },
  created(){
    this.getRedEnvelopesData();
  },
  watch:{

  },
  methods:{
    // 请求统计数据
    getRedEnvelopesData(){
      getRealTime({
        // page:this.pagination.currentPage,//当前页码
        // limit:this.pagination.pageSize //当前页码数据最大条数
      }).then(res=>{
          console.log("123:",res);
          this.crudList = res.list;
          this.pagination.total = res.total;//修改d2-crud表的总条数
      }).catch(err=>{
        console.log(err);
      })
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage){
      this.pagination.currentPage = currentPage;//修改页码
      this.getRedEnvelopesData();
      // this.currentPageChange();
    },
  }
}
</script>
<style scoped> 
  .container{
    margin:0 auto;
  }
  .header,.statisticsTime,.block{
    display:flex;
    align-items: center;
  }
  .header{
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
 .statisticsTime>div:first-child{
    width:75px;
  }
  .statisticsTime>div,.block{
    margin-right:15px;
  }
</style>

