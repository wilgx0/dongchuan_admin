import axios from 'axios'
import qs from 'qs'
import url from '@/serviceAPI.config.js'
import { Toast } from 'vant'

/**
 * 检查用户是否登录
 * @param succees
 * @param fault
 */
function isLogin(vm){
    let {token,device} = getToken()
    //console.log(token,device);
    if(token && device){
        axios({
            url:url.isLogin,
            method:'get',
            headers:{
                'XX-Token':token?token:'',
                'XX-Device-Type':device?device:'',
            }
        }).then(response=>{
            //console.log(response)
            if(response.status == 200 ){
                if(response.data.code && response.data.code == 10001){
                    vm.$router.push('/login')

                } else {
                    vm.$router.push('/')
                }
            }
        }).catch(err=>{
            //console.log(err)
            Toast.fail(err)
            vm.$router.push('/login')
        })
    }else{
        vm.$router.push('/login')
    }
}

/**
 * 获取用户token
 * @returns {{"XX-Token": string, "XX-Device-Type": string}}
 */
function getToken(){
    return {
        token  : localStorage.getItem('XX-Token'),
        device : localStorage.getItem('XX-Device-Type'),
    }

}

/**
 * 字符串截取
 * @param str
 * @param num
 */
function splitStr(str,length){
    if(str == undefined) {
        return '';
    }
    if(str.length > length){
        return str.substring(0,length)+'..';
    } else {
        return str;
    }

}

//时间戳装换日期格式
function timestampToTime(timestamp) {
    var Y,M,D,h,m,s;
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}


export {
    isLogin,
    getToken,
    splitStr,
    timestampToTime,
}
