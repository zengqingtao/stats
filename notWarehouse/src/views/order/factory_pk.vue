<template>
  <d2-container>
    <template slot="header">厂区PK</template>
    <!-- 顶部 -->
    <div class="headers">
      <!--            <div class="pickup-points-box">-->
      <!--                <div class="pickup-points">提货点</div>-->
      <!--                <el-select class="pickup-points-option" v-model="factory" placeholder="请选择">-->
      <!--                    <el-option v-for="(item,i) in options" :key="i" :value="item"></el-option>-->
      <!--                </el-select>-->
      <!--            </div>-->

      <!--pk指标选择-->
      <div class="pickup-points-box pk-pick">
        <div class="pickup-points">PK指标:</div>
        <el-select class="pickup-points-option" v-model="target" placeholder="请选择">
          <el-option v-for="(item,i) in target_options" :key="i" :value="item"></el-option>
        </el-select>
      </div>

      <!--厂区选择-->
      <div class="factorySlect">
        <!-- 厂区一的时间选择框-->
        <div class="fact01_box fact_box">
          <div>活动时间：</div>
          <div class="block">
            <el-date-picker v-model="fact01_start_time" type="date" placeholder="选择日期"></el-date-picker>
            <span>~</span>
            <el-date-picker v-model="fact01_end_time" type="date" placeholder="选择日期"></el-date-picker>
          </div>
          <!--pk厂区一选择-->
          <div class="pickup-points-box">
            <div class="pickup-points">厂区一</div>
            <el-select class="pickup-points-option" v-model="factory01" placeholder="请选择">
              <el-option v-for="(item,i) in fact01_options" :key="i" :value="item"></el-option>
            </el-select>
          </div>
        </div>

        <div class="fact02_box fact_box">
          <div>活动时间：</div>
          <div class="block">
            <el-date-picker v-model="fact02_start_time" type="date" placeholder="选择日期"></el-date-picker>
            <span>~</span>
            <el-date-picker v-model="fact02_end_time" type="date" placeholder="选择日期"></el-date-picker>
          </div>
          <!--pk厂区二选择-->
          <div class="pickup-points-box">
            <div class="pickup-points">厂区二</div>
            <el-select class="pickup-points-option" v-model="factory02" placeholder="请选择">
              <el-option v-for="(item,i) in fact02_options" :key="i" :value="item"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <!--按钮-->
      <div class="statisticsTimes">
        <!--                <div>统计时间</div>-->
        <!--                <div class="block">-->
        <!--                    <el-date-picker v-model="start_time" type="date" placeholder="选择日期"></el-date-picker>-->
        <!--                    <span>~</span>-->
        <!--                    <el-date-picker v-model="end_time" type="date" placeholder="选择日期"></el-date-picker>-->
        <!--                </div>-->
        <div class="btngroup">
          <el-button type="success" @click="platformReportList">搜索</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
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
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getpkData } from "@/api/commodityList/factory_pk";
import { getpk_target } from "@/api/commodityList/pk_target";

