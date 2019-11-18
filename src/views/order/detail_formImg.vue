<template :myProps="myProps">
    <div class="img_txt">
        <img :src="abc" alt="" class="commodityImg">
        <!-- <p class="commodityName">{{ name }}</p> -->
        <!--        <p>{{ abc }}</p>-->
    </div>
</template>

<script>
    export default {
        name: "formImage",
        props:{
            scope: {
                default: null
            }
        },
        data() {
            return{
                abc:'',
                name:''
            }
        },
        methods:{
            inits(){
                this.abc=this.scope.row.original_img;
                this.name = this.scope.row.goods_name
                // console.log(this.scope.row)
            }
        },
        created() {
            this.inits()
        }
        // computed: {
        //     text () {
        //         if (this.scope.$index === 1) {
        //             return this.myProps
        //         } else if (this.scope.$index === 3) {
        //             return '通过scope拿到了当前行日期：' + this.scope.row.date
        //         }
        //         return this.value ? '是' : '否'
        //     }
        // },
    }
</script>

<style scoped>
    .commodityImg{
        width: 100px;
    }
    .img_txt{
        width: 100px;
        text-align: center;
    }
    @media only screen and (max-width: 750px) {
        .commodityImg{
            width: 50px!important;
        }
        .img_txt{
            width: 50px!important;
            text-align: center;
        }
    }
</style>