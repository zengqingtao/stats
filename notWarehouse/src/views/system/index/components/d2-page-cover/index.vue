<template>
  <div>
    <div class="d2-container" v-if="roleid!=3">
      <div class="pickup-points-box">
        <div class="pickup-points">提货点</div>
        <el-select class="pickup-points-option" v-model="pickupName" placeholder="请选择">
          <el-option v-for="(item,i) in pickupOptions" :key="i" :value="item"></el-option>
        </el-select>
      </div>
      <!-- 头部表格 -->
      <div class="tab-box">
        <table class="tab bgcolor" cellspacing="0" v-loading="tabLoading">
          <!-- 列标题 -->
          <tr>
            <td v-for="(item,index) in tabColumns" :key="index">{{item}}</td>
          </tr>
          <!-- 今天 -->
          <tr>
            <td v-for="(item,index) in tList" :key="index">{{item}}</td>
            <td v-if="tList.length==1" :colspan="tabColumns.length-1">{{waitStats}}</td>
          </tr>
          <!-- 昨天 -->
          <tr>
            <td v-for="(item,index) in yList" :key="index">{{item}}</td>
            <td v-if="yList.length==1" :colspan="tabColumns.length-1">{{waitStats}}</td>
          </tr>
          <!-- 昨天的前五天 -->
          <tr v-if="showData" v-for="(item,index) in otherList" :key="index">
            <td v-for="(item,index) in item" :key="index">{{item}}</td>
            <td v-if="item.length==1" :colspan="tabColumns.length-1">{{waitStats}}</td>
          </tr>
          <tr v-if="!showData">
            <td @click="pullDownUp(showData)">
              <img class="img" src="../../../../../../public/image/shousuoxiajiantou.png" />
            </td>
          </tr>
          <tr v-if="showData">
            <td @click="pullDownUp(showData)">
              <img class="img" src="../../../../../../public/image/shousuoshangjiantou.png" />
            </td>
          </tr>
        </table>
      </div>
      <!-- 今天和昨天的按钮 -->
      <div class="btn-box">
        <div @click="timeClick('today')" :class="time_status=='today'?'active':''">今天</div>
        <div @click="timeClick('yesterday')" :class="time_status=='yesterday'?'active':''">昨天</div>
      </div>
      <div class="chart-box">
        <!-- 访问次数 -->
        <!-- <div class="veline-box" v-if="false">
          <div class="veline-pickup">
            <div class="visit-num">访问次数</div>
            <div>提货点：</div>
            <el-select v-model="pickupName" placeholder="请选择">
              <el-option v-for="(item,i) in pickupOptions" :key="i" :value="item"></el-option>
            </el-select>
          </div>
          <ve-line
            class="ve-line"
            height="550px"
            :loading="loading1"
            :data="chartData1"
            :settings="commonChartSettings"
            :series="time_status=='today'?series1:series11"
            :legend="time_status=='today'?legend1:legend2"
            :colors="time_status=='today'?colors1:colors2"
          ></ve-line>
        </div>-->
        <!-- 活跃用户汇总 -->
        <div class="barbox" v-if="pid==0">
          <div class="barbox-notData" v-if="chartData.rows.length==0">暂无数据</div>
          <ve-bar
            class="bar-veline"
            height="645px"
            :colors="veBarColors"
            :data="chartData"
            :settings="chartSettings5"
          ></ve-bar>
          <div class="barbox-branchPage">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="veBarCurrentPage"
              :page-size="veBarPageSize"
              layout="total, prev, pager, next,jumper"
              :small="true"
              :total="veBarTotal"
            ></el-pagination>
          </div>
        </div>
        <!-- 订单明细 -->
        <div class="d2crudbox" v-if="pid==0">
          <div class="d2crud-title">订单明细</div>
          <d2-crud
            class="d2crud"
            :columns="orderColumns"
            :data="orderList"
            :loading="orderLoading"
            :pagination="orderPagination"
            :options="options"
            @pagination-current-change="orderPaginationCurrentChange"
          />
        </div>
        <!-- 商品明细 -->
        <div class="d2crudbox">
          <div class="d2crud-title">商品明细</div>
          <d2-crud
            class="d2crud"
            :columns="goodsColumns"
            :data="goodsList"
            :loading="goodsLoading"
            :pagination="goodsPagination"
            :options="options"
            @pagination-current-change="goodsPaginationCurrentChange"
          />
        </div>
        <div class="d2crudbox" v-if="false">
          <div class="d2crud-title">积分统计明细</div>
          <d2-crud
            class="d2crud"
            :columns="integralColumns"
            :data="integralList"
            :loading="integralLoading"
            :pagination="integralPagination"
            :options="options"
            @pagination-current-change="integralPaginationCurrentChange"
          />
        </div>
        <div>
          <ve-line
            :height="lineHeight"
            :data="chartData1"
            :loading="lineLoading"
            :settings="commonChartSettings"
            :series="time_status=='today'?series1:series11"
            :legend="time_status=='today'?legend1:legend2"
            :colors="time_status=='today'?colors1:colors2"
          ></ve-line>
          <div class="ve-line-subtitle">新用户</div>
        </div>
        <div>
          <ve-line
            :loading="lineLoading"
            :height="lineHeight"
            :data="chartData4"
            :settings="commonChartSettings"
            :series="time_status=='today'?series2:series21"
            :legend="time_status=='today'?legend1:legend2"
            :colors="time_status=='today'?colors1:colors2"
          ></ve-line>
          <div class="ve-line-subtitle">活跃用户</div>
        </div>
        <div>
          <ve-line
            :loading="lineLoading"
            :height="lineHeight"
            :data="chartData3"
            :settings="commonChartSettings"
            :series="time_status=='today'?series3:series31"
            :legend="this.time_status=='today'?legend1:legend2"
            :colors="time_status=='today'?colors1:colors2"
          ></ve-line>
          <div class="ve-line-subtitle">订单数</div>
        </div>
        <div>
          <ve-line
            :loading="lineLoading"
            :height="lineHeight"
            :data="chartData2"
            :settings="commonChartSettings"
            :series="time_status=='today'?series4:series41"
            :legend="this.time_status=='today'?legend1:legend2"
            :colors="time_status=='today'?colors1:colors2"
          ></ve-line>
          <div class="ve-line-subtitle">金额</div>
        </div>
      </div>
    </div>
    <div class="d2-container" v-if="roleid==3">您的权限不足，请联系管理员</div>
  </div>
