<template>
  <d2-container>
    <template slot="header">红包日报表</template>
     <!-- 顶部 -->
    <div class="header">
      <div class="statisticsTime">
        <div >统计时间</div>
        <div class="block">
          <el-date-picker
            v-model="start_time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <span> ~ </span>
          <el-date-picker
            v-model="end_time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <el-button type="success" @click="getRedEnvelopesData">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
        <el-button type="primary" @click="exportData">提现明细导出</el-button>
      </div>
    </div>
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
import { getRedEnvelopesData } from '@/api/redEnvelopes/getRedEnvelopesData'
import { getTransfersList } from '@/api/redEnvelopes/getTransfersList'
export default {
  name: 'redPacket',
  data:function(){
    return {
      start_time:'',
      end_time:'',
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
        {title:'第一次打开小程序(新用户)',key:'new_user_num'},
        {title:'受邀请进来购物的去重人数(新用户)',key:'order_only_num'},
        {title:'购物次数(新用户)',key:'new_user_order_num'},
        {title:'购物总金额(新用户)(元)',key:'new_user_order_money'},
        {title:'购物次数',key:'order_num'},
        {title:'购物总金额(元)',key:'order_money'}
      ],
      crudList:[],
      loading:false,
      pagination:{
        currentPage:1,
        pageSize:20,
        total:0
      },
      // 导出数据的列
      exportColumns:[
        {
          label: 'openid',
          prop: 'openid'
        },
        {
          label: '商户单号',
          prop: 'out_trade_no'
        },
        {
          label: '提现金额',
          prop: 'total_fee'
        },
         {
          label: '付款单号',
          prop: 'trade_no'
        },
        {
          label: '付款状态信息',
          prop: 'err_msg'
        },
        {
          label: '发起时间',
          prop: 'create_time'
        },
        {
          label: '到账时间',
          prop: 'transfers_time'
        }
      ]
    }
  },
  created(){
    this.setDefaultTime();
    this.getRedEnvelopesData();
  },
  watch:{

  },
  methods:{
    // 到处数据
    exportData(){
       getTransfersList({
        start_date:this.transformTime(this.start_time),
        end_date:this.transformTime(this.end_time),
      }).then(res=>{
        if(res.list.length == 0){
          this.$message('暂无数据');
        }else{
          this.$export.excel({
            columns:this.exportColumns,
            data:res.list,
            title:"红包提现明细表"
          }).then(() => {
            this.$message('导出成功')
          })
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 转换时间格式
    transformTime(date){
      var y = date.getFullYear();
      var m = date.getMonth()+1;
      var d = date.getDate();
      if(m>0&&m<=9){
        m = "0"+m;
      }
      if(d>0&&d<=9){
        d = "0"+d;
      }
      var newDate=y + '-' + m + '-' + d;
      return newDate
    },
    // 请求统计数据
    getRedEnvelopesData(){
      getRedEnvelopesData({
        page:this.pagination.currentPage,//当前页码
        limit:this.pagination.pageSize,//当前页码数据最大条数
        start_date:this.transformTime(this.start_time),
        end_date:this.transformTime(this.end_time),
      }).then(res=>{
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
    // 设置默认时间
    setDefaultTime(){
      const start_date = new Date(); 
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24*15); //设置时间为昨天的前十五天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      this.start_time = start_date;
      this.end_time =end_date;
    },
    // 点击重置触发的方法
    reset(){
      this.setDefaultTime();
      this.getRedEnvelopesData();
    }
  }
}
</script>
<style scope> 
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

