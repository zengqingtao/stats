<template>
  <d2-container>
    <template slot="header">实时日订单分析</template>
    <!-- 顶部 -->
    <div class="header">
      <div class="pickup-points-box">
        <div class="pickup-points">提货点</div>
        <el-select class="pickup-points-option" v-model="factory" placeholder="请选择">
          <el-option v-for="(item,i) in options" :key="i" :value="item"></el-option>
        </el-select>
      </div>
      <div class="statisticsTime">
        <div class="time-title">统计时间</div>
        <div class="block">
          <el-time-select
            @change="startChange"
            placeholder="00:00"
            v-model="startTime"
            :picker-options="startTimeOptions"
          ></el-time-select>
          <span>~</span>
          <el-time-select
            @change="endChange"
            :placeholder="endTimeOptions.end"
            v-model="endTime"
            :picker-options="endTimeOptions"
          ></el-time-select>
        </div>
        <div class="search-reset">
          <el-button class="search-reset-btn" type="success" @click="handleSearch">搜索</el-button>
          <el-button class="search-reset-btn" type="danger" @click="handleReset">重置</el-button>
          <el-button class="search-reset-btn" type="primary" @click="exportData">导出数据</el-button>
        </div>
      </div>
    </div>
    <!-- 统计图部分 -->
    <div class="statisticalChart">
      <ve-line
        v-if="!isNull"
        class="ve-line"
        :data="chartData"
        :loading="loading"
        :settings="chartSettings"
      ></ve-line>
      <div v-if="isNull" class="statisticalChart-img-box">
        <img class="statisticalChart-img" src="../../../public/image/notData.png" />
      </div>
    </div>
    <!-- 表格部分 此处自定义的和分页的还没添加-->
    <div>
      <d2-crud
        :columns="crudColumns"
        :data="crudList"
        :loading="loading"
        :rowHandle="rowHandle"
        @custom-emit-1="handleCustomEvent"
      />
    </div>
  </d2-container>
</template>

