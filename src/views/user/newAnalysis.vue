<template>
  <d2-container>
    <template slot="header">新增分析</template>
    <!-- 顶部 -->
    <div class="header">
      <div class="statisticsTime">
        <div class="time-title">统计时间</div>
        <div class="block">
          <el-date-picker v-model="start_time" type="date" placeholder="选择日期"></el-date-picker>
          <span>~</span>
          <el-date-picker v-model="end_time" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div class="search-reset">
          <el-button class="search-reset-btn" type="success" @click="platformReportList">搜索</el-button>
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
        :options="crudoptions"
      />
    </div>
  </d2-container>
</template>

<script>
import { getNewAnalysis } from "@/api/user/getNewAnalysis";
import setColWidth from "../mixins/setColwidth" //操作列列宽
export default {
  name: "newAnalysis",
  mixins:[setColWidth],
  data: function() {
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings = {
      labelMap: {
        date: "日期",
        new_user_num: "新用户数",
        uv_num: "下单用户数",
        order_num: "订单数",
        order_sum: "订单总额"
      }
    };
    return {
      // crudoptions:{height:'450'},
      isNull: false, //是否有数据的显示开关
      options: [],
      start_time: "",
      end_time: "",
      chartData: {
        //columns必须与rows同语言
        columns: ["date", "new_user_num", "uv_num", "order_num", "order_sum"],
        rows: []
      },
      // crud初始数据
      crudColumns: [
        { title: "日期", key: "date" },
        { title: "新用户数", key: "new_user_num" },
        { title: "下单用户数", key: "uv_num" },
        { title: "订单数", key: "order_num" },
        { title: "订单总额", key: "order_sum" }
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
          label: "新用户数",
          prop: "new_user_num"
        },
        {
          label: "下单用户数",
          prop: "uv_num"
        },
        {
          label: "订单数",
          prop: "order_num"
        },
        {
          label: "订单总额",
          prop: "order_sum"
        }
      ]
    };
  },
  created() {
    this.setDefaultTime();
    this.platformReportList();
    this.setColWidth(100)
  },
  watch: {},
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
    // 请求统计数据
    platformReportList() {
      this.chartData.rows = [];
      getNewAnalysis({
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //当前页码数据最大条数
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time)
      }).then(res => {
        res.list.length == 0 ? (this.isNull = true) : (this.isNull = false); //没有数据显示图片
        //把数据分别赋值给折线图的rows和d2-crud表的crudList
        for (var i = res.list.length - 1; i >= 0; i--) {
          this.chartData.rows.push(res.list[i]);
        }
        this.crudList = res.list;
        this.pagination.total = res.total; //修改d2-crud表的总条数
      });
    },
    //d2-crud表的自定义点击事件
    handleCustomEvent({ index, row }) {
      this.$router.push({
        name: "newAnalysisInfo",
        query: {
          //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
          date: row.date
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
    // 点击重置触发的方法
    reset(){
      this.pagination.currentPage = 1;
      this.setDefaultTime();
      this.platformReportList();
    },
    // 导出数据
    exportData() {
      getNewAnalysis({
        page: 1, //当前页码
        limit: this.pagination.total, //当前页码数据最大条数
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time)
      }).then(res => {
        // res.list.new_user_num = Number(res.list.new_user_num);
        // res.list.uv_num = Number(res.list.uv_num);
        // res.list.order_num = Number(res.list.order_num);
        // res.list.order_sum = Number(res.list.order_sum);
        this.$export.excel({
            columns: this.exportColumns,
            data: res.list,
            title: "新增分析"
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
    width: 30%;
  }
}
.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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