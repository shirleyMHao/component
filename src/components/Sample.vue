<template>
    <div class="template">
        <div class="demo">
            <h2>Tabel Demo</h2>
            <v-table :tabledata="dataTable" @getPageData="getPageData" :pageSizeList="[25,50,100,200]" ref="table"
                     :total="total"
                     :pageable="false">
                <table-column type="selection" :width="50"></table-column>
                <table-column title="姓名" tag="name" :width="240"></table-column>
                <table-column title="年龄" tag="age" sortable></table-column>
                <table-column title="性别" tag="sex" sortable sortType="string"></table-column>
                <table-column title="生日" tag="birthday" sortable sortType="date"></table-column>
                <table-column title="链接" tag="link">
                    <template scope="props">
                        <a :href="props.row.link">链接</a>
                    </template>
                </table-column>
                <table-column title="操作" tag="operator">
                    <template scope="props">
                        <button v-if="props.row.operator=='1'" @click="clickBtn(props.row)">停止</button>
                        <span v-else>已停止</span>
                    </template>
                </table-column>
            </v-table>
        </div>
        <hr/>
        <div class="demo">
            <h2>select Demo</h2>
            <div>
                <select-x :width="100" :options="selectLists" v-model="choose" :disabledList="['2','3','10']" ref="selectx"></select-x>
                <input type="text" v-model="selectOption">
                <button @click="setOption">setOption</button>
                <button @click="getOption">getOption</button>
            </div>
            <div v-html="dataTable[0].link"></div>
        </div>
    </div>
</template>

<script>
    import VTable from './table'
    import tableColumn from './table/tableColumn.vue'
    import selectX from './select/select.vue'
    import '../css/reset.css'
    export default {
        name: 'hello',
        components: {
            tableColumn,
            selectX,
          VTable
        },
        data(){
            return {
                lists:['2','1'],
                option:'2',
                choose:'3',
                selectOption:'',
                selectLists:[
                    {
                        value:'1',
                        text:'第一页'
                    },
                    {
                        value:'2',
                        text:'第二页'
                    },
                    {
                        value:'3',
                        text:'第三页'
                    },
                    {
                        value:'4',
                        text:'第四页'
                    },
                    {
                        value:'5',
                        text:'第五页'
                    },
                    {
                        value:'6',
                        text:'第六页'
                    },
                    {
                        value:'7',
                        text:'第七页'
                    },
                    {
                        value:'8',
                        text:'第八页'
                    },
                    {
                        value:'9',
                        text:'第九页'
                    },
                    {
                        value:'10',
                        text:'第十页',
                        disabled:true /*改属性还在试验阶段，后续会改进*/
                    },
                ],
                total:20,
                dataTable:[
                    {
                        id:0,/*must be identical*/
                        name:'shirley',
                        age:'18',
                        sex:'female',
                        birthday:'2001-01-01',
                        link:'http://www.sohu.com' ,
                        operator:'1'
                    },
                    {
                        id:1,/*must be identical*/
                        name:'shirley1',
                        age:'14',
                        sex:'female',
                        birthday:'1986-01-03',
                        link:'http://www.sohu.com',
                        operator:'1'
                    },
                    {
                        id:2,/*must be identical*/
                        name:'shirley2',
                        age:'19',
                        sex:'male',
                        birthday:'1999-12-01',
                        link:'http://www.163.com',
                        operator:'0'
                    },
                    {
                        id:3,/*must be identical*/
                        name:'shirley3',
                        age:'18',
                        sex:'female',
                        birthday:'2001-01-01',
                        link:'http://www.baidu.com',
                        operator:'0'
                    },
                    {
                        id:4,/*must be identical*/
                        name:'shirley4',
                        age:'19',
                        sex:'male',
                        birthday:'1999-12-01',
                        link:'http://www.163.com',
                        operator:'1'
                    },
                    {
                        id: 5,
                        name:'shirley5',
                        age:'14',
                        sex:'female',
                        birthday:'1986-01-03',
                        link:'http://www.sohu.com',
                        operator:'0'
                    },
                ],
                dataTable2:[
                    {
                        name:'Jack',
                        age:'18',
                        sex:'female',
                        birthday:'2001-01-01',
                        link:'<a href="www.baidu.com">baidu</a>'
                    },
                    {
                        name:'Jack2',
                        age:'19',
                        sex:'male',
                        birthday:'1999-12-01',
                        link:'<a href="www.aaa.com">aaa</a>'
                    },
                    {
                        name:'Jack3',
                        age:'14',
                        sex:'female',
                        birthday:'1986-01-03',
                        link:'<a href="www.aaa.com">bbbb</a>'
                    },
                ]
            }
        },
        methods:{
            getPageData({currentPage,pageSize}){
                console.log(`get page ${currentPage} of size ${pageSize} pagedata and set tabledata`);
            },
            clickBtn:function(row){
                console.log('clicked',row.id);
            },
            getSelectedRows(){
                console.log(this.$refs.table.selectRows,typeof this.$refs.table.selectRows);
            },
            setOption(){
                this.choose = this.selectOption;
            },
            getOption(){
                console.log('get option', this.choose)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h2{
        font-size: 24px;
        padding:10px;
    }
    input,button{
        vertical-align: middle;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
    .demo{
        width:960px;
        margin:0px auto 20px;
    }
</style>
