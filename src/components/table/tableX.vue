<template>
    <div class="table-container f-cb">
        <table class="grid">
            <table-header :columns="columns" key="column.tag" :curSortColumn="curSortColumn" :sortOrder="sortOrder" :isSelectAll="selectRows.length==tabledata.length" @sortColumn="updateColSort" @selectAll="selectAll"/>
            <table-body  :rows="tabledata" :columns="columns" :keyTag="keyTag" :curSortColumn="curSortColumn" :sortOrder="sortOrder" :enableSelected="enableSelected" :selectRows="selectRows" key="index" @selectRowsChange="selectRowsChange"/>
        </table>
        <pagination :total="total" :pageSizeList="pageSizeList" @getPageData="getPageData"></pagination>
        <div style="display:none">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    import tableHeader  from './tableHeader.vue'
    import tableBody from './tableBody.js'
    import pagination from '../pagination/pagination.vue'
    import {pick} from 'lodash'
    export default{
        name: 'TableX',
        components: {
            tableHeader,
            tableBody,
            pagination
        },
        data(){
            return {
                columns:[],
                curSortColumn:'',
                sortOrder:0,
                selectRows:[],
                currentPage:1,
                pageSize:this.pageSizeList[0]
            }
        },
        props:{
            tabledata:{
                type:Array,
                default:[]
            },
            total:{
                type:Number,
                default:0
            },
            pageSizeList:{
                type:Array,
                default:[ 25,50,100]
            },
            noDataText:{
                type:String,
                default:'暂无数据'
            },
            enableSelected:{
                type:Boolean,
                default:false
            },
            keyTag:{
                type:String,
                default:'id'
            }
        },
        watch:{
        },
        methods: {
            getPageParam(){
                return {
                    currentPage:this.currentPage,
                    pageSize:this.pageSize
                }
            },
            selectAll({checked}){
                if(checked){
                    this.setSelectAll();
                } else {
                    this.selectRows = [];
                }
            },
            selectRowsChange({rows}){
                console.log('table-x get rows',rows);
                this.selectRows = rows;
            },
            setSelectAll(){
                let selected = [];
                for(let i = 0;i<this.tabledata.length ;i ++){
                    selected.push(this.tabledata[i][this.keyTag].toString());
                }
                this.selectRows = selected;
            },
            updateColSort(colObj){
                console.log('table update');
                if (DEBUG) {
                    console.log(colObj);
                }
                this.curSortColumn = colObj.tag;
                if(colObj.type == 0){
                    this.sortOrder = 1;
                } else if(colObj.type == -1){
                    this.sortOrder = -1* this.sortOrder;
                }
                console.log(this.curSortColumn,this.sortOrder);
            },
            getPageData({currentPage,pageSize}){
                this.currentPage = currentPage;
                this.pageSize = pageSize;
                this.$emit('getPageData',{currentPage,pageSize});
            }
        },
        computed:{
            len(){
                return this.tabledata.length;
            }
        },
        mounted(){
            this.columns = this.$slots.default
                .filter(column => {
                    return column.componentInstance;
                })
                .map(column => {
                    //debugger;
                    return pick(column.componentInstance,['title','tag','width','bolder','align','sortable','sortType','type','$scopedSlots']);
                });
/*
            if(this.tabledata.length != this.pageSize){
                console.log(this.tabledata.length,this.pageSize)
                console.error("when table component created: data length and pageSize don't match");
            }
*/
            console.log('tableX mounted');
        }
    }
</script>
<style scoped>
    .table-container{
        position:relative;
    }
    .grid{
        border-spacing: 0;
        table-layout: fixed;
        width: 100%;
        border-top: 1px solid #d5d5d5;
        border-right: 1px solid #d5d5d5;
    }
    .grid-head th{
        background-color: #f8f8f8;
        border-bottom: 1px solid #d5d5d5;
        border-left: 1px solid #d5d5d5;
        font-size: 13px;
        font-weight: 400;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        padding: 0 5px;
    }

</style>