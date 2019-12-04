<template>
  <d2-container>
    <template slot="header">新用户订单</template>
    <div class="header">
      <div class="selectBtn-box">
        <el-radio-group v-model="tabPosition" @change="selectRadioBtn">
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="nearly7days">最近7天</el-radio-button>
          <el-radio-button label="nearly30days">最近30天</el-radio-button>
        </el-radio-group>
      </div>
      <div class="source-box">
        <div class="source">来源：</div>
        <el-select class="source-option" v-model="source" placeholder="请选择">
          <el-option v-for="(item,i) in options1" :key="i" :value="item"></el-option>
        </el-select>
        <div class="source">提货点：</div>
        <el-select class="source-option" v-model="factory" placeholder="请选择">
          <el-option v-for="(item,i) in options" :key="i" :value="item"></el-option>
        </el-select>
        <el-button class="source-option export-btn" type="primary" @click="exportData">导出数据</el-button>
      </div>
    </div>
    <!-- 曲线图 -->
    <div class="statisticalChart">
      <ve-line v-if="!isNull" class="ve-line" :data="chartData" :settings="chartSettings"></ve-line>
      <div v-if="isNull" class="statisticalChart-img-box">
        <img class="statisticalChart-img" src="../../../public/image/notData.png" />
      </div>
    </div>
    <!-- 表格 -->
    <div>
      <d2-crud :columns="crudColumns" :data="crudList" />
    </div>
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getUserReportList } from "@/api/user/getUserReportList";
export default {
  data() {
    this.chartSettings = {
      labelMap: {
        user_order_num: "订单数"
      },
      itemStyle: {
        normal: {
          color: "#5580e5", //改变折线点的颜色
          lineStyle: {
            color: "#5580e5" //改变折线颜色
          }
        }
      },
      // 线背景渐变
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
              color: "#5580e5" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#c0ceea" // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        }
      }
    };
    return {
      isNull: false, //是否有数据的显示开关
      start_num: "3", //初始请求数据
      tabPosition: "nearly30days",
      source: "全部",
      options: [],
      factory: "全部提货点",
      factorys: [], //保存所有的提货点
      fid: 0, //保存当前提货点的id(来源)
      sid: 0, //渠道id
      options1: ["全部", "红包", "砍价", "其他"],
      chartData: {
        //天数 订单
        columns: ["date", "user_order_num"],
        rows: [
          { date: "1日", user_order_num: "" },
          { date: "2日", user_order_num: "" },
          { date: "3日", user_order_num: "" },
          { date: "4日", user_order_num: "" },
          { date: "5日", user_order_num: "" },
          { date: "6日", user_order_num: "" },
          { date: "7日", user_order_num: "" },
          { date: "14日", user_order_num: "" },
          { date: "30日", user_order_num: "" }
        ]
      },
      crudColumns: [
        { title: "日期", key: "date" },
        { title: "新用户数", key: "new_user_num" },
        { title: "1日", key: "that_very_day" },
        { title: "2日", key: "after_one_day" },
        { title: "3日", key: "after_two_day" },
        { title: "4日", key: "after_three_day" },
        { title: "5日", key: "after_four_day" },
        { title: "6日", key: "after_five_day" },
        { title: "7日", key: "after_six_day" },
        { title: "14日", key: "seven_to_fourteen" },
        { title: "30日", key: "fifteen_to_thirty" }
      ],
      crudList: [],
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
          label: "1日",
          prop: "that_very_day"
        },
        {
          label: "2日",
          prop: "after_one_day"
        },
        {
          label: "3日",
          prop: "after_two_day"
        },
        {
          label: "4日",
          prop: "after_three_day"
        },
        {
          label: "5日",
          prop: "after_four_day"
        },
        {
          label: "6日",
          prop: "after_five_day"
        },
        {
          label: "7日",
          prop: "after_six_day"
        },
        {
          label: "14日",
          prop: "seven_to_fourteen"
        },
        {
          label: "30日",
          prop: "fifteen_to_thirty"
        }
      ]
    };
  },
  created() {
    this.allfactory();
    this.userReportList();
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
      this.userReportList();
    },
    source() {
      for (var i = 0; i < this.options1.length; i++) {
        if (this.source == this.options1[i]) {
          this.sid = i;
        }
      }
      this.userReportList();
    }
  },
  methods: {
    // 查询按钮
    selectRadioBtn(e) {
      console.log("触发单选按钮");
      let selcetbtn = e;
      console.log(selcetbtn);
      switch (selcetbtn) {
        case "yesterday":
          this.start_num = 1;
          break;
        case "nearly7days":
          this.start_num = 2;
          break;
        case "nearly30days":
          this.start_num = 3;
          break;
      }
      this.userReportList();
    },
    // 请求所有提货点
    allfactory() {
      getAllFactory()
        .then(res => {
          this.options = ["全部"];
          this.factorys = res.list;
          for (var i = 0; i < res.list.length; i++) {
            this.options.push(res.list[i].pickup_name);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    userReportList() {
      getUserReportList({
        start_num: this.start_num, //开始时间
        pickup_id: this.fid, //当前提货点id
        users_source: this.sid
      }).then(res => {
        res.list == null ? (this.isNull = true) : (this.isNull = false); //没有数据显示图片
        this.crudList = res.list;
        let rowsdata = res.list[res.list.length - 1];
        this.chartData.rows[0].user_order_num = rowsdata.that_very_day;
        this.chartData.rows[1].user_order_num = rowsdata.after_one_day;
        this.chartData.rows[2].user_order_num = rowsdata.after_two_day;
        this.chartData.rows[3].user_order_num = rowsdata.after_three_day;
        this.chartData.rows[4].user_order_num = rowsdata.after_four_day;
        this.chartData.rows[5].user_order_num = rowsdata.after_five_day;
        this.chartData.rows[6].user_order_num = rowsdata.after_six_day;
        this.chartData.rows[7].user_order_num = rowsdata.seven_to_fourteen;
        this.chartData.rows[8].user_order_num = rowsdata.fifteen_to_thirty;
        // console.log(this.rowsdata);
      });
    },
    //导出数据
    exportData() {
      for(var i=0;i<this.crudList.length;i++){
        for(var j in this.crudList[i]){
          if(j!="date"&&this.crudList[i][j]!==""){
            this.crudList[i][j] = Number(this.crudList[i][j]);
          }
        }
      }
      this.$export
        .excel({
          columns: this.exportColumns,
          data: this.crudList,
          title: `${this.factory}${this.source}来源新用户订单`
        })
        .then(() => {
          this.$message("导出成功");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  margin-bottom: 15px;
  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
  }
}
.selectBtn-box {
  display: flex;
  @media screen and (max-width: 480px) {
    margin: 5px 0 0 5px;
  }
  .el-radio-group {
    display: flex;
  }
}
/* 来源大盒子 */
.source-box {
  display: flex;
  align-items: center;
  margin-left: 20px;
  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
    margin-left: 5px;
    margin-top: 5px;
  }
}
/* 来源 */
.source {
  min-width: 50px;
  margin-right: 10px;
  @media screen and (max-width: 480px) {
    font-size: 12px;
    margin-right: 0;
  }
}
/* 来源的选项盒子 */
.source-option {
  margin-right: 20px;
  @media screen and (max-width: 480px) {
    width: 110px;
  }
}
.export-btn {
  @media screen and (max-width: 480px) {
    margin-top: 5px;
  }
}
</style>