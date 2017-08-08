<template>
    <thead class="grid-head">
    <tr>
        <template v-for="column in columns" >
            <th v-if="column.type!='selection'" :class="[curSortColumn==column.tag?'sorting':'', column.sortable?'th-sort':'']" :style="{'width':`${column.width}px`}" @click="column.sortable?setSortColumn(column.tag):''">
                <em v-show="column.sortable"
                    :class="[curSortColumn != column.tag? '' :  sortOrder == '1' ?'asc':'desc','sort']"></em>
                {{column.title}}
            </th>
            <th v-else :style="{width:`${column.width}px`}"><div :class="['x-checkbox',selectAll?'checked':'']" name="check-all" @click="setSelectAll"> </div></th>
        </template>
    </tr>
    </thead>
</template>
<script>
    export default{
        data(){
            return {
                sorting: '',
//                selectAll:this.isSelectAll
            }
        },
        props: ['columns', 'curSortColumn','sortOrder','isSelectAll'],
        methods: {
            setSortColumn(tag){

                if (tag != this.curSortColumn) {
                    this.sorting = 'sorting';
                    this.$emit('sortColumn', {tag:tag,type:0});
                } else {
                    this.sorting = 'sorting';
                    this.$emit('sortColumn', {tag:tag,type:-1});
                }
            },
            setSelectAll(event){
                let checked = event.target.classList.value.includes('checked') ? false : true;
                this.$emit('selectAll', {checked});
            }
        },
        computed:{
            selectAll(){
                return this.isSelectAll;
            }
        }
    }
</script>
<style scoped>
    th{
        position:relative;;
    }
    .th-sort{
        cursor:pointer;
    }
    em{
        position:absolute;
        display:block;
        top: 0px;
        left:10px;
    }


    em.sort {
        background: #f8f8f8 url(http://pages.juxiao.mediav.com/images/arrow_sort.gif) no-repeat scroll 4px -49px;
        cursor: pointer;
        padding-left: 15px;
        display: block;
        float: left;
        height: 40px;
    }
    em.desc {
        background-color: #d5d5d5;
        background-position: 4px 0;
    }

    em.asc {
        background-color: #d5d5d5;
        background-position: 4px -24px;
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
    th.sorting {
        background-color: #d5d5d5;
    }

</style>