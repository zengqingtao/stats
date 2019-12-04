<template>
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>{{searchTime}} <span class="pickup-points">{{search_pickup_name}}</span>实时日订单分析详情</div>
      </div>
    </template>
    <!-- d2-crud表 -->
    <div class="d2crud">
      <d2-crud
        :columns="crudColumns"
        :data="crudData"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        @custom-emit-1="handleCustomEvent"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
    <!-- 对话框 -->
    <el-dialog
      :title="`${fname}`"
      :visible.sync="dialogVisible"
      width="80%"
      height="1000px"
    >
    <ve-line class="ve-line" :data="chartData1" :loading="veLineLoading" :settings="chartSettings1"></ve-line>    
    <ve-line class="ve-line" :data="chartData2" :loading="veLineLoading" :settings="chartSettings2"></ve-line> 
    </el-dialog>
  </d2-container>
</template>

<script>
import { realTimeOrderInfo } from '@/api/stats/realTimeOrderInfo'
import { realTimeOrderAnalysis } from "@/api/stats/realTimeOrderAnalysis";
export default {
  name: 'realTimeReportInfo',
  data:function(){
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings1 = {
      labelMap: {
        order_num: '付款订单数',
      }
    },
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings2 = {
      labelMap: {
        uv_num:'付款用户数',
      }
    }
    return {
      searchTime:'',//保存传递过来需要搜索的时间
      search_pickup_name:'',//保存传递过来需要搜索的工厂名称 
      pickup_id:0,//详细信息的工厂id
      f_id:0,//查看的工厂id
      crudColumns:[
          {title:'时间',key:'hour'},
          {title:'新注册用户数',key:'new_user'},
          {title:'活跃用户数',key:'active_user'},
          {title:'付款订单数',key:'order_num'},
          {title:'付款用户数',key:'uv_num'},
          {title:'付款订单数/付款用户数',key:'uv_order_ratio'},
          {title:'日收入',key:'ptm_income'},
          {title:'客单价',key:'arpu_num'},
          {title:'提货点',key:'pickup_name'},
      ],
      crudData:[],
      loading:true,
      pagination:{
        currentPage:1,
        pageSize:15,
        total:0
      },
      // 自定义
      rowHandle: {
        custom: [
          {
            text: '查看',
            type: 'success',
            size: 'small',
            emit: 'custom-emit-1'
          }
        ]
      },
      // 对话框
      dialogVisible:false,//保存对话框的默认关闭状态
      veLineLoading:false,
      chartData1: {
        columns: ['hour', 'order_num'],
        rows: []
      },
      chartData2: {
        columns: ['hour', 'uv_num'],
        rows: []
      },
      fname:"",
    }
  },
  mounted(){
    this.searchTime = this.$route.query.time;
    this.search_pickup_name = this.$route.query.pickup_name;
    this.pickup_id = this.$route.query.pickup_id;
    this.detailInfo();
  },
  methods:{
    // 返回上一页
     jump(){
      this.$router.push({
        name:"realTimeReport"
      });
    },
    // 请求数据
    detailInfo(){
      realTimeOrderInfo({
        page:this.pagination.currentPage,//当前页码
        limit:this.pagination.pageSize,//当前页码数据最大条数
        start_date:this.searchTime.split("-")[0],
        end_date:this.searchTime.split("-")[1],
        pickup_id:this.pickup_id
      }).then(res=>{
        console.log("realTimeOrderInfo：",res);
        // 遍历计算每一条数据的客单价（客单价等于日收入/付款用户）
        for(var i=0;i<res.list.length;i++){
          var ptm_income = res.list[i].ptm_income;
          var uv_num = res.list[i].uv_num;
          if(ptm_income==0||uv_num==0){
            res.list[i].arpu_num = 0;
          }else{
            var arpu_num = ptm_income/uv_num;
            arpu_num = arpu_num.toFixed(2);
            res.list[i].arpu_num = arpu_num;
          }
        }
        this.loading = false;
        this.crudData = res.list; //把数据赋值给d2-crud的crudData
        this.pagination.total = res.total;
      })
    },
    // 请求统计数据
    getOrderUserNum(){
      this.veLineLoading = true;
      realTimeOrderAnalysis({
        pickup_id:this.f_id //当前工厂id
      }).then(res=>{
        console.log("chakan-res:",res);
        //把数据分别赋值给折线图的rows和d2-crud表的crudList
        var list =res.list;
        var row1 = [];
        var row2 = [];
        var obj1 = {};
        var obj2 = {};
        for(var i=0;i<list.length;i++){
          obj1["hour"] = list[i]["hour"];
          obj1["order_num"] = list[i]["order_num"];
          row1.push(obj1);
          obj2["hour"] = list[i]["hour"];
          obj2["uv_num"] = list[i]["uv_num"];
          row2.push(obj2);
          obj1 = {}; 
          obj2 = {}
        }
        this.chartData1.rows = [];
        this.chartData2.rows = [];
        for(var i=row1.length-1;i>=0;i--){
          this.chartData1.rows.push(row1[i]);
        }
        for(var i=row2.length-1;i>=0;i--){
          this.chartData2.rows.push(row2[i]);
        }
        this.veLineLoading = false;
      }).catch(err=>{
        console.log(err);
      })
    },
    // d2-crud的自定义点击事件
    handleCustomEvent ({index, row}) {
      this.f_id = row.pickup_id;
      this.getOrderUserNum(); //请求数据
      this.dialogVisible = true; //打开该对话框
      console.log("row:",row);
      this.fname = row.pickup_name;
    },
    // 点击页码触发的事件
    paginationCurrentChange(currentPage){
      this.pagination.currentPage = currentPage;
      this.detailInfo();//页码变动，重新请求对应页码的数据
      // this.currentPageChange();
    },

  }
}
</script>
<style scoped>
  .headerNav{
    width:100%;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap:nowrap;
  }
  .headerNav>div:first-child{
    font-weight: 800;
    font-size:20px;
    color:#409eff;
    margin-right:20px
  }
  .headerNav>div:first-child:hover{
    cursor: pointer;
    /* font-size:22px; */
  }
  /* 提货点 */
  .pickup-points{
    font-weight:bold;
    margin-right:5px
  }
</style>