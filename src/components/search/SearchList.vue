<template>
  <div class="col column q-my-md q-ml-md">
    <div class="search-list">
      <q-table
        ref="searchTable"
        v-model:expanded="searchResult._source"
        :rows="searchResult"
        :columns="resultColumns"
        :loading="searchLoading"
        :pagination="pagination"
        wrap-cells
        title="搜索结果"
      >

        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td width="30">
              <q-radio
                  v-model="shape"
                  :val="props.pageIndex"
                  @click="singleclick(props)"
              />
            </q-td>
            <template
                v-for="col in props.cols"
                :key="col.name"
                :props="props">
              <q-td v-if="col.name == '@timestamp'" width="238">
                {{ col.value }}
              </q-td>
              <q-td v-else>
                {{ col.value }}
              </q-td>
            </template>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div>
      <button style="width: 100px;height: 60px;background-color:white;margin-top: 20px;float: left;margin-left: 500px"
      @click="goNext" v-show="shape !== ''">
        下一步
      </button>
      <button style="width: 100px;height: 60px;background-color:white;margin-top: 20px;float: left;margin-left: 500px"
      @click="reload" v-show="shape !== ''">
        取消
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref } from "vue";
import { date } from "quasar";
import store from "../../store";

import {firstsearch, getsearchtasklist} from "../../api/getComponents";

