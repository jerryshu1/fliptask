import newuserrequest from "../utils/newuserrequest"
import newdatarequest from "../utils/newdatarequest"

//获取母线以及X母。。。的任务列表
export const getotherstasklist = (company_name, station_name, params) => newdatarequest({
    url: '/ft/api/originalTasks/' + company_name + '/' + station_name + '/others', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})

//获取常规任务列表(new)
export const getcomontasklist = (company_name, station_name, params) => newdatarequest({
    url: '/ft/api/originalTasks/' + company_name + '/' + station_name + '/common', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})

//获取某公司站点下的所有线路
export const getcategorylist = (params) => requests({
    url: '/ft/api/ledger/category', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})

//new

//登录
export const newpostlogin = (body) => newuserrequest({
    url: '/auth/login',
    method: 'post',
    data: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json',
    }
});
//注册用户
export const newpostadduser = (company_name, station_name, body) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name + '/register',
    method: 'post',
    data: body,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//根据用户ID来获取多个用户
export const newpostinfo = (company_name, station_name, body) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name,
    method: 'post',
    data: body,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//修改某个用户信息（密码除外）
export const newpostchangeuserinfo = (company_name, station_name, user_id, body) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name + '/' + user_id,
    method: 'post',
    data: body,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取某个用户信息
export const newgetoneuserinfo = (company_name, station_name, user_id) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name + '/' + user_id,
    method: 'get',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取用户信息
export const newgetusersinfo = (company_name, station_name) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name,
    method: 'get',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//删除某个用户信息
export const newdeleteoneuserinfo = (company_name, station_name, user_id) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name + '/' + user_id,
    method: 'delete',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//用户修改密码
export const newpostuserreset = (company_name, station_name, user_id, body) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name + '/' + user_id + '/reset',
    method: 'post',
    data: body,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//管理员修改密码(暂不开放)
export const newpostadminreset = (company_name, station_name, user_id, body) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name + '/' + user_id + '/adimnReset',
    method: 'post',
    data: body,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取所有公司
export const newgetallcompany = () => newuserrequest({
    url: '/auth/company',
    method: 'get',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取某公司下的站点
export const newgetstation = (company_name) => newuserrequest({
    url: '/auth/station/' + company_name,
    method: 'get',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//登出
export const newpostlogout = (company_name, station_name, user_id) => newuserrequest({
    url: '/auth/users/' + company_name + '/' + station_name + '/' + user_id + '/logout',
    method: 'post',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
});

//发布任务
export const newposttask = (company_name, station_name, data) => newdatarequest({
    url: '/ft/api/flipTasks/' + company_name + '/' + station_name,
    method: 'post',
    data: data,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取任务列表
export const newgettasklist = (company_name, station_name) => newdatarequest({
    url: '/ft/api/flipTasks/' + company_name + '/' + station_name,
    method: 'get',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取风险库表
export const newgetComponents = (company_name, station_name) => newdatarequest({
    url: '/ft/api/originalTasks/' + company_name + '/' + station_name,
    method: 'get',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取风险内容
export const newgetrisks = (params) => newdatarequest({
    url: '/ft/api/components',
    method: 'get',
    params: params,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取某公司站点下的所有category
export const newgetcategorylist = (params) => newdatarequest({
    url: '/ft/api/ledger/category', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取other的单步任务内容
export const newgetotherstask = (company, station, params) => newdatarequest({
    url: '/ft/api/originalTasks/' + company + '/' + station + '/others',
    method: 'get',
    params: params,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//获取common的任务
export const newgetcommontask = (company, station, params) => newdatarequest({
    url: '/ft/api/originalTasks/' + company + '/' + station + '/common',
    method: 'get',
    params: params,
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//删除任务
export const newdeletetask = (company, station, id) => newdatarequest({
    url: '/ft/api/flipTasks/' + company + '/' + station + '/' + id,
    method: 'delete',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//更新状态至已派发
export const newpostupdatetoassign = (company, station, id) => newdatarequest({
    url: '/ft/api/flipTasks/' + company + '/' + station + '/' + id+'/updateStatusToAssigned', method: 'post', headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})
//更新状态至已完成
export const newpostupdatetofinish = (company, station, id) => newdatarequest({
    url: '/ft/api/flipTasks/' + company + '/' + station + '/' + id+'/updateStatusToFinished', method: 'post', headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
})