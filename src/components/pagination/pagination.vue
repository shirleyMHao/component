<template>
    <div class="table-page">

        <span class="total">总共{{total}}项</span>
        <span>每页显示&nbsp;</span>
        <!--<select class="pageList" name="" id="" v-model="pageSize" >
            <option v-for="item in pageSizeList" :value="item">{{item}}&nbsp;行</option>
        </select>-->
        <select-x :width="100" :options="options" ref="selectx" @selectChange="selectChange"></select-x>
        <label :class="['btn-page','pre-page',currentPage==1?'btn-disable':'']" @click="getPrePage">&lt;</label>
        <span :class="['pages',currentPage==1?'active':'',(preDotted||pageNum==1) ?'margin-0':'']" @click="changePage(1)"
              :value="1">1</span>
        <span class="dot pre" v-show="preDotted">...</span>
        <span :class="['pages', n==currentPage?'active':'', (n== pages[pages.length-1])? 'margin-0':'']"
              v-for="n in pages" :value="n" @click="changePage(n)">{{n}}</span>
        <span class="dot last" v-show="lastDotted">...</span>
        <span :class="['pages',currentPage==pageNum?'active':'','margin-0']" @click="changePage(pageNum)"
              v-show="pageNum>1" :value="pageNum">{{pageNum}}</span>
        <label :class="['btn-page','next-page',currentPage == pageNum?'btn-disable':'']"
               @click="getNextPage">&gt;</label>
        <label class="to-page">
            前往&nbsp;<input type="text" class="c-input" v-model="toPage" @keyup.enter="changePage(parseInt(toPage))"/>&nbsp;页
        </label>
    </div>
</template>
<script>
    import '../../css/reset.css'
    import selectX from '../select/select.vue'
    /*pagination 组件不仅仅试用于table，也可以是其它的，其父组件需要定义prop
     * props：
     *       total:总页数
     *       pageSizeList：显示数目列表Array
     * event:
     *       getPageData({currentPage, pageSize}): 父组件的响应事件
     *       当页数或每页显示条数发生变化，通知父组件
     *       currentPage:第多少页
     *       pageSize:每页显示条数
     * */
    export default{
        components: {
            selectX
        },
        props: {
            total: {
                type: Number,
                required: true
            },
            pageSizeList: {
                type: Array,
                required: true,
                default: [25, 50, 100]
            }
        },
        data(){
            let pageSize = this.pageSizeList[0];
            let options = [];
            for (let i of this.pageSizeList) {
                options.push({
                    value: i,
                    text: i + '行'
                })
            }
            ;
            return {
                pageSize,
                currentPage: 1,
                preDotted: false,
                lastDotted: false,
                toPage: 1,
                options: options
            }
        },
        computed: {
            pageNum(){
                return Math.ceil(this.total / this.pageSize);
            },
            pages(){
                let pagesTmp = [];
                this.preDotted = this.currentPage - 1 <= 3 ? false : true;
                this.lastDotted = this.pageNum - this.currentPage <= 3 ? false : true;

                if (!this.preDotted && !this.lastDotted) {
                    if (this.pageNum >= 2) {
                        for (let i = 2; i <= this.pageNum - 1; i++) {
                            pagesTmp.push(i);
                        }
                    } else {
                        return [];
                    }
                } else if (this.preDotted && !this.lastDotted) {
                    for (let i = this.currentPage - 2; i <= this.pageNum - 1; i++) {
                        pagesTmp.push(i);
                    }
                } else if (!this.preDotted && this.lastDotted) {
                    for (let i = 2; i <= this.currentPage + 2; i++) {
                        pagesTmp.push(i);
                    }
                } else {
                    for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
                        pagesTmp.push(i);
                    }
                }

                return pagesTmp;
            }
        },
        methods: {
            changePage(n){
                if (n >= 1 && n <= this.pageNum) {
                    this.currentPage = n;
                }else{
                    this.currentPage = 1;
                    this.toPage = 1;
                }
            },
            getPrePage(){
                if (this.currentPage == 1) {
                    return;
                } else {
                    this.currentPage -= 1;
                }
            },
            getNextPage(){
                if (this.currentPage == this.pageNum) {
                    return;
                } else {
                    this.currentPage += 1;
                }
            },
            selectChange({value}){
                this.pageSize = value;
            }
            },
        watch:{
            immediate: true,
            pageSize(val){
                if (DEBUG) {
                    console.log('page size:', val);
                }
                if (false) {
                    console.log('Debug info')
                }


                this.currentPage = 1;
                this.$emit('getPageData', {currentPage: this.currentPage, pageSize: this.pageSize})
                this.$emit('changePageParam', {currentPage: this.currentPage, pageSize: this.pageSize});
            },
            currentPage(val){
                if (DEBUG) {
                    console.log('current page:', val);
                }
                this.toPage = val;
                this.$emit('changePageParam', {currentPage: this.currentPage, pageSize: this.pageSize});
                this.$emit('getPageData', {currentPage: this.currentPage, pageSize: this.pageSize})
            }
        }
    }
</script>
<style scoped>
    .table-page {
        float: right;
        font-size: 0px;
        color: #666;
        margin-top: 10px;
        margin-right: 20px;
        padding: 10px 0px;
    }

    .table-page span, .table-page select, .table-page option, .table-page label {
        font-size: 12px;
        vertical-align: middle;
    }

    .total {
        margin-right: 10px;
    }

    .pageList {
        width: 60px;
        margin-right: 20px;
    }

    .margin-r-20 {
        margin-right: 20px;
    }

    .dot {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
    }

    .pages {
        display: inline-block;
        border: 1px solid #d1dbe5;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #fff;
        margin-right: 4px;
        cursor: pointer;
    }

    .pages.active {
        background: #4fc08d;
        color: #fff;
    }

    .pages:hover {
        background: #f2f2f2;
    }

    .pages.active:hover {
        background: #4fc08d;
    }

    .margin-0 {
        margin-right: 0px;
    }

    .btn-page {
        width: 40px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border: 1px solid #d1dbe5;
        padding: 2px 6px;
        cursor: pointer;
    }

    .btn-page:hover {
        background: #f2f2f2;
    }

    .btn-disable {
        background: #f2f2f2;
        cursor: default;
    }

    .pre-page {
        margin-right: 10px;
        font-weight: bolder;
    }

    .next-page {
        font-weight: bolder;
        margin-left: 10px;
    }

    .f-cls:after {
        display: block;
        content: "";
        height: 0;
        visibility: hidden;
        clear: both;
        overflow: hidden;
    }

    .c-input {
        width: 20px;
        height: 20px;
        line-height: 20px;
        border: 1px solid #d1dbe5;
        padding: 0px 2px;
        text-align: center;
    }

    .to-page {
        margin-left: 10px;
    }
</style>