export default defineComponent({
  name: "ComponentSearchSearchList",
  data(){
    return {
      shape: ref(''),
      nextData: {},
    }
  },
  methods:{
    singleclick(props){
      console.log(props);
      this.nextData.details = props.row.detail_raw;
      this.nextData.additional = props.row.additional;
      this.nextData.task_name = props.row.task_name;
      // store.state.additionData = props.row.additional;
      // store.state.taskName = props.row.task_name;
      // store.state.selectedTasks = this.nextData;
      this.$store.commit('signalsearch', this.nextData);
    },
    goNext(){
        let location = {
          name : "choose",
        };
        this.$router.push(location);
    },
    reload(){
      window.location.reload();
    }
  },
  setup() {
    // Accessing nested JavaScript objects and arrays by string path
    // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
    Object.byString = function (o, s) {
      if (s == undefined) {
        return "";
      }
      s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      s = s.replace(/^\./, ""); // strip a leading dot
      var a = s.split(".");
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (typeof o == "object" && k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    };

    const defaultColumns = () => {
      return [
        {
          name: "task_name",
          field: "task_name",
          label: "操作任务",
          align: "left",
          sortable: true,
        },
        {
          name: "details",
          field: "details",
          label: "操作设备",
          align: "left",
          sortable: true,
        },
        {
          name: "additional",
          field: "additional",
          label: "备注",
          align: "left",
          sortable: true,
        },
      ];
    };

    const searchTable = ref(null);
    const searchResult = ref([]);
    const resultTotal = ref(0);
    const resultColumns = defaultColumns();
    // get the normalized date and time from the dateVal object
    const getDateConsumableDateTime = function (dateVal) {
      if (dateVal.tab == "relative") {
        var period = "";
        var periodValue = 0;

        // quasar does not support arithmetic on weeks. convert to days.
        if (dateVal.selectedRelativePeriod.toLowerCase() == "weeks") {
          period = "days";
          periodValue = dateVal.selectedRelativeValue * 7;
        } else {
          period = dateVal.selectedRelativePeriod.toLowerCase();
          periodValue = dateVal.selectedRelativeValue;
        }
        var subtractObject = '{"' + period + '":' + periodValue + "}";

        var endTimeStamp = new Date();
        var startTimeStamp = date.subtractFromDate(
          endTimeStamp,
          JSON.parse(subtractObject)
        );

        return {
          start_time: startTimeStamp,
          end_time: endTimeStamp,
        };
      } else {
        var start, end;

        if (dateVal.startDate == "" && dateVal.startTime == "") {
          start = new Date();
        } else {
          start = new Date(dateVal.startDate + " " + dateVal.startTime);
        }

        if (dateVal.endDate == "" && dateVal.endTime == "") {
          end = new Date();
        } else {
          end = new Date(dateVal.endDate + " " + dateVal.endTime);
        }

        var rVal = {
          start_time: start,
          end_time: end,
        };
        return rVal;
      }
    };

    // whether enable histogram or not
    const chartKeyFormat = ref("HH:mm:ss");
    const chartHistogram = ref(null);
    const chartOptions = {
      chart: {
        id: "search-summary",
        toolbar: {
          show: true,
        },
      },
      grid: {
        borderColor: "#eee",
        strokeDashArray: 5,
      },
      colors: ["#26A69A", "#9C27B0"],
      series: [],
      xaxis: {
        type: "numeric",
        labels: {
          show: false,
          rotateAlways: false,
          rotate: 0,
          hideOverlappingLabels: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          columnWidth: "90%",
        },
      },
      title: {
        text: "",
      },
      noData: {
        text: "Loading...",
      },
    };

    const buildSearch = (queryData) => {
      var req = {
        query: {
          match_phrase: {
            task_name: {
              query: {}
            },
          },
        },
        sort: ["-_score"],
        form: 0,
        size: parseInt(maxRecordToReturn.value, 10),
      };

      if (queryData.query == "") {
        req.query = ref({
            bool: {
              must: {
                match_all: {}
            }
          }
        }).value;
        return req;
      }

      // req.query.bool.must.push({
      //   query_string: {
      //     query: queryData.query,
      //   },
      // });

      req.query.match_phrase.task_name.query = queryData.query;

      return req;
    };

    const maxRecordToReturn = ref(100);
    const selectedPerPage = ref("10");
    const perPageOptions = [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
      { label: "All", value: 0 },
    ];
    const pagination = ref({
      rowsPerPage: 10,
    });
    const changePagination = (val) => {
      selectedPerPage.value = val.label;
      pagination.value.rowsPerPage = val.value;
      searchTable.value.setPagination(pagination.value);
    };

    let lastIndexName = "";
    const searchLoading = ref(false);
    const searchData = (indexData, queryData) => {
      if (searchLoading.value) {
        return false;
      }
      searchLoading.value = true;
      let params = {
        q: queryData.query
      }
      console.log(params);
      getsearchtasklist(store.state.user.company_id, store.state.jwtToken, params)
          .then((res) => {
            if (res === null){
              nextTick(() => {
                searchResult.value = [];
                // results.forEach(result => searchResult.value.push(result._source));

                resultTotal.value = 0;
                searchLoading.value = false;
              });
            } else if (res === 0) {
              nextTick(() => {
                searchResult.value = [];
                // results.forEach(result => searchResult.value.push(result._source));

                resultTotal.value = 0;
                searchLoading.value = false;
              });
            } else if (res[0].combinations) {
              nextTick(() => {
                searchResult.value = [];
                // results.forEach(result => searchResult.value.push(result._source));

                resultTotal.value = 0;
                searchLoading.value = false;
              });
            } else {
              if (lastIndexName != "" && lastIndexName != indexData.name) {
                resetColumns(indexData);
              }
              lastIndexName = indexData.name;

              var results = [];
              results = res;
              const diplayresults = [];
              for (var i in results) {
                if (results[i].combinations){
                  continue
                }
                var obj = {
                  detail_raw: results[i].details,
                  additional: results[i].additional,
                  task_name: results[i].task_name,
                  order_number: results[i].order_number,
                  details: results[i].details.reduce((acc, detail) => {
                    if (detail.device_type !== '--') {
                      acc += detail.device_type;
                    }
                    acc += detail.device + ": " + detail.operation + "; ";
                    return acc
                  }, '')
                };
                diplayresults.push(obj);
              }
              nextTick(() => {
                searchResult.value = diplayresults;
                // results.forEach(result => searchResult.value.push(result._source));

                resultTotal.value = results.length;
                searchLoading.value = false;
              });
            }
          });
    }

    const resetColumns = (indexData) => {
      resultColumns.value = defaultColumns();
      if (indexData.columns.length == 0) {
        return;
      }
      // remove _source column
      resultColumns.value.splice(0);
      // add all the selected fields one by one
      for (let i = 0; i < indexData.columns.length; i++) {
        var newCol = {
          name: indexData.columns[i],
          label: indexData.columns[i],
          field: (row) => Object.byString(row._source, indexData.columns[i]),
          align: "left",
          sortable: true,
        };
        resultColumns.value.push(newCol);
      }
    };

    return {
      searchData,
      resetColumns,
      resultColumns,
      searchResult,
      resultTotal,
      searchLoading,
      selectedPerPage,
      maxRecordToReturn,
      perPageOptions,

      changePagination,
      chartHistogram,
      chartOptions,
    };
  },
});
</script>

<style lang="scss">
.max-result {
  width: 170px;
}
.search-list {
  width: 100%;
  .chart {
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  .q-table__top {
    padding: 5px 0 0 0;
  }
  .q-table thead tr,
  .q-table tbody td {
    height: 38px;
    padding: 6px 12px;
  }
  .q-table__bottom {
    width: 100%;
  }
  .q-table__bottom {
    min-height: 40px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .q-td {
    word-wrap: break-word;
    word-break: break-all;
    .expanded {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
