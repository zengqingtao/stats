<template>
  <div class="d2-container" >
    <!-- 头部表格 -->
    <table class="tab bgcolor">
      <tr>
        <td></td>
        <td>新用户数</td>
        <td>活跃人数</td>
        <td>订单数</td>
        <td>下单人数</td>
        <td>订单金额</td>
      </tr>
      <tr>
        <td>今天</td>
        <td v-for="(item,index) in tyList1" :key="index">{{item}}</td>
      </tr>
      <tr>
        <td>昨天</td>
        <td v-for="(item,index) in tyList2" :key="index">{{item}}</td>
      </tr>
    </table>
     <!-- 今天和昨天的按钮 -->
    <div class="btn-box">
      <div @click="timeClick('today')" :class="time=='today'?'active':''">今天</div>
      <div @click="timeClick('yesterday')" :class="time=='yesterday'?'active':''">昨天</div>
    </div>
    <div class="order-money-box">
      <div class="order-money-item">
        <ve-line  class="ve-line" :data="chartData1" :settings="chartSettings1" :series="series" ></ve-line>
        <div class="ve-line-subtitle">新用户</div>
      </div>
      <div class="order-money-item">
        <ve-line  class="ve-line" :data="chartData4" :settings="chartSettings4"></ve-line>
        <div class="ve-line-subtitle">活跃用户</div>
      </div>
    </div>
    <div class="order-money-box">
      <div class="order-money-item">
        <ve-line  class="ve-line" :data="chartData3" :settings="chartSettings3"></ve-line>
        <div class="ve-line-subtitle">订单数</div>
      </div>
      <div class="order-money-item">
        <ve-line  class="ve-line" :data="chartData2" :settings="chartSettings2"></ve-line>
        <div class="ve-line-subtitle">金额</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTYList } from '@/api/index/getTYList'
