<template>
  <router-view></router-view>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  mounted() {
    const store = useStore();
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('state', JSON.stringify(store.state));
    })
  },
  created() {
    const store = useStore();
    if (sessionStorage.length !== 0){
      store.commit('reloads', JSON.parse(sessionStorage.state));
    }
  },
  // methods: {
  //   saveState(){
  //     let store = useStore();
  //     sessionStorage.setItem('state', JSON.stringify(store.state));
  //   }
  // },
  setup() {
    const store = useStore();
    if (window.location.origin != "http://localhost:8080") {
      store.dispatch(
        "endpoint",
        window.location.origin +
          window.location.pathname.split("/").slice(0, -2).join("/")
      );
    }

    const router = useRouter();
    const creds = localStorage.getItem("creds");
    if (creds) {
      const credsInfo = JSON.parse(creds);
      store.dispatch("login", credsInfo);
      // if(this.$route.path === '/secondsearch'){
      //   router.push("/search");
      // }
      // router.push("/search");
    }
  },
};
</script>
