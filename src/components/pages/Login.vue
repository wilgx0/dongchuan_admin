<template>
    <div>
        <h1 class="title">用户登录</h1>
        <div>
            <van-cell-group>
                <van-field
                        v-model="username"
                        clearable
                        label="用户名"
                        placeholder="请输入用户名"
                        v-validate="'required|max:20'"
                        name="用户名"
                />

                <van-field
                        v-model="password"
                        type="password"
                        label="密码"
                        placeholder="请输入密码"
                        v-validate="'required|max:20'"
                        name="密码"
                />
            </van-cell-group>
        </div>

        <div class="submit-button">
            <van-button type="primary" size="large" @click="LoginAction" :loading="openLoading">登  录</van-button>
        </div>

        <div v-show="errors.any()" v-cloak class="validate-error">
            <p v-for="(v,i) in errors.all()">{{v}}</p>
        </div>
    </div>

</template>

<script>
    import axios from 'axios'
    import qs from 'qs'
    import url from '@/serviceAPI.config.js'
    import { Toast } from 'vant'
    import {isLogin} from '@/commonfn.js'

    export default {
        data(){
            return {
                username:'',
                password:'',
                openLoading:false,
            }
        },
        methods:{
            LoginAction(){      //登录操作
                this.$validator.validateAll().then(result=>{
                    if(result){
                        this.openLoading = true
                        let postData = qs.stringify({
                            username:this.username,
                            password:this.password,
                            device_type:'mobile'
                        })
                        axios({
                            url:url.login,
                            method:'post',
                            data:postData
                        })
                        .then( response => {
                            //console.log(response)
                            if(response.status == 200 ){
                                if(response.data.code == 1 ){
                                    new Promise((resolve,reject)=>{
                                        let data = response.data.data
                                        localStorage.setItem('XX-Token',data.token);
                                        localStorage.setItem('XX-Device-Type', 'mobile');
                                        localStorage.setItem('user', JSON.stringify(data.user));
                                        setTimeout(()=>{
                                            resolve()
                                        },500)
                                    }).then(()=>{           //登录成功
                                        Toast.success(response.data.msg)
                                        this.$router.push('/')
                                    }).catch(err=>{
                                        Toast.fail('登录状态保存失败')
                                        console.log(err)
                                    })
                                } else {
                                    Toast.fail(response.data.msg);
                                }
                            } else {
                                Toast.fail('登录请求失败请稍后再试');
                            }

                            this.openLoading = false
                        })
                        .catch(error=>{
                            console.log(error)
                            this.openLoading = false
                        })
                    }
                })
            },
        },
        created(){
            isLogin(this)
        }
    }
</script>

<style lang="less" scoped>
    .title{
        text-align:center;
        margin-top: 5rem;
    }
    .submit-button{
        padding:1rem;
    }

</style>