<template>
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>{{searchTime}} 详细信息</div>
      </div>
    </template>
    <!-- d2-crud表 -->
    <div class="d2crud">
      <d2-crud
        :columns="crudColumns"
        :data="crudData"
        :loading="loading"
      />
    </div>
  </d2-container>
</template>

<script>
import { getNewAnalysisInfo } from '@/api/user/getNewAnalysisInfo'
export default {
  name: 'newAnalysisInfo',
  data:function(){
    return {
      searchTime:'',//保存传递过来需要搜索的时间
      crudColumns:[
          {title:'来源类型',key:'origin'},
          {title:'新用户数',key:'new_user_num'},
          {title:'下单用户数',key:'uv_num'},
          {title:'订单数',key:'order_num'},
          {title:'订单总额',key:'order_sum'}
      ],
      crudData:[],
      loading:false,
      total:0
    }
  },
  mounted(){
    this.searchTime = this.$route.query.date;
    this.detailInfo();
  },
  methods:{
    // 返回上一页
    jump(){
      this.$router.push({
        name:"newAnalysis"
      });
    },
    // 请求数据
    detailInfo(){
      getNewAnalysisInfo({
        date:this.searchTime,
      }).then(res=>{
        console.log("info-res123:",res);
        this.crudData = res.list; //把数据赋值给d2-crud的crudData
        this.total = res.total;
      }).catch(err=>{
      })
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