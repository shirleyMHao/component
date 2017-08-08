<template>
        <div class="select-x">
            <template v-if="bRender">
                <input type="text" :value="value" @input="changeEvent($event)" hidden>
                <label class="select-box" :style="{'width':selectWidth+'px'}" @click="changeDrop">
                    <span class="select-text" :style="{'width':(selectWidth-10)+'px'}">{{selectText}}</span><span :class="['btn-drop', droppedDown?'top':'down']"></span>
                </label>
                <ul :class="['select-lists',droppedDown?'f-db':'f-dn']" :style="{'width':selectWidth+'px','height':listHeight+'px','top':top+'px'}" ref="lists">
                    <template v-if="options.length>0">
                    <li :class="['select-item',disabledList.includes(item.value)?'disabled':'',item.value==selectValue?'selected':'']" v-for="item in options" @click="changeSelect(item)" :data-value="item.value" :ref="item.value">{{item.text}}</li>
                    </template>
                    <li v-else></li>
                </ul>
            </template>
            <label class="f-red select-box" v-else>
                lists's value is not uniq
            </label>
        </div>
</template>
<script>
    import utils from '../../api/utils'
    export default{
        data(){
            let obj = this.getChoosed();

            return {
                droppedDown:false,
                selectWidth: this.width,
                bRender:false,
                selectText:obj.text,
                selectValue:obj.value,
                top:32
            }
        },
        props:{
            width:{
                type:Number,
                default:120
            },
            options:{
                type:Array,
                default:[
                ]
            },
            disabledList:{
                type:Array,
                default: function(){
                    return [];
                }
            },
            value:{
                type:String,
                default:''
            }
        },
        computed:{
            listHeight(){
                return this.options.length <= 10 ? (this.options.length*28+10):200
            },
            selectValueP(){
                return this.value;
            }
        },
        watch:{
            value:{
                immediate:true,
                handler:function(val){
                    if (this.options.length != 0 && typeof this.value != 'undefined') {
                        let obj = this.getChoosed();
                        this.selectValue = obj.value;
                        this.selectText = obj.text;
                    }
                }
            },
            selectValue(){
                this.$emit('input',this.selectValue);
                this.$emit('selectChange',{value:this.selectValue,text:this.selectText});
            },
            droppedDown(value){
                let self = this;
                this.$nextTick(function(){
                    if(this.droppedDown){
                        if(parseInt(self.$refs.lists.getBoundingClientRect().bottom) >= parseInt(window.innerHeight)){
                            self.top = -(self.$refs.lists.clientHeight +2);
                        } else {
                            self.top = 32;
                        }
                    }
                    else{
                        self.top = 32;
                    }
                });
            }
        },
        methods:{
            changeEvent(event){
                this.$emit('input',event.target.value);
            },
            changeDrop(){
                this.droppedDown = !this.droppedDown;
            },
            changeSelect(item){
                if(typeof this.disabledList !='undefined' && this.disabledList.includes(item.value)){
                    return false;
                }
                this.changeDrop();
                this.selectText= item.text;
                this.selectValue= item.value;
                this.$emit('getSelected',{value:this.selectValue,text:this.selectText});
            },
            getChoosed(){
                let value,text;
                if(this.options.length == 0){
                    return {
                        value:'',
                        text:''
                    }
                }
                if(typeof this.value == 'undefined'){
                    value = this.options[0].value;
                    text = this.options[0].text;
                } else {
                    let index = utils.getPropFromArray(this.options, 'value', this.value) ;
                    if (index !== -1) {
                        if(this.disabledList.includes(this.options[index].value)){
                            if(typeof this.selectValue === 'undefined'){
                                value = this.options[0].value;
                                text = this.options[0].text;
                            } else {
                                value = this.selectValue;
                                text = this.selectText;
                            }
                            console.error('this option can not be selected');
                        }else{
                            value = this.value;
                            text = this.options[index].text;
                        }
                    } else {
                        value = this.options[0].value;
                        text = this.options[0].text;
                    }
                }
                return {
                    value,
                    text
                }
            }
        },
        created(){
            var me = this;
            if(!utils.isUniq(utils.convertProp2Lists(this.options,'value'))){
                console.error(`lists's value should be uniq`);
                this.bRender = false;
            } else {
                this.bRender = true;
                document.addEventListener('click',function(event){
                    if(!me.$el.contains(event.target)){
                        me.droppedDown = false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .f-red{
        color:red;
    }
    .select-x{
        position:relative;
        display:inline-block;
        font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        font-weight:400;
        vertical-align:middle;
        font-size:12px;
        margin:0px 4px;
    }
    .select-box{
        position:relative;
        box-sizing: border-box;
        display:block;
        height:28px;
        line-height: 28px;
        border:1px solid #d5d5d5;
        border-radius: 2px;
        min-width: 60px;
        padding:0px 5px;
    }
    .btn-drop{
        position:absolute;
        top: 10px;
        left: calc(100% - 20px) ;
        border-color:#d5d5d5;
    }
    .btn-drop.down{
        border: 6px solid transparent;
        border-top-color: #d5d5d5;
    }
    .btn-drop.top{
        border: 6px solid transparent;
        border-bottom-color: #d5d5d5;
        top:3px;
    }
    .select-text{
        overflow:hidden;
        display:inline-block;
        word-break: break-all;
        box-sizing: border-box;
        height:28px;
        line-height: 28px;
    }
    .select-lists{
        border:1px solid #d5d5d5;
        box-sizing: border-box;
        position:absolute;
        height:100px;
        top:32px;
        left:0px;
        background:#fff;
        border-radius: 2px;
        overflow-y: auto;
        overflow-x:hidden;
        padding:4px 0px;
        transition: height 1s;
        transform-origin: center top 0px;
    }
    .select-item{
        height:28px;
        line-height: 28px;
        cursor:pointer;
        font-size: 13px;
        padding:0px 10px;
    }
    .select-item:hover{
        background:#eef1f6;
    }
    .select-item.disabled{
        background:#e9e9e9;
        color:#999;
        cursor: not-allowed;
    }
    .select-item.selected{
        background:#eaf3fd;
    }
    .f-db{
        display:block;
    }
    .f-dn{
        display:none;
    }
</style>