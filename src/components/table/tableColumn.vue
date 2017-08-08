<template>
    <div>{{title}}
    </div>
</template>

<script>
    export default{
        name:'tableColumn',
        props: {
            title: {
                type: String,
            },
            tag:{
                type:String
            },
            sortable: {
                type: Boolean,
                default:false
            },
            isShow:{
                type: Boolean,
                default:true
            },
            sortType:{
                type:String,
                default:'num'
            },
            type:{
                type:String
            },
            width:{
                type:Number
            },
            align:{
                type:String,
                default:'center'
            },
            bolder:{
                type:Boolean,
                default:false
            }
        }
    }
</script>