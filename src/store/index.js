import {createStore} from "vuex";
import {
    getComponentsData,
    postRiskData,
    gettableData,
    getuser,
    getallusers,
    getoneusers,
    postnewuser,
    postadminupdate,
    postsuperaddcompany,
    postcopytask,
    getsupertasklist,
    getadmintasklist,
    getcompanyname,
} from "../api/getComponents";
import comment from "@element-plus/icons-vue/dist/es/comment.mjs";

export default createStore({
    state: {
        API_ENDPOINT: "http://47.96.164.104:4080",
        selectedTasks: {},
        componentsData: [],
        devicesData: [],
        additionData: [],
        taskName: '',
        publishedData: [],
        printData: [],
        riskandmeasure: {},
        addnewtasks: [],
        //复合型任务数据
        muti_devicesData: [],
        muti_taskNames: '',
        muti_componentsData: [],
        muti_componentsDatas: [],
        muti_selectedTasks: [],
        muti_taskName: [],
        muti_additionData: [],
        //user
        user: {},
        user_id: '',
        user_password: '',
        jwtToken: '',
        allUsers: [],
        newtaskid: '',
        companyname: '',
        //
        supertasklist: [],
        admintasklist: []
    },
    mutations: {
        signalsearch(state,result){
            state.additionData = result.additional;
            state.taskName = result.task_name;
            let data = {
                details: result.details,
                additional: result.additional
            }
            state.selectedTasks = data;
        },
        clearnewadddata(state) {
            state.addnewtasks = [];
        },
        savetoken(state, payload) {
            state.jwtToken = payload.token;
            state.user_id = payload.id;
            state.user_password = payload.password;
        },
        saveuser(state, payload) {
            state.user = payload.user;
        },
        savecompanyname(state, payload) {
            console.log(payload)
            state.companyname = payload.company.name;
        },
        login(state, payload) {
            if (payload && payload._id && payload.base64encoded) {
                state.user.isLoggedIn = true;
                state.user._id = payload._id;
                state.user.name = payload.name || payload._id;
                state.user.role = payload.role;
                state.user.base64encoded = payload.base64encoded;
            }
        },
        logout(state) {
            state.user._id = "";
            state.user.name = "";
            state.user.role = "";
            state.user.phone = "";
            state.user_id = "";
            state.user_password = "";
            state.jwtToken = "";
        },
        endpoint(state, payload) {
            state.API_ENDPOINT = payload;
        },
        SAVEDATA(state, result) {
            state.componentsData.push(result);
            var obj = {
                device: result.device,
                device_type: result.device_type,
                operation: result.operation,
            };
            state.devicesData.push(obj);
        },
        SAVEMUTIDATA(state, result) {
            let x = false;
            for (var i in state.muti_selectedTasks) {
                for (var j in state.muti_selectedTasks[i]) {
                    if (result.device === state.muti_selectedTasks[i][j].device && result.operation === state.muti_selectedTasks[i][j].operation) {
                        result.index = i;
                        let z = false;
                        for (var k in state.muti_componentsData) {
                            if (result.device === state.muti_componentsData[k].device && result.operation === state.muti_componentsData[k].operation) {
                                z = true
                            }
                        }
                        if (z) {
                            x = true;
                            break
                        }
                    }
                }
                if (x) {
                    break
                }
            }
            for (var i in state.muti_selectedTasks) {
                for (var j in state.muti_selectedTasks[i]) {
                    if (result.device === state.muti_selectedTasks[i][j].device && result.device_type === state.muti_selectedTasks[i][j].device_type && result.operation === state.muti_selectedTasks[i][j].operation) {
                        result.index = i;
                    }
                }
            }
            state.muti_componentsData.push(result);
        },
        DELETE(state) {
            state.componentsData = [];
            state.selectedTasks = {};
            state.devicesData = [];
        },
        MUTIDELETE(state) {
            state.muti_devicesData = [];
            state.muti_taskNames = '';
            state.muti_componentsData = [];
            state.muti_componentsDatas = [];
            state.muti_selectedTasks = [];
            state.muti_taskName = [];
            state.muti_additionData = [];
        },
        PUBLISHDATA(state, result) {
            state.publishedData = result;
            for (var i in state.publishedData) {
                if (state.publishedData[i].status === 'published') {
                    state.publishedData[i].status = '已发布';
                } else if (state.publishedData[i].status === 'assigned') {
                    state.publishedData[i].status = '已派发';
                } else if (state.publishedData[i].status === 'finished') {
                    state.publishedData[i].status = '已完成';
                }

                var d = new Date(state.publishedData[i].publish_date);
                state.publishedData[i].publish_date = d.toLocaleString();
                if (state.publishedData[i].publish_date.split(' ')[0].split('/')[2].length === 1) {
                    state.publishedData[i].publish_date = state.publishedData[i].publish_date.split('/')[0] + '/' + state.publishedData[i].publish_date.split('/')[1] +
                        '/0' + state.publishedData[i].publish_date.split('/')[2]
                }
                if (state.publishedData[i].assign_date) {
                    var d1 = new Date(state.publishedData[i].assign_date);
                    state.publishedData[i].assign_date = d1.toLocaleString();
                    if (state.publishedData[i].assign_date.split(' ')[0].split('/')[2].length === 1) {
                        state.publishedData[i].assign_date = state.publishedData[i].assign_date.split('/')[0] + '/' + state.publishedData[i].assign_date.split('/')[1] +
                            '/0' + state.publishedData[i].assign_date.split('/')[2]
                    }
                }
                if (state.publishedData[i].finish_date) {
                    var d2 = new Date(state.publishedData[i].finish_date);
                    state.publishedData[i].finish_date = d2.toLocaleString();
                    if (state.publishedData[i].finish_date.split(' ')[0].split('/')[2].length === 1) {
                        state.publishedData[i].finish_date = state.publishedData[i].finish_date.split('/')[0] + '/' + state.publishedData[i].finish_date.split('/')[1] +
                            '/0' + state.publishedData[i].finish_date.split('/')[2]
                    }
                }

                for (var i in state.publishedData) {
                    var devices = '';
                    var devices_type = '';
                    var operations = '';
                    var measures = '';
                    for (var j in state.publishedData[i].task_details[0].details) {
                        devices += state.publishedData[i].task_details[0].details[j].device + ' ';
                        operations += state.publishedData[i].task_details[0].details[j].operation + ' ';
                        measures += state.publishedData[i].task_details[0].details[j].measure_type + ' ';
                        devices_type += state.publishedData[i].task_details[0].details[j].device_type + ' ';
                    }
                    state.publishedData[i].devices = devices;
                    state.publishedData[i].operations = operations;
                    state.publishedData[i].measures_type = measures;
                    state.publishedData[i].device_types = devices_type;
                }
            }
            state.publishedData = state.publishedData.reverse();
        },
        //users
        SUPERALLUSERS(state, result) {
            console.log(result);
            state.allUsers = [];
            for (var i in result.users) {
                if (result.users[i].role === 'superadmin') {
                    result.users[i].role = '超级管理员';
                    state.allUsers.push(result.users[i])
                } else if (result.users[i].role === 'admin') {
                    result.users[i].role = '管理员';
                    state.allUsers.push(result.users[i])
                }
            }
        },
        ADMINALLUSERS(state, result) {
            state.allUsers = [];
            for (var i in result.users) {
                if (result.users[i].role === 'admin' && result.users[i].company_id === state.user.company_id) {
                    result.users[i].role = '管理员';
                    state.allUsers.push(result.users[i])
                } else if (result.users[i].role === 'appuser' && result.users[i].company_id === state.user.company_id) {
                    result.users[i].role = '普通用户';
                    state.allUsers.push(result.users[i])
                }
            }
        },
        ALLUSERS(state, result) {
            console.log(result);
            state.allUsers = [];
            if (state.user.role === 'appuser') {
                state.allUsers.push(result.user);
            } else {
                state.allUsers = result.users;
            }
            for (var i in state.allUsers) {
                if (state.allUsers[i].role === 'admin') {
                    state.allUsers[i].role = '管理员';
                } else if (state.allUsers[i].role === 'superadmin') {
                    state.allUsers[i].role = '超级管理员';
                } else {
                    state.allUsers[i].role = '普通用户';
                }
            }
        },
        reloads(state, result) {
            state.user_id = result.user_id;
            state.user = result.user;
            state.user_password = result.user_password;
            state.jwtToken = result.jwtToken;
        },
        fuheprint(state, result) {
            state.newtaskid = result._id;
        },
        GETSUPERTASKLIST(state, result){
            for (var i in result){
                if (result[i].details){
                    var data = '';
                    for (var j in result[i].details){
                        if (result[i].details[j].device_type){
                            data = data + result[i].details[j].device_type + result[i].details[j].device + result[i].details[j].operation + ';'
                        } else {
                            data = data + result[i].details[j].device + result[i].details[j].operation + ';'
                        }
                    }
                    result[i].message = data;
                    result[i].type = '单步任务';
                } else {
                    var data1 = '';
                    for (var k in result[i].combinations){
                        data1 = data1 + result[i].combinations[k] + ';'
                    }
                    result[i].message = data1;
                    result[i].type = '复合型任务';
                }
                result[i].index = Number(i)
            }
            state.supertasklist = result
        },
        GETADMINTASKLIST(state, result){
            for (var i in result){
                if (result[i].details){
                    var data = '';
                    for (var j in result[i].details){
                        if (result[i].details[j].device_type){
                            data = data + result[i].details[j].device_type + result[i].details[j].device + result[i].details[j].operation + ';'
                        } else {
                            data = data + result[i].details[j].device + result[i].details[j].operation + ';'
                        }
                    }
                    result[i].message = data;
                    result[i].type = '单步任务';
                } else {
                    var data1 = '';
                    for (var k in result[i].combinations){
                        data1 = data1 + result[i].combinations[k] + ';'
                    }
                    result[i].message = data1;
                    result[i].type = '复合型任务';
                }
                result[i].index = Number(i)
            }
            state.admintasklist = result
        },
    },
    actions: {
        login(context, payload) {
            context.commit("login", payload);
        },
        logout(context) {
            context.commit("logout");
        },
        endpoint(context, payload) {
            context.commit("endpoint", payload);
        },
        async getComponents({commit, state}, params = {}) {
            let result = await getComponentsData(params, state.jwtToken);
            if (result) {
                commit('SAVEDATA', result[0])
            }
        },
        postData({commit, state}, params) {
            postRiskData(state.user.company_id, params, state.jwtToken).then((res) => {
                commit('fuheprint', res)
            })
        },
        async getPublishData({commit, state}, params) {
            let result = await gettableData(state.user.company_id, params, state.jwtToken);
            if (result) {
                commit('PUBLISHDATA', result);
            } else if (result === null) {
                commit('PUBLISHDATA', []);
            }
        },
        async getmutiComponents({commit, state}, params = {}) {
            let result = await getComponentsData(params, state.jwtToken);
            if (result) {
                commit('SAVEMUTIDATA', result[0])
            }
        },
        //user
        async getuserMessage({commit, state}, params) {
            let result = await getuser(params, state.jwtToken);
            if (result) {
                commit('saveuser', result);
                let companyname = await getcompanyname(result.user.company_id, state.jwtToken)
                if (companyname) {
                    commit('savecompanyname', companyname)
                }
            }
        },
        async getallusersMessage({commit, state}, role) {
            let result = await getallusers(state.jwtToken);
            if (result && role === 'superadmin') {
                commit('SUPERALLUSERS', result);
            } else {
                commit('ADMINALLUSERS', result);
            }
        },
        async getoneusersMessage({commit, state}) {
            let result = await getoneusers(state.user_id);
            if (result) {
                commit('ALLUSERS', result);
            }
        },
        async addnewuser({state}, body) {
            await postnewuser(body, state.jwtToken);
        },
        async adminupdate({state}, body) {
            await postadminupdate(body.id, body.body, state.jwtToken);
        },
        //超级管理员新增分公司、创建分公司管理员
        async addnewcompany({state},body) {
            let result = await postsuperaddcompany(body, state.jwtToken);
            if (result){
                postcopytask(body.id, state.jwtToken)
            }
        },
        //超级管理员获取任务列表数据
        async getsuperlist({commit,state}) {
            let result = await getsupertasklist(state.jwtToken);
            if(result){
                commit("GETSUPERTASKLIST", result)
            }
        },
        async getadminlist({commit,state}) {
            let result = await getadmintasklist(state.user.company_id,state.jwtToken);
            if(result){
                commit("GETADMINTASKLIST", result)
            }
        }
    },
    modules: {},
});
