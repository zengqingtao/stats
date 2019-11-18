<template>
  <d2-container>
    <template slot="header">日订单分析</template>
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
          <el-date-picker v-model="start_time" type="date" placeholder="选择日期"></el-date-picker>
          <span>~</span>
          <el-date-picker v-model="end_time" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div class="search-reset">
          <el-button class="search-reset-btn" type="success" @click="formData">搜索</el-button>
          <el-button class="search-reset-btn" type="danger" @click="reset">重置</el-button>
          <el-button class="search-reset-btn" type="primary" @click="exportData">导出数据</el-button>
        </div>
      </div>
    </div>
    <!-- 统计图部分 -->
    <div class="statisticalChart">
      <ve-line v-if="!isNull" class="ve-line" :data="chartData" :settings="chartSettings"></ve-line>
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
        :pagination="pagination"
        :rowHandle="rowHandle"
        @custom-emit-1="handleCustomEvent"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getPlatformReportList } from "@/api/stats/getPlatformReportList";
import setColWidth from "../mixins/setColwidth";
export default {
  name: "platformReport",
  mixins:[setColWidth],
  data: function() {
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings = {
      labelMap: {
        date: "日期",
        active_user_sum: "累积人数",
        new_user_num: "新注册用户数",
        active_num: "活跃用户数",
        order_num: "付款订单数",
        uv_num: "付款用户数",
        uv_order_to: "付款订单数/付款用户数",
        uv_ac_to: "下单转化率",
        loyalty_decimal_to:"忠诚用户占比",
        ptm_income: "日收入",
        arpu_num: "客单价"
      }
    };
    return {
      isNull: false, //是否有数据的显示开关
      options: [],
      factory: "全部提货点",
      factorys: [], //保存所有的提货点
      fid: 0, //保存当前提货点的id
      start_time: "",
      end_time: "",
      chartData: {
        //columns必须与rows同语言
        columns: [
          "date",
          "new_user_num",
          "active_num",
          "order_num",
          "uv_num",
          "uv_order_to",
          "uv_ac_to",
          "loyalty_decimal_to",
          "ptm_income",
          "arpu_num"
        ],
        rows: []
      },
      // crud初始数据
      crudColumns: [
        { title: "日期", key: "date" },
        { title: "累积人数", key: "active_user_sum" },
        { title: "新注册用户数", key: "new_user_num" },
        { title: "活跃用户数", key: "active_num" },
        { title: "付款订单数", key: "order_num" },
        { title: "付款用户数", key: "uv_num" },
        { title: "付款订单数/付款用户数", key: "uv_order_to" },
        { title: "下单转化率", key: "uv_active_to" },
        {title:"忠诚用户占比",key:"loyalty_user_to"},
        { title: "日收入", key: "ptm_income" },
        { title: "客单价", key: "arpu_num" }
      ],
      crudList: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
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
      // 导出数据的列
      exportColumns: [
        {
          label: "日期",
          prop: "date"
        },
        {
          label: "累积人数",
          prop: "active_user_sum"
        },
        {
          label: "新注册用户数",
          prop: "new_user_num"
        },
        {
          label: "活跃用户数",
          prop: "active_num"
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
          prop: "uv_order_to"
        },
        {
          label: "下单转化率",
          prop: "uv_active_to"
        },
        {
          label:"忠诚用户占比",
          prop:"loyalty_user_to"
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
    this.setDefaultTime();
    this.allfactory();
    this.platformReportList();
    this.setColWidth(100)
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
      this.platformReportList();
    }
  },
  methods: {
    // 转换时间格式
    transformTime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m > 0 && m <= 9) {
        m = "0" + m;
      }
      if (d > 0 && d <= 9) {
        d = "0" + d;
      }
      var newDate = y + "-" + m + "-" + d;
      return newDate;
    },
    // 比例计算,list是数组,a分子，b分母，decimal小数，percentage百分比
    proportion( a, b) {
      var decimal,percentage;
      var res = a / b;
      var decimal = res.toFixed(2);
      if (a== 0 || b == 0) {
        decimal = 0;
        percentage = "0";
      } else if (res == 1) {
        percentage = res * 100 + "%";
      } else {
        percentage = (res * 100).toFixed(2) + "%";
      }
      return {decimal,percentage}
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
    platformReportList() {
      this.chartData.rows = [];
      getPlatformReportList({
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //当前页码数据最大条数
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time),
        pickup_id: this.fid //当前提货点id
      })
        .then(res => {
          console.log("res--=",res);
          res.list.length == 0 ? (this.isNull = true) : (this.isNull = false); //没有数据显示图片
          for (var i = 0; i < res.list.length; i++) {
            // 计算下单转化率，付款用户数/活跃用户数
            var order_rate_obj = this.proportion(res.list[i].uv_num,res.list[i].active_num)
            res.list[i].uv_active_to = order_rate_obj.percentage;
            res.list[i].uv_ac_to = order_rate_obj.decimal;
            // 计算忠诚用户占比
            var loyaltyUser_obj = this.proportion(res.list[i].loyalty_user,res.list[i].active_num);
            res.list[i].loyalty_user_to=loyaltyUser_obj.percentage;
            res.list[i].loyalty_decimal_to=loyaltyUser_obj.decimal;
          }
          //把数据分别赋值给折线图的rows和d2-crud表的crudList
          for (var i = res.list.length - 1; i >= 0; i--) {
            this.chartData.rows.push(res.list[i]);
          }
          this.crudList = res.list;
          this.pagination.total = res.total; //修改d2-crud表的总条数
        })
        .catch(err => {
          console.log(err);
        });
    },
    //d2-crud表的自定义点击事件
    handleCustomEvent({ index, row }) {
      this.$router.push({
        name: "platformReportInfo",
        query: {
          //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
          date: row.date,
          pickup_name: this.factory,
          pickup_id: this.fid
        }
      });
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage; //修改页码
      this.platformReportList();
      // this.currentPageChange();
    },
    // 设置默认时间
    setDefaultTime() {
      const start_date = new Date();
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 15); //设置时间为昨天的前十五天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      this.start_time = start_date;
      this.end_time = end_date;
    },
    // 点击搜索
    formData() {
      this.pagination.currentPage = 1;
      this.platformReportList();
    },
    // 点击重置触发的方法
    reset() {
      this.pagination.currentPage = 1;
      this.setDefaultTime();
      this.formData();
    },
    //点击导出数据
    exportData() {
      getPlatformReportList({
        page: 1, //当前页码
        limit: this.pagination.total, //当前页码数据最大条数
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time),
        pickup_id: this.fid //当前提货点id
      }).then(res => {
        // 保存数据给导出使用
        for (var i = 0; i < res.list.length; i++) {
          // ↓计算转化率
          res.list[i].uv_active_to = this.proportion(res.list[i].uv_num,res.list[i].active_num).percentage;
          res.list[i].loyalty_user_to=this.proportion(res.list[i].loyalty_user,res.list[i].active_num).percentage;
          // ↑
          // res.list[i].active_user_sum = Number(res.list[i].active_user_sum);
          // res.list[i].new_user_num = Number(res.list[i].new_user_num);
          // res.list[i].active_num = Number(res.list[i].active_num);
          // res.list[i].order_num = Number(res.list[i].order_num);
          // res.list[i].uv_num = Number(res.list[i].uv_num);
          // res.list[i].uv_order_to = Number(res.list[i].uv_order_to);
          // res.list[i].ptm_income = Number(res.list[i].ptm_income);
          // res.list[i].arpu_num = Number(res.list[i].arpu_num);
        }
        this.$export
          .excel({
            columns: this.exportColumns,
            data: res.list,
            title: "日订单分析"
          })
          .then(() => {
            this.$message("导出成功");
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 480px) {
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
    width: 25%;
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