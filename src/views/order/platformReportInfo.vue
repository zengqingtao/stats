<template>
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>{{searchTime}} <span class="pickup-points">{{search_pickup_name}}</span>的详细信息</div>
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
    <ve-line class="ve-line" :data="chartData1" :settings="chartSettings1"></ve-line>    
    <ve-line class="ve-line" :data="chartData2" :settings="chartSettings2"></ve-line> 
    </el-dialog>
  </d2-container>
</template>

<script>
import { getDetailInfo } from '@/api/stats/getDetailInfo'
import { getPlatformReportList } from '@/api/stats/getPlatformReportList'
export default {
  name: 'detailinfo',
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
          {title:'日期',key:'date'},
          {title:'新注册用户数',key:'new_user_num'},
          {title:'活跃用户数',key:'active_num'},
          {title:'付款订单数',key:'order_num'},
          {title:'付款用户数',key:'uv_num'},
          {title:'付款订单数/付款用户数',key:'uv_order_to'},
          {title:'日收入',key:'ptm_income'},
          {title:'ARPU',key:'arpu_num'},
          {title:'提货点',key:'pickup_name'},
      ],
      crudData:[],
      loading:false,
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
      chartData1: {
        columns: ['date', 'order_num'],
        rows: []
      },
      chartData2: {
        columns: ['date', 'uv_num'],
        rows: []
      },
      fname:"",
    }
  },
  mounted(){
    this.searchTime = this.$route.query.date;
    this.search_pickup_name = this.$route.query.pickup_name;
    this.pickup_id = this.$route.query.pickup_id;
    this.detailInfo();
  },
  methods:{
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
    // 返回上一页
    jump(){
      this.$router.push({
        name:"platformReport"
      });
    },
    // 请求数据
    detailInfo(){
      getDetailInfo({
        page:this.pagination.currentPage,//当前页码
        limit:this.pagination.pageSize,//当前页码数据最大条数
        date:this.searchTime,
        pickup_id:this.pickup_id
      }).then(res=>{
        console.log("detailInfo-res:",res);
        this.crudData = res.list; //把数据赋值给d2-crud的crudData
        this.pagination.total = res.total;
      }).catch(err=>{
      })
    },
    // 请求统计数据
    platformReportList(){
      const start_date = new Date(); 
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24*15); //设置时间为昨天的前十五天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      getPlatformReportList({
        page:1,//当前页码
        limit:this.pagination.pageSize,//当前页码数据最大条数
        start_date:this.transformTime(start_date),
        end_date:this.transformTime(end_date),
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
          obj1["date"] = list[i]["date"];
          obj1["order_num"] = list[i]["order_num"];
          row1.push(obj1);
          obj2["date"] = list[i]["date"];
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
      }).catch(err=>{
        console.log(err);
      })
    },
    // d2-crud的自定义点击事件
    handleCustomEvent ({index, row}) {
      this.f_id = row.pickup_id;
      this.platformReportList(); //请求数据
      this.dialogVisible = true; //打开该对话框
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