<script>
import "v-charts/lib/style.css";
import { getAllFactory } from "@/api/factory/getAllFactory";
import { realTimeOrderAnalysis } from "@/api/stats/realTimeOrderAnalysis";
import setColWidth from "../mixins/setColwidth";
export default {
  name: "realTimeReport",
  mixins:[setColWidth],
  data: function() {
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings = {
      labelMap: {
        hour: "日期",
        new_user: "新注册用户数",
        active_user: "活跃用户数",
        order_num: "付款订单数",
        uv_num: "付款用户数",
        uv_order_ratio: "付款订单数/付款用户数",
        ptm_income: "日收入",
        arpu_num: "客单价"
      }
    };
    return {
      isNull: false, //是否有数据的显示开关
      options: [],
      factory: "全部提货点",
      factorys: [], //保存所有的提货点
      fid: 0, //保存当前提货点id
      chartData: {
        //columns必须与rows同语言
        columns: [
          "hour",
          "new_user",
          "active_user",
          "order_num",
          "uv_num",
          "uv_order_ratio",
          "ptm_income",
          "arpu_num"
        ],
        rows: []
      },
      // crud初始数据
      crudColumns: [
        { title: "时间", key: "hour" },
        { title: "新注册用户数", key: "new_user" },
        { title: "活跃用户数", key: "active_user" },
        { title: "付款订单数", key: "order_num" },
        { title: "付款用户数", key: "uv_num" },
        { title: "付款订单数/付款用户数", key: "uv_order_ratio" },
        { title: "日收入", key: "ptm_income" },
        { title: "客单价", key: "arpu_num" }
      ],
      crudList: [],
      loading: true,
      // 自定义
      rowHandle: {
        custom: [
          {
            text: "详细信息",
            type: "success",
            size: "small",
            emit: "custom-emit-1"
          }
        ]
      },
      startTime: "00:00", //起始时间
      endTime: "00:00", //结束时间
      startTimeOptions: {
        start: "00:00",
        step: "01:00",
        end: "00:00"
      },
      endTimeOptions: {
        start: "00:59",
        step: "01:00",
        end: "00:00",
        minTime: "00:00"
      },
      nowHour: 0,
      endPlaceholder: "00:00",
      // 导出数据的列
      exportColumns: [
        { 
          label: "时间",
          prop: "hour"
        },
        {
          label: "新注册用户数",
          prop: "new_user"
        },
        {
          label: "活跃用户数",
          prop: "active_user"
        },
        {
          label: "付款订单数",
          prop: "order_num"
        },
        {
          label: "付款用户数",
          prop: "uv_num"
        },
        {
          label: "付款订单数/付款用户数",
          prop: "uv_order_ratio"
        },
        {
          label: "日收入",
          prop: "ptm_income"
        },
        {
          label: "客单价",
          prop: "arpu_num"
        }
      ]
    };
  },
  created() {
    this.getNowHour();
    this.allfactory();
    this.realTimeOrderAnalysis();
    this.setColWidth(100)
    setInterval(() => {
      // 每分钟定时执行，如果当前小时与原来的不相等，就重新执行请求页面所有数据的方法
      var hour = new Date().getHours();
      if (this.nowHour != hour) {
        this.getNowHour();
        this.allfactory();
        this.realTimeOrderAnalysis();
      }
    }, 60000);
  },
  watch: {
    /* 监听当前提货点的值，如果当前提货点的值发生变化，
    就遍历保存提货点的数组options，找到对应提货点的下标，赋值给fid*/
    factory() {
      for (var i = 0; i < this.options.length; i++) {
        if (this.factory == this.options[i]) {
          if (i == 0) {
            this.fid = 0;
          } else {
            this.fid = this.factorys[i - 1].pickup_id;
          }
        }
      }
      this.realTimeOrderAnalysis();
    }
  },
  methods: {
    // 获取当前时间
    getNowHour() {
      var hour = new Date().getHours();
      this.nowHour = hour;
      if (hour <= 9) {
        hour = "0" + hour + ":59";
      } else {
        hour = hour + ":59";
      }
      this.endTime = hour;
      this.startTimeOptions.end = hour;
      this.endTimeOptions.end = hour;
    },
    // 选择开始时间的
    startChange(e) {
      this.startTime = e;
      this.endTimeOptions.minTime = e;
    },
    endChange(e) {
      this.endTime = e;
    },
    // 请求所有提货点
    allfactory() {
      getAllFactory()
        .then(res => {
          this.options = ["全部提货点"];
          this.factorys = res.list;
          for (var i = 0; i < res.list.length; i++) {
            this.options.push(res.list[i].pickup_name);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 请求统计数据
    realTimeOrderAnalysis() {
      this.loading = true;
      realTimeOrderAnalysis({
        pickup_id: this.fid, //提货点id
        start_date: this.startTime,
        end_date: this.endTime
      })
        .then(res => {
          this.chartData.rows = [];
          // 遍历计算每一条数据的客单价（客单价等于日收入/付款用户）
          for (var i = 0; i < res.list.length; i++) {
            var ptm_income = res.list[i].ptm_income;
            var uv_num = res.list[i].uv_num;
            if (ptm_income == 0 || uv_num == 0) {
              res.list[i].arpu_num = 0;
            } else {
              var arpu_num = ptm_income / uv_num;
              arpu_num = arpu_num.toFixed(2);
              res.list[i].arpu_num = arpu_num;
            }
          }
          // 遍历把数据倒序,push到折线图chartData.rows
          for (var i = res.list.length - 1; i >= 0; i--) {
            this.chartData.rows.push(res.list[i]);
          }
          this.crudList = res.list;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 搜索
    handleSearch() {
      this.realTimeOrderAnalysis();
    },
    // 重置
    handleReset() {
      // 重置时间，然后请求统计数据
      this.startTime = "00:00";
      this.endTime = this.endTimeOptions.end;
      this.realTimeOrderAnalysis();
    },
    //d2-crud表的自定义点击事件
    handleCustomEvent({ index, row }) {
      this.$router.push({
        name: "realTimeReportInfo",
        query: {
          //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
          time: row.hour,
          pickup_name: this.factory,
          pickup_id: this.fid
        }
      });
    },
    // 导出数据
    exportData() {
      console.log("crud",this.crudList);
      for (var i = 0; i < this.crudList.length; i++) {
        for (var j in this.crudList[i]) {
          if (j != "hour" && this.crudList[i][j] !== "") {
            this.crudList[i][j] = Number(this.crudList[i][j]);
          }
        }
      }
      this.$export.excel({
          columns: this.exportColumns,
          data: this.crudList,
          title: "实时日订单分析"
        })
        .then(() => {
          this.$message("导出成功");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 1050px) {
  .header {
    padding-left: 10px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 135px !important;
  }
  .statisticsTime {
    flex-wrap: wrap;
    padding-top: 10px;
    width: 100%;
  }
  .time-title {
    font-size: 12px;
    padding-left: 3px;
  }
  .search-reset {
    padding-top: 10px;
    margin-left: 0 !important;
    width: 100%;
  }
  .search-reset-btn {
    width: 30%;
  }
}
.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
/* 提货点大盒子 */
.pickup-points-box {
  display: flex;
  align-items: center;
}
/* 提货点 */
.pickup-points {
  min-width: 50px;
  margin-right: 10px;
}
/* 提货点的选项盒子 */
.pickup-points-option {
  min-width: 120px;
  margin-right: 20px;
}
.statisticsTime {
  display: flex;
  align-items: center;
}
.search-reset {
  margin-left: 10px;
}
/* 统计折线图 */
.statisticalChart {
  margin-top: 20px;
}
.statisticalChart-img-box {
  display: flex;
  justify-content: center;
}
</style>