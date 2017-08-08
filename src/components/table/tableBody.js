import utils from '../../api/utils';
import sortFunc from '../../api/filter';
import _ from 'lodash';
import '../../css/table.css';
export default{
    render(){
        var  self = this;
        if(!this.isRowIdUniq){
            return (
                <tbody class="grid-body">
                    <tr colSpan={this.columns.length}/>
                </tbody>
            )
        }
        else if(this.rows.length ==0){
            return (
                <tbody class="grid-body">
                    <tr>
                        <td colspan={this.columns.length}>{this.noDataText}</td>
                    </tr>
                </tbody>
            )
        }
        else {

        }
        return(
            <tbody class="grid-body">
            {this.filterData.map((item,index)=>{
                let checked = false;
                if(this.selectRowList.includes(item[this.keyTag].toString())){
                    checked = true;
                }
                return (<tr class={{'checked-row':checked}}  on-click={ ($event) => this.setSelectRow($event, item[this.keyTag]) }>
                        {this.columns.map((column)=>{
                            if(!_.isEmpty(column.$scopedSlots)){
                                return (
                                    <td class={{'bolder':column.bolder,
                                        'align-left':column.align == 'left',
                                        'align-right':column.align == 'right',
                                    }}>{column.$scopedSlots.default({row:item})}</td>
                                )
                            } else if(column.type == 'selection'){
                                /*尝试过checkbox，但自测有bug：选择某一行，然后全选，再取消全选，checkbox的checked属性不会随着self.checkedList的值render改变勾选状况，
                                * 改为自定义的checkbox之后，class却可以*/
                                /*render 没有v-model的指令，所以自定义了click event handler*/
                                return (
                                    <td>
                                        <div class={{'checked':checked,'x-checkbox':true}}
                                             data-value={item[this.keyTag]}
                                             onClick={($event)=>this.setSelectCheckbox($event)}
                                             ref={'checkbox'+item[this.keyTag]}></div>
                                    </td>
                                )
                                /* 等同于
                                return h('td',
                                       [
                                            h('div',
                                                {
                                                    'class':{
                                                        'checked':self.checkedList[item[this.keyTag]],
                                                        'x-checkbox':true,
                                                    },
                                                    attrs: {
                                                        'data-value':item[this.keyTag]
                                                    },
                                                    on: {
                                                        click: function (event) {
                                                            let value = event.target.dataset.value;
                                                            console.log(self.selectRowList);
                                                            if (!event.target.classList.value.includes('checked')) {
                                                                self.selectRowList.push(value);
                                                            } else {
                                                                let indexOfthis = self.selectRowList.indexOf(value);
                                                                self.selectRowList.splice(indexOfthis, 1);
                                                            }
                                                            event.stopPropagation();
                                                        }
                                                    },
                                                    ref:'checkbox-'+index
                                                }
                                           )
                                       ]
                                )*/
                            } else{
                                /*不能用dangeroushtml的react语法，jsx写法与react中有所差别，具体请查看https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage*/
                                return (
                                    <td
                                        class={{'bolder':column.bolder,
                                        'align-left':column.align == 'left',
                                        'align-right':column.align == 'right',
                                        }}>{item[column.tag]}</td>
                                )
                                /*等同于
                                return h('td',
                                    {
                                        domProps: {
                                            innerHTML: item[column.tag]
                                        }
                                    }
                                )*/
                            }
                        }
                        )}
                </tr>)
            })}
            </tbody>
        )
    },
    data(){
        return {
            isRowIdUniq:false
        }
    },
    props:['columns','rows','keyTag','curSortColumn','sortOrder','selectRows','noDataText','enableSelected'],
    watch:{
        selectRowList(val){
            this.$emit('selectRowsChange',{rows:val});
        }
    },
    computed:{
        filterData(){
            let sortType = 'num';
            if(this.curSortColumn == ''){
                return this.rows;
            }
            for(let key of this.columns){
                if(key.tag == this.curSortColumn){
                    sortType = key.sortType;
                }
            }

            let filter = this.rows.sort((a,b)=>{
                var func = sortFunc(sortType);
                return this.sortOrder * func(a[this.curSortColumn],b[this.curSortColumn]);
            })

            return filter;
        },
        selectRowList(){
            return this.selectRows;
        }
    },
    methods:{
        setSelectRow(event,index){
            if(!this.enableSelected){
                return ;
            }
            if (DEBUG){
                console.log('set row:',index);
            }

            if (!this.selectRowList.includes(index.toString())) {
                this.selectRowList.push(index.toString());
            } else {
                let indexOfthis = this.selectRowList.indexOf(index.toString());
                this.selectRowList.splice(indexOfthis, 1);
            }
            event.stopPropagation();
        },
        setSelectCheckbox(event){
            let value = event.target.dataset.value;
            if(DEBUG){
                console.log(self.selectRowList);
            }
            if (!event.target.classList.value.includes('checked')) {
                this.selectRowList.push(value);
            } else {
                let indexOfthis = this.selectRowList.indexOf(value);
                this.selectRowList.splice(indexOfthis, 1);
            }
            event.stopPropagation();
        }
    },
    created(){
        /*console.log('body created');
        let lists = [];
        for (let i = 0; i < this.rows.length; i++) {
            if (this.selectRowList.includes(i.toString())) {
                lists[i] = true;
            } else {
                lists[i] = false;
            }
        }
        this.checkedList = lists;*/

        if(utils.isUniq(utils.convertProp2Lists(this.rows,this.keyTag))){
            this.isRowIdUniq = true;
        } else {
            console.error('table data id is not uniq,please check');
            this.isRowIdUniq = false;
        }

    }

}