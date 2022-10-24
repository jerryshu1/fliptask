<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>倒闸操作风险预控卡</q-toolbar-title>

        <div class="selectgroup">
          <el-select v-model="current_company" class="choosecomp m-2" placeholder="请选择公司" @change="getstationList" v-if="current_userinfo.role === 'superadmin'">
            <el-option v-for="(item, index) in companylist" :key="index" :label="item" :value="item" />
          </el-select>
          <el-select v-model="current_company" class="choosecomp m-2" placeholder="请选择公司" disabled @change="getstationList" v-else>
            <el-option v-for="(item, index) in companylist" :key="index" :label="item" :value="item"/>
          </el-select>

          <el-autocomplete v-model="current_station" :fetch-suggestions="querySearch" clearable placeholder="请选择站点"
            @select="handleSelect" />
        </div>
        <q-btn-dropdown outline rounded no-caps icon-right="manage_accounts">
          <template #label>
            <div class="row items-center no-wrap">{{ user }}</div>
          </template>
          <q-list>
            <q-item-label header>Account</q-item-label>

            <q-item v-ripple v-close-popup clickable @click="signout">
              <q-item-section avatar>
                <q-avatar size="md" icon="exit_to_app" color="red" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sign Out</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-drawer class="asidemenu" v-model="leftDrawerOpen" bordered>
      <q-list>
        <menu-link v-for="link in essentialLinks" :key="link.title" v-bind="link" @click="test" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLink from "../components/MenuLink.vue";
import { newgetstation, newgetcategorylist } from "../api/getComponents";
const linksList = [
  {
    title: "任务派发",
    icon: "manage_search",
    link: "/newsearch",
  },
  {
    title: "用户中心",
    icon: "people",
    link: "/user",
  },
  {
    title: "已发布任务列表",
    icon: "apps",
    link: "/published",
  },
  {
    title: "风险库中心",
    icon: "store",
    link: "/tasks",
  }
];

import { onMounted, ref, computed } from "vue";
import { useStore, mapState } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "MainLayout",

  methods: {
    test() {
      store.commit("clearnewadddata");
    }
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const user = ref('')
    const current_company = ref('')
    const current_station = ref('')

    const storeStateFns = mapState(["companylist", "stationlist", "company", "station","current_userinfo"])
    const storeState = {};
    Object.keys(storeStateFns).forEach((fnKey) => {
      const fn = storeStateFns[fnKey].bind({ $store: store });
      storeState[fnKey] = computed(fn);
    })

    const signout = () => {
      sessionStorage.clear();
      store.dispatch("logout");
      localStorage.setItem("creds", "");
      window.location.replace("/login")
    };
    const getstationList = (value) => {
      newgetstation(value).then((res1) => {
        let stationlist = []
        if (res1) {
          for (var i in res1.stations) {
            stationlist.push({
              value: res1.stations[i],
            });
          }
          store.commit('savestationlist', stationlist)
          store.commit('savecompany', value)
        }
      })
    };
    const querySearch = (queryString, cb) => {
      let searchlist = store.state.stationlist
      const results = queryString
        ? searchlist.filter(createFilter(queryString))
        : searchlist;
      cb(results);
    };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };
    const handleSelect = (value) => {
      let company = store.state.company
      let params = {
        city: company,
        station: value.value,
      };
      newgetcategorylist(params).then((res) => {
        let categorylist = []
        if (res) {
          for (var i in res.categories) {
            categorylist.push({
              value: res.categories[i],
            });
          }
          store.commit('savecategorylist', categorylist)
          store.commit('savestation1', value.value)
        }
      })
    }
    onMounted(() => {
      current_company.value = store.state.company
      current_station.value = store.state.station
    })

    return {
      essentialLinks: linksList,
      leftDrawerOpen: ref(true),
      user,
      current_company,
      current_station,
      signout,
      getstationList,
      querySearch,
      createFilter,
      handleSelect,

      MenuLink,
      ...storeState,
    };
  },
};
</script>

<style lang="scss">
@import "../styles/app.scss";

.q-toolbar {
  height: 100px;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}

.q-toolbar__title {
  font-weight: 800;
  font-size: calc(100vw * 23 / 1920);
}

.q-icon {
  font-weight: 800;
}

.asidemenu {
  width: 15%;
  background-image: linear-gradient(173deg, rgb(10, 38, 69), rgb(96, 122, 224));
  color: white;
}

.selectgroup {
  display: flex;
  align-items: center;
}

.choosecomp {
  width: 130px;
  margin-right: 2%;
}

.el-autocomplete {
  width: 130px;
  margin-top: 1%;
  margin-bottom: 2%;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