export default {
  name: "factory_pk",
  data: function() {
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings = {
      // metrics: ['厂区一', '厂区二'],
      // dimension: ['日期'],
      labelMap: {
        day: "日期",
        one_num: "厂区一",
        two_num: "厂区二"
        // order_num: "付款订单数",
        // uv_num: "付款用户数",
        // uv_order_to: "付款订单数/付款用户数",
        // ptm_income: "日收入",
        // arpu_num: "ARPU"
      }
    };
    return {
      target: "请选择指标", //pk指标的名字
      targets: [], //保存所有pk指标的对象
      target_options: [], //保存所有pk指标的名字
      pk_id: null, //pk指标的ID
      crudoptions: { height: "450" },
      isNull: true, //是否有数据的显示开关

      fact01_options: [], //选框一的所有工厂名字
      fact02_options: [], //选框二的所有工厂名字

      factory01: "", //保存第一个提货点选框的名字
      factorys01: [], //保存第一个提货点选框的所有提货点对象

      factory02: "", //保存第二个提货点选框的名字
      factorys02: [], //保存第二个提货点选框的所有提货点对象

      fid01: null, //保存第一个提货点的id
      fid02: null, //保存第二个提货点的id

      fact01_start_time: "", //厂一起点时间
      fact01_end_time: "", //厂一截止时间

      fact02_start_time: "", //厂二起点时间
      fact02_end_time: "", //厂一截止时间
      chartData: {
        //columns必须与rows同语言
        columns: ["day", "one_num", "two_num"],
        rows: []
      },
      crudList: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      }
    };
  },
  created() {
    var _this = this;
    this.setDefaultTime();
    this.allfactory();
    setTimeout(function() {
      _this.getpktarget();
    }, 200);


    this.platformReportList();
  },
  watch: {
    /* 监听当前提货点的值，如果当前提货点的值发生变化，
            就遍历保存提货点的数组options，找到对应提货点的下标，赋值给fid*/
    factory01() {
      for (var i = 0; i < this.fact01_options.length; i++) {
        if (this.factory01 == this.fact01_options[i]) {
          this.fid01 = this.factorys01[i].pickup_id;
        }
      }
      this.chartSettings.labelMap.one_num = this.factory01;
      this.platformReportList();
    },
    factory02() {
      for (var i = 0; i < this.fact02_options.length; i++) {
        if (this.factory02 == this.fact02_options[i]) {
          this.fid02 = this.factorys02[i].pickup_id;
        }
      }

      this.chartSettings.labelMap.two_num = this.factory02;
      this.platformReportList();
    },
    target() {
      for (var i = 0; i < this.targets.length; i++) {
        if (this.target == this.targets[i].item) {
          this.pk_id = this.targets[i].id;
        }
      }
      this.platformReportList();
    }
  },
  methods: {
    // 获取pk指标
    getpktarget() {
      getpk_target()
        .then(res => {
          for (var i = 0; i < res.length; i++) {
            this.target_options.push(res[i].item);
          }
          this.targets = res;
          // this.target = res[0].item;
        })
        .catch(error => {});
    },
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
    // 请求所有提货点
    allfactory() {
      getAllFactory()
        .then(res => {
          this.fact01_options = [];
          this.fact02_options = [];
          this.factorys01 = res.list;
          this.factorys02 = res.list;
          for (var i = 0; i < res.list.length; i++) {
            this.fact01_options.push(res.list[i].pickup_name);
            this.fact02_options.push(res.list[i].pickup_name);
          }
          // 设置默认厂区名
          this.fid01 = null;
          this.fid02 = null;
          // this.fid01 = res.list[0].pickup_id;
          // this.fid02 = res.list[0].pickup_id;
          // this.factory01 = res.list[0].pickup_name;
          // this.factory02 = res.list[0].pickup_name;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 请求统计数据
    platformReportList() {
      // 请求数据前，活动时间段选择的判断
      const thisdate = new Date();
      this.nowDate = thisdate.getTime();
      let judge1 = this.fact01_start_time - this.fact01_end_time > 0; //起点时间是否大于终点时间
      let judge2 = this.fact01_start_time - this.nowDate > 0; //起点时间是否大于当前时间
      let judge3 = this.fact01_end_time - this.nowDate > 0; //终点时间是否大于当前时间
      let judge4 = this.fact02_start_time - this.fact02_end_time > 0; //起点时间是否大于终点时间
      let judge5 = this.fact02_start_time - this.nowDate > 0; //起点时间是否大于当前时间
      let judge6 = this.fact02_end_time - this.nowDate > 0; //终点时间是否大于当前时间
      let judge7 = this.pk_id; //PK指标是否为空
      let judge8 = this.fid01; //厂区一是否选择
      let judge9 = this.fid02; //厂区二是否选择
      // 满足以上6种情况，代码断点
      if (judge2 || judge1 || judge3 || judge4 || judge5 || judge6) {
        this.$message({
          showClose: true,
          message: "请选择正确的时间段",
          type: "warning"
        });
        return false;
      } else if (judge7 == null || judge8 == null || judge9 == null) {
        return false;
      }
      // if(judge8==judge9){
      //     this.$message({
      //         showClose: true,
      //         message: "请选择不同的厂区进行PK",
      //         type: "warning"
      //     });
      //     return false
      // }


      // 发送数据请求
      this.chartData.rows = [];
      console.log("厂区id:" + this.fid01 + "," + this.fid02);
      getpkData({
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //当前页码数据最大条数
        one_start_date: this.transformTime(this.fact01_start_time),
        one_end_date: this.transformTime(this.fact01_end_time),
        two_start_date: this.transformTime(this.fact02_start_time),
        two_end_date: this.transformTime(this.fact02_end_time),
        one_pickup_id: this.fid01, //厂一提货点id
        two_pickup_id: this.fid02, //厂二提货点id
        pk_item: this.pk_id //pk指标id
      })
        .then(res => {
          console.log(res);
          res === undefined ? (this.isNull = true) : (this.isNull = false); //没有数据显示图片
          //把数据分别赋值给折线图的rows和d2-crud表的crudList
          // for (var i =0; i<res.length; i++) {
          //     this.chartData.rows.push(res[i]);
          // }
          this.chartData.rows = res;
          console.log(this.chartData.rows, "rows");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 设置默认时间
    setDefaultTime() {
      const start_date = new Date();
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 7); //设置时间为昨天的前十五天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      this.fact01_start_time = start_date;
      this.fact01_end_time = end_date;
      this.fact02_start_time = start_date;
      this.fact02_end_time = end_date;
    },
    // 点击重置触发的方法
    reset() {
      this.setDefaultTime();
      this.platformReportList();

    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 480px) {
  .factorySlect {
    display: flex;
    align-items: center;
  }

  .statisticsTimes,
  .block {
    display: flex;
    align-items: center;
  }
  .statisticsTimes {
    align-self: center;
  }
  .container {
    margin: 0 auto;
  }
  .btngroup {
    display: flex;
    align-items: center;
  }
  .headers {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
  /* 提货点大盒子 */
  .pickup-points-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
  }
  .pk-pick {
    display: block !important;
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

  /* 统计折线图 */
  .statisticalChart {
    margin-top: 20px;
  }
  .statisticalChart-img-box {
    display: flex;
    justify-content: center;
  }
  .statisticsTime > div:first-child {
    width: 75px;
  }
  .statisticsTime {
  }
}

/*    手机适配*/
@media screen and (max-width: 480px) {
  .headers {
    margin-left: 10px;
  }
  .statisticsTimes {
    margin-top: 5px;
    display: flex;
    justify-content: center;
  }
  .pickup-points-box {
    margin-top: 5px;
  }
  .fact_box {
    margin-top: 10px;
  }
  .el-input{
      width: 100% !important;
  }
  .el-button {
    margin-left: 10px !important;
    padding: 12px 20px !important;
  }
    .statisticalChart-img-box img{
        width: 100%;
    }
}
</style>