<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>倒闸操作风险预控卡</q-toolbar-title>

        <div>
          <q-btn-dropdown outline rounded no-caps icon-right="manage_accounts">
            <template #label>
              <div class="row items-center no-wrap">{{ user }}</div>
            </template>
            <q-list>
              <q-item-label header>Account</q-item-label>

              <q-item v-ripple v-close-popup clickable @click="signout">
                <q-item-section avatar>
                  <q-avatar
                    size="md"
                    icon="exit_to_app"
                    color="red"
                    text-color="white"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Sign Out</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="asidemenu"
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <menu-link
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @click="test"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component
            :is="Component"
            v-if="$route.meta.keepAlive"
            :key="$route.name"
          />
        </keep-alive>
        <component
          :is="Component"
          v-if="!$route.meta.keepAlive"
          :key="$route.name"
        />
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLink from "../components/MenuLink.vue";

const linksList = [
  {
    title: "任务搜索",
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
    icon: "apps",
    link: "/tasks",
  }
];

import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import store from "../store";

export default {
  name: "MainLayout",

  components: {
    MenuLink,
  },
  methods: {
    test(){
      store.commit("clearnewadddata");
    }
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const user = ref('')

    const signout = () => {
      sessionStorage.clear();
      store.dispatch("logout");
      localStorage.setItem("creds", "");
      window.location.replace("/login")
    };

    user.value = store.state.user.name
    
    return {
      essentialLinks: linksList,
      leftDrawerOpen: ref(false),
      user,
      signout,
    };
  },
};
</script>

<style lang="scss">
@import "../styles/app.scss";

.q-toolbar{
  height: 100px;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}

.q-toolbar__title{
  font-weight: 800;
  font-size: calc(100vw * 23 / 1920);
}

.q-icon{
  font-weight: 800;
}

.asidemenu{
  width: 15%;
	background-image: linear-gradient(173deg, rgb(10, 38, 69), rgb(96, 122, 224));
  color: white;
}


</style>