</template>
<script>
import "v-charts/lib/style.css";
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getTYList } from "@/api/index/getTYList";
import { getNewList } from "@/api/index/getNewList";
import { getActiveUser } from "@/api/index/getActiveUser";
import { getOrderDetails } from "@/api/index/getOrderDetails";
import { getGoodsDetails } from "@/api/index/getGoodsDetails";
import { getIntegralDetails } from "@/api/index/getIntegralDetails";

import { mapState, mapActions } from "vuex";
import util from "@/libs/util.js";

export default {
  data() {
    this.legend1 = {
      data: ["今日", "昨日"]
    };
    this.legend2 = {
      data: ["昨日"]
    };
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.commonChartSettings = {
      labelMap: {
        hour: "日期"
      },
      area: true
    };
    // 活跃用户汇总
    this.chartSettings5 = {
      labelMap: {
        count: "活跃用户汇总"
      },
      dataOrder: {
        label: "count",
        order: "desc"
      }
    };
    // 条形图的颜色
    this.veBarColors = ["#36A4FD"];
    this.series1 = [];
    this.series2 = [];
    this.series3 = [];
    this.series4 = [];
    this.series11 = [];
    this.series21 = [];
    this.series31 = [];
    this.series41 = [];
    return {
      lineLoading: true,
      lineHeight: "600px", //折线图的高度
      pickupOptions: [],
      pickupName: "全部提货点",
      pickupNames: [], //保存所有的提货点
      pid: 0, //当前选中的提货点id

      waitStats: "等待后台统计数据",
      // 顶部表格的加载
      tabLoading: true,
      // 表格列
      tabColumns: [
        "",
        "累积人数",
        "新用户数",
        "活跃人数",
        "订单数",
        "下单人数",
        "下单转化率",
        "忠诚用户占比",
        "订单金额"
      ],
      //
      showData: false,
      colspanNum: 0,
      loading1: true,
      roleid: 0,

      td_newuser_list: [], // 保存新用户的数据
      yt_newuser_list: [], // 保存新用户的数据
      td_money_list: [], // 保存新用户的数据
      yt_money_list: [], // 保存新用户的数据
      td_order_list: [], // 保存新用户的数据
      yt_order_list: [], // 保存新用户的数据
      td_active_list: [], // 保存新用户的数据
      yt_active_list: [], // 保存新用户的数据
      time_status: "today",
      tList: [], // 保存今天的数据
      yList: [], // 保存昨天的数据
      otherList: [], // 保存除了昨天的数据
      chartData1: {
        // columns必须与rows同语言
        columns: ["hour", "td_new_user_num", "yd_new_user_num"],
        rows: []
      },
      chartData2: {
        // columns必须与rows同语言
        columns: ["hour", "td_total_amount", "yd_total_amount"],
        rows: []
      },
      chartData3: {
        // columns必须与rows同语言
        columns: ["hour", "td_order_num", "yd_order_num"],
        rows: []
      },
      chartData4: {
        // columns必须与rows同语言
        columns: ["hour", "td_active_user_num", "yd_active_user_num"],
        rows: []
      },
      newAddList1: [], // 保存新增数据，
      moneyList1: [], // 保存金额数据
      orderNumLIst1: [], // 保存订单数的数据
      activeNumList1: [], // 保存活跃用户的数据
      //
      newAddList2: [], // 保存新增数据，
      moneyList2: [], // 保存金额数据
      orderNumLIst2: [], // 保存订单数的数据
      activeNumList2: [], // 保存活跃用户的数据
      // ↓ 活跃用户的uv汇总和单量汇总
      // crud初始数据
      orderColumns: [
        { title: "工厂", key: "pickup_name" },
        { title: "订单量", key: "order_num" },
        { title: "下单用户", key: "uv_num" }
      ],
      orderList: [],
      orderLoading: true,
      orderPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      options: {
        border: true,
        rowClassName({ row, rowIndex }) {
          if (rowIndex % 2 == 0) {
            return "warning-row";
          }
          return "";
        }
      },
      veBarCurrentPage: 1, // 条形图当前页
      veBarPageSize: 10, // 每页最大条数
      veBarTotal: 0, // 总条数
      // 活跃用户的汇总
      chartData: {
        columns: ["pickup_name", "count"],
        rows: []
      },
      // ↑
      // ↓商品明细
      goodsColumns: [
        { title: "商品", key: "goods_name" },
        { title: "订单量", key: "order_num" },
        { title: "下单用户", key: "order_user_num" }
      ],
      goodsList: [],
      goodsLoading: true,
      goodsPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // ↑

      integralColumns: [
        { title: "工厂", key: "pickup_name" },
        { title: "签到领积分用户数", key: "sign_user_num" },
        { title: "成功下单领积分用户数", key: "order_user_num" },
        { title: "分享任意商品领积分用户数", key: "share_user_num" },
        { title: "帮好友砍价领积分用户数", key: "help_user_num" }
      ],
      integralList: [],
      integralLoading: false,
      integralPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    ...mapState("d2admin/user", ["haveRole"])
  },
  created() {
    // 获取设备的尺寸,如果小于1024，就把折线图的高度改为450px,设表格的最大高度为500px,否则表格的固定高度为500;
    var clientWidth = document.body.clientWidth;
    if (clientWidth < 1024) {
      this.lineHeight = "450px";
      this.options.maxHeight = 500;
    } else {
      this.options.height = 500;
    }
    // 请求所有提货点
    this.allfactory();
    this.funSum();
    this.roleid = util.cookies.get("roleid");
    this.colors1 = ["#58B69C", "#657AD4"];
    this.colors2 = ["#58B69C"];
    setInterval(() => {
      this.funSum();
    }, 120000);
  },
  watch: {
    /* 监听当前提货点的值，如果当前提货点的值发生变化，
    就遍历保存提货点的数组options，找到对应提货点的下标，赋值给pid */
    pickupName() {
      for (var i = 0; i < this.pickupOptions.length; i++) {
        if (this.pickupName == this.pickupOptions[i]) {
          if (i == 0) {
            this.pid = 0;
          } else {
            this.pid = this.pickupNames[i - 1].pickup_id;
          }
        }
      }
      this.funSum();
    }
  },
  methods: {
    //函数汇总，把在created,定时器，watch，需要执行的函数都汇总在funSum，在created..直接调用
    funSum() {
      // 请求首页的最顶部数据
      this.getTYList();
      // 请求下单明细
      this.getOrderDetails();
      // 请求活跃用户汇总数据
      this.getActiveUser();
      // 请求商品明细
      this.getGoodsDetails();
      // 请求积分详情
      this.getIntegralDetails();
      //请求折线图数据
      this.getTodayList();
    },
    // 下拉,上拉触发
    pullDownUp(showData) {
      this.showData = !showData;
    },
    // 转换时间格式
    transformDate(date) {
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m > 0 && m <= 9) {
        m = "0" + m;
      }
      if (d > 0 && d <= 9) {
        d = "0" + d;
      }
      var newDate = m + "-" + d;
      return newDate;
    },
    // 条形图选择页码触发的事件
    handleCurrentChange(val) {
      this.veBarCurrentPage = val;
      this.getActiveUser();
    },
    // 选择页码触发该方法
    orderPaginationCurrentChange(currentPage) {
      this.orderPagination.currentPage = currentPage; // 修改页码
      this.getOrderDetails();
    },
    // 请求所有提货点
    allfactory() {
      getAllFactory().then(res => {
        this.pickupOptions = ["全部提货点"];
        this.pickupNames = res.list;
        for (var i = 0; i < res.list.length; i++) {
          this.pickupOptions.push(res.list[i].pickup_name);
        }
      });
    },
    // 获取今天和昨天的数据
    getTYList() {
      getTYList({
        pickup_id: this.pid
      }).then(res => {
        console.log("res89898989:", res);
        this.yList = [];
        var yesterdayList = res.list[1];
        this.otherList = [];
        for (var i = 0; i < res.list.length; i++) {
          var otherItem = [];
          var date = new Date(res.list[i].date);
          date = this.transformDate(date);
          // 遍历，如果那天的活跃用户数不是没有统计的
          if (res.list[i].active_num != undefined) {
            // 计算下单转化率
            res.list[i].uv_active_to = this.proportion(
              res.list[i].uv_num,
              res.list[i].active_num
            );
            // 计算忠诚用户占比
            res.list[i].loyalty_user_to = this.proportion(
              res.list[i].loyalty_user,
              res.list[i].active_num
            );
            otherItem.push(date);
            otherItem.push(res.list[i].active_user_sum);
            otherItem.push(res.list[i].new_user_num);
            otherItem.push(res.list[i].active_num);
            otherItem.push(res.list[i].order_num);
            otherItem.push(res.list[i].uv_num);
            otherItem.push(res.list[i].uv_active_to);
            otherItem.push(res.list[i].loyalty_user_to);
            otherItem.push(res.list[i].ptm_income);
          } else {
            otherItem.push(date); //没有统计数据就只显示时间和“等待后台统计数据”
          }
          this.otherList.push(otherItem);
        }
        //今天
        this.tList = this.otherList[0];
        this.tList[0] = "今天";
        this.tList[1] = "-";
        // 昨天
        this.yList = this.otherList[1];
        this.yList[0] = "昨天";
        this.otherList.shift(); //删除存储今天数据的数组
        this.otherList.shift(); //删除存储昨天数据的数组
        // 表格数据的加载状态
        this.tabLoading = false;
      });
    },
    // 请求活跃用户汇总
    getActiveUser() {
      getActiveUser({
        page: this.veBarCurrentPage,
        limit: this.veBarPageSize,
        time_status: this.time_status
      }).then(res => {
        this.chartData.rows = res.list;
        this.veBarTotal = res.total;
      });
    },
    // 请求订单明细
    getOrderDetails() {
      this.orderLoading = true;
      getOrderDetails({
        page: this.orderPagination.currentPage,
        limit: this.orderPagination.pageSize,
        time_status: this.time_status
      }).then(res => {
        this.orderLoading = false;
        this.orderList = res.list;
        this.orderPagination.total = res.total;
      });
    },
    // 请求商品明细
    getGoodsDetails() {
      getGoodsDetails({
        page: this.goodsPagination.currentPage,
        limit: this.goodsPagination.pageSize,
        time_status: this.time_status,
        pickup_id: this.pid
      }).then(res => {
        this.goodsList = res.list;
        this.goodsPagination.total = res.total;
        this.goodsLoading = false;
      });
    },
    // 选择商品明细页码触发该方法
    goodsPaginationCurrentChange(currentPage) {
      this.goodsPagination.currentPage = currentPage; // 修改页码
      this.getGoodsDetails();
    },
    //获取积分明细
    getIntegralDetails() {
      getIntegralDetails({
        page: this.integralPagination.currentPage,
        limit: this.integralPagination.pageSize,
        time_status: this.time_status,
        pickup_id: this.pid
      })
        .then(res => {
          this.integralList = res.list;
          this.integralPagination.total = res.total;
          this.integralLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    integralPaginationCurrentChange(currentPage) {
      this.integralPagination.currentPage = currentPage;
      this.getIntegralDetails();
    },
    //点击今天按钮时的今天和昨天的折线图的样式修改
    mychartFunT(list1, list2) {
      var series = [
        {
          type: "line",
          name: "昨日",
          data: list1,
          lineStyle: {
            type: "dashed",
            color: "#5FB8A1"
          },
          areaStyle: {
            color: {
              type: "linear",
              showAllSymbol: true,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#7EDBC4" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#FFFFFF" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          type: "line",
          name: "今日",
          data: list2,
          lineStyle: {
            type: "solid",
            color: "#6486C8"
          },
          areaStyle: {
            color: {
              type: "linear",
              showAllSymbol: true,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#6178EA" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#FFFFFF" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ];
      return series;
    },
    // 点击昨天按钮时的折线图的样式修改
    mychartFunY(list) {
      var series = [
        {
          type: "line",
          name: "昨日",
          data: list,
          lineStyle: {
            type: "solid",
            color: "#5FB8A1"
          },
          areaStyle: {
            color: {
              type: "linear",
              showAllSymbol: true,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#7EDBC4" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#FFFFFF" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ];
      return series;
    },
    // 点击按钮触发的事件
    timeClick(e) {
      if (e == "yesterday") {
        this.time_status = "yesterday";
      } else {
        this.time_status = "today";
      }
      this.veBarCurrentPage = 1;
      this.orderPagination.currentPage = 1;
      this.goodsPagination.currentPage = 1;
      this.integralPagination.currentPage = 1;
      this.getActiveUser();
      this.getOrderDetails();
      this.getGoodsDetails();
      this.getIntegralDetails();
    },
    // 比例计算
    proportion(a, b) {
      var res = a / b;
      if (b == 0 || a == 0) {
        res = 0;
      } else if (res == 1) {
        res = res * 100 + "%";
      } else {
        res = (res * 100).toFixed(2) + "%";
      }
      return res;
    },
    //
    dealWithTYList(obj) {
      var obj1 = {};
      var obj2 = {};
      var obj3 = {};
      var obj4 = {};
      obj1["hour"] = obj.hour;
      obj1["td_new_user_num"] = obj.new_user_num;
      obj2["hour"] = obj.hour;
      obj2["td_total_amount"] = obj.total_amount;
      obj3["hour"] = obj.hour;
      obj3["td_order_num"] = obj.order_num;
      obj4["hour"] = obj.hour;
      obj4["td_active_user_num"] = obj.active_user_num;
      return [obj1, obj2, obj3, obj4];
    },
    // 请求今天的数据
    getTodayList() {
      this.newAddList1 = [];
      this.moneyList1 = [];
      this.orderNumLIst1 = [];
      this.activeNumList1 = [];

      this.td_newuser_list = [];
      this.td_money_list = [];
      this.td_order_list = [];
      this.td_active_list = [];

      this.lineLoading = true;
      getNewList({
        time_status: "today",
        pickup_id: this.pid
      }).then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var arr = this.dealWithTYList(res.list[i]);
          this.newAddList1.push(arr[0]);
          this.moneyList1.push(arr[1]);
          this.orderNumLIst1.push(arr[2]);
          this.activeNumList1.push(arr[3]);
          // 拿到四个数据
          this.td_newuser_list.push(res.list[i].new_user_num);
          this.td_money_list.push(res.list[i].total_amount);
          this.td_order_list.push(res.list[i].order_num);
          this.td_active_list.push(res.list[i].active_user_num);
        }
        this.getYesterdayList();
        this.series1 = this.mychartFunT(
          this.yt_newuser_list,
          this.td_newuser_list
        );
        this.series2 = this.mychartFunT(
          this.yt_active_list,
          this.td_active_list
        );
        this.series3 = this.mychartFunT(this.yt_order_list, this.td_order_list);
        this.series4 = this.mychartFunT(this.yt_money_list, this.td_money_list);
        this.lineLoading = false;
      });
    },
    // 请求昨天的数据
    getYesterdayList() {
      this.newAddList2 = [];
      this.moneyList2 = [];
      this.orderNumLIst2 = [];
      this.activeNumList2 = [];

      this.yt_newuser_list = [];
      this.yt_money_list = [];
      this.yt_order_list = [];
      this.yt_active_list = [];
      getNewList({
        time_status: "yesterday",
        pickup_id: this.pid
      }).then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var arr = this.dealWithTYList(res.list[i]);
          this.newAddList2.push(arr[0]);
          this.moneyList2.push(arr[1]);
          this.orderNumLIst2.push(arr[2]);
          this.activeNumList2.push(arr[3]);

          this.yt_newuser_list.push(res.list[i].new_user_num);
          this.yt_money_list.push(res.list[i].total_amount);
          this.yt_order_list.push(res.list[i].order_num);
          this.yt_active_list.push(res.list[i].active_user_num);
        }
        this.chuli();
        this.series11 = this.mychartFunY(this.yt_newuser_list);
        this.series21 = this.mychartFunY(this.yt_active_list);
        this.series31 = this.mychartFunY(this.yt_order_list);
        this.series41 = this.mychartFunY(this.yt_money_list);
      });
    },
    // 处理
    chuli() {
      for (var i = 0; i < this.newAddList2.length; i++) {
        if (i < this.newAddList1.length) {
          this.newAddList2[i].td_new_user_num = this.newAddList1[
            i
          ].td_new_user_num;
          this.moneyList2[i].td_total_amount = this.moneyList1[
            i
          ].td_total_amount;
          this.orderNumLIst2[i].td_order_num = this.orderNumLIst1[
            i
          ].td_order_num;
          this.activeNumList2[i].td_active_user_num = this.activeNumList1[
            i
          ].td_active_user_num;
        } else {
          this.newAddList2[i].td_new_user_num = 0;
          this.moneyList2[i].td_total_amount = 0;
          this.orderNumLIst2[i].td_order_num = 0;
          this.activeNumList2[i].td_active_user_num = 0;
        }
      }
      this.loading1 = false;
      this.chartData1.rows = this.newAddList2;
      this.chartData2.rows = this.moneyList2;
      this.chartData3.rows = this.orderNumLIst2;
      this.chartData4.rows = this.activeNumList2;
    }
  }
};
</script>

<style lang="scss" >
// @media screen and (max-width: 1100px) {
.el-pagination__rightwrapper {
  float: none !important;
}
.el-pagination {
  white-space: inherit !important;
}
.el-pagination__jump {
  margin-left: 0;
}
// }
// background-color:#EFEFEF !important
@media screen and (max-width: 1024px) {
  // 分页
  .el-pagination__rightwrapper {
    float: none !important;
  }
  .el-pagination {
    white-space: inherit !important;
  }
  .el-pagination__jump {
    margin-left: 0;
  }
  .tab-box {
    overflow-x: scroll;
  }
  .tab {
    min-width: 600px;
  }
  .tab > tr > td {
    font-size: 12px;
  }
  .tab > tr:nth-child(2) > td:not(:first-child) {
    font-size: 16px !important;
  }
  .tab > tr > td > .img {
    width: 10px;
    height: 10px;
  }
  // 提货点
  .pickup-points-box {
    margin-left: 5px;
  }
  //统计图大盒子
  .chart-box {
    flex-direction: column;
  }
  .chart-box > div {
    width: 100% !important;
  }
  // 表格
  .d2crud {
    width: 95% !important;
  }
  // 梯形图
  .bar-veline {
    padding-right: 5px !important;
  }
}
// ↑移动端适配
// 提货点
.pickup-points-box {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}
.pickup-points{
  margin-right:5px
}
.bgcolor {
  background-color: #fff;
}
.first-ve-line {
  margin-top: 10px;
}
.tab {
  width: 100%;
  text-align: center;
  border: 5px solid #efefef;
  // box-shadow:3px -2px 14px 6px #ccc inset
}
// 选择每个tr元素是其母元素的最后一个tr元素
.tab > tr:not(:last-of-type):hover {
  background-color: #eef3fa;
}
.tab > tr > td > .img:hover {
  height: 25px;
  transition: 1s;
}
.tab > tr {
  height: 50px;
  line-height: 50px;
}
.tab > tr > td > .img {
  width: 20px;
  height: 20px;
}
.tab > tr:nth-child(2) > td:not(:first-child) {
  font-size: 30px;
  font-weight: bold;
}
// 时间按钮
.btn-box {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 10px;
  margin-left: 5px;
}
.btn-box > div {
  width: 50px;
  height: 25px;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #efefef;
  border-radius: 3px;
  cursor: pointer;
}
.chart-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.chart-box > div {
  width: 45%;
}
.barbox {
  position: relative;
  .barbox-notData {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -30px;
    color: #333;
  }
  .bar-veline {
    height: 600px;
  }
  .barbox-branchPage {
    position: relative;
    bottom: 20px;
    display: flex;
    justify-content: center;
  }
}
.d2crudbox {
  display: flex;
  justify-content: center;
  padding-top: 45px;
  position: relative;
  .d2crud-title {
    position: absolute;
    top: 20px;
    text-align: center;
    border-left: 3.5px solid #409eff;
    padding-left: 10px;
  }
  .d2crud {
    width: 100%;
  }
}
// 按钮
.active {
  background-color: #409eff;
  color: #fff;
}
.ve-line {
  margin-top: 20px;
}
.ve-line-subtitle {
  color: #565656;
  font-size: 12px;
  font-weight: 500;
  padding-top: 10px;
  padding-bottom: 15px;
  text-align: center;
  margin-top: -50px;
}
.order-money-box {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
}
.order-money-item {
  width: 50%;
  height: 100%;
  @media screen and (max-width: 1024px) {
    width: 100% !important;
  }
}
// d2-crud的状态表格
.el-table .warning-row {
  background: #f7f7f7;
}
</style>