import { getNewList } from '@/api/index/getNewList'
export default {
  data(){
    this.series = [{
      type:"line",
      tooltip: {
            show: false
      },
      itemStyle: {
            normal: {
                color: "rgba(255,255,255,1)",
            }
      },
      lineStyle: {
            normal: {
                color: "#53fdfe", // 线条颜色
            },
            borderColor: '#f0f'
      },
      areaStyle:{
        color: {
            type: 'linear',
            showAllSymbol: true,
            // x: 0,
            // y: 0,
            // x2: 0,
            // y2: 1,
            // colorStops: [{
            //     offset: 0, color: '#00ff00' // 0% 处的颜色
            // }, {
            //     offset: 1, color: '#ff0000' // 100% 处的颜色
            // }],
            // global: false // 缺省为 false
        }
      }
    }],
     // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings1 = {
      labelMap: {
        hour: '日期',
        td_new_user_num:"今天",
        yd_new_user_num:"昨天",
      },
      area:true,
    },
    this.chartSettings2 = {
      labelMap: {
        hour: '日期',
        td_total_amount:"今天",
        yd_total_amount:"昨天",
      },
      area:true
    },
    this.chartSettings3 = {
      labelMap: {
        hour: '日期',
        td_order_num:"今天",
        yd_order_num:"昨天"
      },
      area:true
    },
     this.chartSettings4 = {
      labelMap: {
        hour: '日期',
        td_active_user_num:"今天",
        yd_active_user_num:"昨天"
      },
      area:true
    } 
    return{
      time:'today',
      tyList1:[],//保存今天的数据
      tyList2:[],//保存昨天的数据
      chartData1: {//columns必须与rows同语言
        columns: ['hour','td_new_user_num','yd_new_user_num'],
        rows: []
      },
      chartData2: {//columns必须与rows同语言
        columns: ['hour','td_total_amount','yd_total_amount'],
        rows: []
      },
      chartData3: {//columns必须与rows同语言
        columns: ['hour','td_order_num','yd_order_num'],
        rows: []
      },
      chartData4: {//columns必须与rows同语言
        columns: ['hour','td_active_user_num','yd_active_user_num'],
        rows: []
      },
      newAddList1:[],//保存新增数据，
      moneyList1:[],//保存金额数据
      orderNumLIst1:[],//保存订单数的数据
      activeNumList1:[],//保存活跃用户的数据
      // 
      newAddList2:[],//保存新增数据，
      moneyList2:[],//保存金额数据
      orderNumLIst2:[],//保存订单数的数据
      activeNumList2:[],//保存活跃用户的数据
    }
  },
  created(){
    this.getTYList();
    this.getTodayList();
    setInterval(()=>{
      this.getTYList();
      this.getTodayList();  
    },50000);
  },
  methods:{
    timeClick(e){
      if(e=='yesterday'){
        this.time = 'yesterday'
      }else{
        this.time = 'today'
      }
    },
    // 获取今天和昨天的数据
    getTYList(){
      getTYList().then(res=>{
        this.tyList1 = [];
        this.tyList2 = [];
      // 今天
        this.tyList1.push(res.list[0].new_user_num);
        this.tyList1.push(res.list[0].active_num);
        this.tyList1.push(res.list[0].order_num);
        this.tyList1.push(res.list[0].uv_num);
        this.tyList1.push(res.list[0].ptm_income);
      // 昨天
        this.tyList2.push(res.list[1].new_user_num);
        this.tyList2.push(res.list[1].active_num);
        this.tyList2.push(res.list[1].order_num);
        this.tyList2.push(res.list[1].uv_num);
        this.tyList2.push(res.list[1].ptm_income);
      })
    },
    // 获取今天
    getTodayList(){
      this.newAddList1 = [];
      this.moneyList1 = [];
      this.orderNumLIst1 = [];
      this.activeNumList1 = [];
      getNewList({
        time_status:'today'
      }).then(res=>{
        for(var i=0;i<res.list.length;i++){
           var obj1={};
           var obj2={};
           var obj3={};
           var obj4={};
          obj1["hour"] = res.list[i].hour;
          obj1["td_new_user_num"] = res.list[i].new_user_num;
          obj2["hour"] = res.list[i].hour;
          obj2["td_total_amount"] = res.list[i].total_amount;
          obj3["hour"] = res.list[i].hour;
          obj3["td_order_num"] = res.list[i].order_num;
          obj4["hour"] = res.list[i].hour;
          obj4["td_active_user_num"] = res.list[i].active_user_num;
          this.newAddList1.push(obj1);
          this.moneyList1.push(obj2);
          this.orderNumLIst1.push(obj3);
          this.activeNumList1.push(obj4);
        }
        this.getYesterdayList();
      })
    },
    // 昨天
    getYesterdayList(){
      this.newAddList2 = [];
      this.moneyList2 = [];
      this.orderNumLIst2 = [];
      this.activeNumList2 = [];
      getNewList({
        time_status:'yesterday'
      }).then(res=>{
        for(var i=0;i<res.list.length;i++){
           var obj1={};
           var obj2={};
           var obj3={};
           var obj4={};
          obj1["hour"] = res.list[i].hour;
          obj1["yd_new_user_num"] = res.list[i].new_user_num;
          obj2["hour"] = res.list[i].hour;
          obj2["yd_total_amount"] = res.list[i].total_amount;
          obj3["hour"] = res.list[i].hour;
          obj3["yd_order_num"] = res.list[i].order_num;
          obj4["hour"] = res.list[i].hour;
          obj4["yd_active_user_num"] = res.list[i].active_user_num;
          this.newAddList2.push(obj1);
          this.moneyList2.push(obj2);
          this.orderNumLIst2.push(obj3);
          this.activeNumList2.push(obj4);
        }
        this.chuli()
      })
    },
    // 处理
    chuli(){
      for(var i=0;i<this.newAddList2.length;i++){
        if(i<this.newAddList1.length){
          this.newAddList2[i].td_new_user_num = this.newAddList1[i].td_new_user_num
          this.moneyList2[i].td_total_amount = this.moneyList1[i].td_total_amount
          this.orderNumLIst2[i].td_order_num = this.orderNumLIst1[i].td_order_num
          this.activeNumList2[i].td_active_user_num = this.activeNumList1[i].td_active_user_num    
        }else{
          this.newAddList2[i].td_new_user_num = 0;
          this.moneyList2[i].td_total_amount = 0
          this.orderNumLIst2[i].td_order_num = 0
          this.activeNumList2[i].td_active_user_num = 0    
        }
      }
      this.chartData1.rows = this.newAddList2
      this.chartData2.rows = this.moneyList2
      this.chartData3.rows = this.orderNumLIst2
      this.chartData4.rows = this.activeNumList2
    }

  },
}
</script>>
<style lang="scss" scoped>
  // background-color:#EFEFEF !important
  .bgcolor{
    background-color:#fff;
  }
  .first-ve-line{
    margin-top:10px;
  }
  .tab{
    width:100%;
    text-align: center;
    border:5px solid #EFEFEF;
  }
  .tab>tr{
    height:50px;
    line-height:50px;
  }
  .tab>tr:nth-child(2)>td:not(:first-child){
    font-size:30px;
    font-weight:bold;
  }
  // 时间按钮
  .btn-box{
    display: flex;
    flex-wrap: nowrap;
    margin-top:10px
  }
  .btn-box>div{
    width:50px;
    height:25px;
    font-size:13px;
    display: flex;
    justify-content: center;
    align-items: center;
    border:1px solid #EFEFEF;
    border-radius:3px;
    cursor: pointer;
  }
  // 按钮
  .active{
    background-color:#409EFF;
    color:#fff;
  }
  .ve-line{
    margin-top:20px
  }
  .ve-line-subtitle{
    color:#565656;
    font-size:12px;
    font-weight:500;
    padding-top:10px;
    padding-bottom: 15px;
    border-bottom: 10px solid #EFEFEF;
    text-align:center;
    margin-top:-50px;
  }
  .order-money-box{
    width:100%;
    display: flex;
    flex-wrap:nowrap;
  }
  .order-money-item{
    width:50%;
    height: 100%;
  }
</style>
