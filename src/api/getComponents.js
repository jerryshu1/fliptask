import requests from '../utils/request';
import userrequest from "../utils/userrequest";
import datarequest from "../utils/datarequest"

export const getComponentsData = (params, token) => requests({
    url: '/ft/api/components', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + token
    }
});

export const postRiskData = (company_id, params, token) => requests({
    url: '/ft/api/flipTasks/' + company_id, method: 'post', data: params, headers: {
        'Authorization': 'Bearer ' + token
    }
});


export const deleteData = (company_id, task_id, token) => {
    requests({
        url: '/ft/api/flipTasks/' + company_id + '/' + task_id, method: 'delete', headers: {
            'Authorization': 'Bearer ' + token
        }
    })
};

export const gettableData = (company_id, params, token) => requests({
    url: '/ft/api/flipTasks/' + company_id, method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + token
    }
});

export const updateStatus = (company_id, task_id, token) => requests({
    url: '/ft/api/flipTasks/' + company_id + '/' + task_id + "/updateStatus", method: 'post', headers: {
        'Authorization': 'Bearer ' + token
    }
});

export const updateuserStatus = (company_id, task_id, token) => requests({
    url: '/ft/api/flipTasks/' + company_id + '/' + task_id + "/updateStatusToAssigned", method: 'post', headers: {
        'Authorization': 'Bearer ' + token
    }
});
//超级管理员获取任务表数据
export const getsupertasklist = (token) => requests({
    url: '/ft/api/originalTasks', method: 'get', headers: {
        'Authorization': 'Bearer ' + token
    }
})
//分公司管理员获取分公司任务表数据
export const getadmintasklist = (id,token,body) => requests({
    url: '/ft/api/originalTasks/' + id, method: 'get', headers: {
        'Authorization': 'Bearer ' + token
    }
})
//分公司管理员搜索
export const getsearchtasklist = (id,token,params) => requests({
    url: '/ft/api/originalTasks/' + id, method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + token
    }
})
//复制任务表数据
export const postcopytask = (companyid) => requests({
    url: '/ft/api/originalTasks/' +  companyid + '/cloneFromOriginal', method: 'post', headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
})
//删除分公司任务库任务
export const deletetask = (companyid, taskid, token) => requests({
    url: '/ft/api/originalTasks/' + companyid + '/' + taskid, method: 'delete', headers: {
        'Authorization': 'Bearer ' + token
    }
})
//删除分公司任务库
export const deletetasklist = (companyid, token) => requests({
    url: '/ft/api/originalTasks/' + companyid, method: 'delete', headers: {
        'Authorization': 'Bearer ' + token
    }
})
//user
export const postlogin = (body) => userrequest({
    url: '/auth/login', method: 'post', data: JSON.stringify(body), headers: {
        'Content-Type': 'application/json',
    }
});

export const getuser = (id) => userrequest({
    url: '/auth/users/' + id, method: 'get', headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});

export const getallusers = () => userrequest({
    url: '/auth/users', method: 'get', headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});

export const getoneusers = (id) => userrequest({
    url: '/auth/users/' + id, method: 'get', headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});

export const changepassword = (id, body) => userrequest({
    url: '/auth/users/' + id + '/reset', method: 'post', data: body, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});

export const adminchangepassword = (id, body) => userrequest({
    url: '/auth/users/' + id + '/adminReset', method: 'post', data: body, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});

export const postnewuser = (body, token) => userrequest({
    url: '/auth/register', method: 'post', data: body, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});
//删除用户
export const deleteuser = (id) => userrequest({
    url: '/auth/users/' + id, method: 'delete', headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});
//删除分公司
export const deletecompany = (companyid) => userrequest({
    url: '/auth/company/' + companyid, method: 'delete', headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
});

export const postadminupdate = (id, body) => userrequest({
    url: '/auth/users/' + id, method: 'post', data: body, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
})

export const postsuperaddcompany = (body) => userrequest({
    url: '/auth/company/register', method: 'post', data: body, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
})

export const getcompany = (token) => userrequest({
    url: '/auth/company', method: 'get', headers: {
        'Authorization': 'Bearer ' + token
    }
})
//first search
export const firstsearch = (body, token) => requests({
    url: "/es/tasks/_search", method: 'post', data: body, headers: {
        'Authorization': 'Bearer ' + token
    }
});
//搜索回路类型
export const searchtype = (params, token) => requests({
    url: '/ft/api/ledger/category', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + token
    }
})
//根据公司id获取公司名称
export const getcompanyname = (companyid) => userrequest({
    url: '/auth/company/' + companyid, method: 'get', headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
})
//获取所有公司列表
export const getcompanylist = () => datarequest({
	url: '/mt/api/ledger/company',
	method: 'get',
	headers: {
		'Authorization': 'Bearer ' + window.localStorage.getItem('token')
	}
})
//获取某公司下站点
export const getstationlist = (company_id) => datarequest({
	url: '/mt/api/ledger/company/' + company_id,
	method: 'get',
	headers: {
		'Authorization': 'Bearer ' + window.localStorage.getItem('token')
	}
})
//获取某公司站点下的所有category
export const getcategorylist = (params) => requests({
    url: '/ft/api/ledger/category', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
})
//获取母线以及X母。。。的任务列表
export const getotherstasklist = (company_id, params) => requests({
    url: '/ft/api/originalTasks/' + company_id + '/others', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
})
//获取常规任务列表
export const getcomontasklist = (company_id, params) => requests({
    url: '/ft/api/originalTasks/' + company_id + '/common', method: 'get', params: params, headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    }
})