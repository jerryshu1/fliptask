import { createStore } from "vuex";

export default createStore({
    state: {
        printData: [],
        riskandmeasure: {},
        risk_and_measure: {},
        lens: {},
        companyinfo: {},
        current_userinfo: {},
        companylist: [],
        stationlist: [],
        station: '',
        company: '',
        categorylist: [], //某电站下的所有线路
        newtaskid: '',
    },
    mutations: {
        clearstation(state){
            state.station = ''
        },
        clearstationlist(state){
            state.stationlist = []
            state.station = ''
        },
        savenewtaskid(state, data){
            state.newtaskid = data
        },
        saveriskandmeasure(state, data){
            state.riskandmeasure = data
        },
        saveprintdata(state, data){
            state.printData = data
        },
        savecategorylist(state,data){
            state.categorylist = data
        },
        savestation1(state, data){
            state.station = data
        },
        savecompany(state, data){
            state.company = data
        },
        savestationlist(state, data){
            state.stationlist = data
        },
        savecompanylist(state, data){
            state.companylist = data
        },
        saveuserinfo(state, data) {
            state.current_userinfo = data
        },
        deletetask(state) {
            state.risk_and_measure = {}
            state.lens = {}
            state.companyinfo = {}
        },
        savestation(state, result) {
            state.companyinfo = result
        },
        savenewriskandmeasure(state, result) {
            let keys = Object.keys(result)
            for (var i in keys) {
                state.risk_and_measure[keys[i]] = result[keys[i]]
            }
        },
        savelens(state, result) {
            let keys = Object.keys(result)
            for (var i in keys) {
                state.lens[keys[i]] = result[keys[i]]
            }
        }
    },
    actions: {
    },
    modules: {},
});
