<template>
    <div class="home">

        <van-nav-bar
                fixed
                title="数据列表"
                right-text="退出登录"
                @click-right="loginOut"
        />

        <div class="list-content" id="list-content">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
                    :offset="20"
                >

                    <div class="list-item"  v-for="(item,key) in list" :key="key" @click="showMessage(key)">
                        <van-row>
                            <van-col span="8"><span class="item-title">{{item.name|splitStr(10)}}</span></van-col>
                            <van-col span="10" offset="6"><span class="item-time">{{item.createtime|timestampToTime}}</span></van-col>
                        </van-row>
                        <van-row>
                            <van-col span="24">{{item.message|splitStr(100)}}<em class="item-time" v-if="item.message && item.message.length > 100">[查看全文]</em></van-col>
                        </van-row>
                        <template v-if="item.replycontent">
                            <van-row>
                                <van-col span="8"><span class="item-title">回复:</span></van-col>
                                <van-col span="10" offset="6"><span class="item-time">{{item.replytime|timestampToTime}}</span></van-col>
                            </van-row>
                            <van-row>
                                <van-col span="24">{{item.replycontent|splitStr(100)}}<em class="item-time" v-if="item.replycontent && item.replycontent.length > 100">[查看全文]</em></van-col>
                            </van-row>
                        </template>
                    </div>

                </van-list>
            </van-pull-refresh>
        </div>

        <!--详情页面-->
        <van-popup
            v-model="popupShow"
            position="right"
        >

            <van-nav-bar
                    fixed
                    title="详情"
                    left-text="返回"
                    left-arrow
                    @click-left="popupShow=false"
            />
            <div class="message-content" v-if="list.length > 0">
                <div class="list-item">
                    <van-row>
                        <van-col span="8"><span class="item-title">{{list[listIndex].name|splitStr(10)}}</span></van-col>
                        <van-col span="11" offset="5"><span class="item-time">{{list[listIndex].createtime|timestampToTime}}</span></van-col>
                    </van-row>
                    <van-row>
                        <van-col span="24">{{list[listIndex].message}}</van-col>
                    </van-row>
                    <template v-if="list[listIndex].replycontent">
                        <van-row>
                            <van-col span="8"><span class="item-title">回复:</span></van-col>
                            <van-col span="11" offset="5"><span class="item-time">{{list[listIndex].replytime|timestampToTime}}</span></van-col>
                        </van-row>
                        <van-row>
                            <van-col span="24">{{list[listIndex].replycontent}}</van-col>
                        </van-row>
                    </template>
                </div>
            </div>
        </van-popup>

    </div>
</template>

<script>
    import axios from 'axios'
    import qs from 'qs'
    import url from '@/serviceAPI.config.js'
    import { Toast } from 'vant'
    import {isLogin,getToken,splitStr,timestampToTime} from '@/commonfn.js'

    export default {
        data(){
            return {
                list: [],            //数据列表
                listIndex:0,         //当前点击的文章索引
                loading: false,     //是否处于上拉加载状态
                finished: false,    //上拉加载是否已加载完所有数据
                isLoading: false,   //是否处于下拉刷新状态
                popupShow: false,   //弹层的显示
                page:0,              //列表当前页

            }
        },
        filters:{
            splitStr:function(value,length){
                return splitStr(value,length)
            },
            timestampToTime:function(value){
                return timestampToTime(value)
            }
        },
        methods:{
            loginOut(){
                localStorage.clear();
                setTimeout(()=>{
                    this.$router.push('/login')
                },500)
            },
            showMessage(index){
                this.popupShow = true
                //console.log(index)
                this.listIndex = index
            },
            onLoad() {      //上拉加载
                setTimeout(() => {
                    let {token,device} = getToken()
                    if(token && device){
                        //console.log('上拉加载')
                        //console.log(token,device);
                        ++ this.page
                        let postData = qs.stringify({
                            page:this.page
                        })
                        axios({
                            url:url.getList,
                            method:'post',
                            headers:{
                                'XX-Token':token?token:'',
                                'XX-Device-Type':device?device:'',
                            },
                            data:postData,
                        }).then(response=>{
                            //console.log(response);
                            if(response.status == 200 ){
                                if(response.data.code == 1 ){
                                    let data = response.data.data
                                    let last_page = data.last_page
                                    if(this.page == last_page){
                                        this.finished = true;
                                    }
                                    if(data.data){
                                       // this.list = data.data
                                        this.list = this.list.concat(data.data)
                                    } else {
                                        Toast.fail('没有可以显示的数据!')
                                        this.finished = true;
                                    }
                                } else {
                                    Toast.fail('获取数据失败!')
                                    this.finished = true;
                                }
                            }

                            this.loading = false;
                        }).catch(err=>{
                            Toast.fail(err)
                            console.log(err)
                            this.loading = false;
                        })
                    }
                },500)
            },
            onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.finished = false;
                    this.isLoading = false;
                    this.page = 0
                    this.list = []
                }, 500);
            }
        },
        created(){
            isLogin(this)
        },
        mounted(){
            let winHeight = document.documentElement.clientHeight                          //视口大小
            document.getElementById('list-content').style.height = (winHeight - 46) +'px'  //调整上拉加载框高度
        }
    }
</script>

<style lang="less">
    .home{
        .list-content,.message-content{
            margin-top:46px;
            overflow:scroll;
            .list-item{
                text-align:left;
                font-size:14px;
                padding: 0.5rem;
                border-bottom: 2px solid #fff;
                .item-title{
                    font-weight:bold;
                }
                .item-time{
                   float: right;
                   color:#c2c2c2;
                }
            }
        }
        .van-popup{
            &--right {
                width: 100%;
                height: 100%;
            }
            .message-content{
                margin-top:46px;
                padding:1rem;
            }
        }
    }


</style>