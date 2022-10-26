<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="fullscreen flex flex-center">
        <q-card square class="my-card shadow-24">
          <q-card-section class="firstline">
            <div class="q-my-md">倒闸操作风险预控卡</div>
          </q-card-section>

          <q-card-section class="loginbox">
            <div class="line">
              <div class="circle">
              </div>
            </div>
            <q-form class="loginform" @submit="onSubmit">
              <q-input v-model="id" label="账号">
                <template #prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input v-model="password" type="password" label="密码">
                <template #prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <q-card-actions class="q-px-lg q-mt-md q-mb-xl">
                <q-btn unelevated size="lg" class="btn" type="submit" label="Sign In" :loading="submitting" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { newpostlogin, newgetallcompany, newgetstation, newgetcategorylist, newgetoneuserinfo } from "../api/getComponents";
import { useStore, mapState } from "vuex";

export default defineComponent({
  name: "PageLogin",

  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const id = ref("");
    const password = ref("");
    const submitting = ref(false);
    const storeStateFns = mapState(["current_userinfo"])
    const storeState = {};
    Object.keys(storeStateFns).forEach((fnKey) => {
      const fn = storeStateFns[fnKey].bind({ $store: store });
      storeState[fnKey] = computed(fn);
    })
    const onSubmit = () => {
      if (id.value == "" || password.value == "") {
        $q.notify({
          position: "top",
          color: "warning",
          textColor: "white",
          icon: "warning",
          message: "Please input",
        });
      } else {
        submitting.value = true;
        let creds = {
          id: id.value,
          password: password.value,
        };
        newpostlogin(creds).then((res) => {
          if (res) {
            localStorage.setItem('token', res.token)
            localStorage.setItem('role', res.role)
            store.commit('clearall')
            store.commit('saveuserinfo', res)
            
            if (res.role === 'superadmin') {
              newgetoneuserinfo('any', 'any', res.id).then((res333) => {
                store.commit('saveuserinfo',res333.user)
              })
              newgetallcompany().then((res1) => {
                if (res1) {
                  store.commit('savecompanylist', res1.companies)
                  localStorage.setItem('companylist', res1.companies)
                }
              })
            }
            if (res.role === 'companyadmin') {
              store.commit('savecompany', res.company)
              newgetoneuserinfo(res.company, 'any', res.id).then((res333) => {
                store.commit('saveuserinfo',res333.user)
              })
              newgetstation(res.company).then((res1) => {
                let stationlist = []
                if (res1) {
                  for (var i in res1.stations) {
                    stationlist.push({
                      value: res1.stations[i],
                    });
                  }
                  store.commit('savestationlist', stationlist)
                  store.commit('savecompany', res.company)
                }
              })
            }
            if (res.role === 'stationadmin' || res.role === 'appuser') {
              newgetoneuserinfo(res.company,res.station, res.id).then((res333) => {
                store.commit('saveuserinfo',res333.user)
              })
              let params = {
                city: res.company,
                station: res.station,
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
                }
              })
              store.commit('savestation1', res.station)
              store.commit('savecompany', res.company)
            }
            if (res.role === 'appuser') {
              router.push({ name: "published" })
            } else {
              router.push({ name: "newsearch" })
            }
          } else {
            $q.notify({
              position: "bottom-right",
              progress: true,
              multiLine: true,
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Invalid credentials",
            });
            store.dispatch("logout");
            submitting.value = false;
          }
        });
      }
    };

    return {
      id,
      password,
      submitting,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.firstline {
  height: 150px;
  width: 100%;
  background: rgba(21, 39, 141, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.my-card {
  width: 80%;
  color: white;
  background-color: transparent;
}

.q-my-md {
  font-size: calc(100vw * 42 / 1920);
  color: white;
  font-weight: 700;
  line-height: 60px;
}

.q-page {
  background-image: url("../assets/loginbg.jpeg");
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
}

.loginbox {
  background-clip: padding-box;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  padding-bottom: 5%;
}

.loginbox .line {
  width: 80%;
  margin: 0 auto;
  padding: 30px;
  border-bottom: 1px #0E37AC solid;
  margin-bottom: 30px;
}

.loginbox .line .circle {
  width: 30px;
  height: 30px;
}

.q-form {
  width: 40%;
  margin: 0 auto;
}

.q-icon {
  font-size: 25px;
  color: #0E37AC;
}

.q-input {
  margin-top: 5%;
}

.btn {
  width: 30%;
  background-color: rgba(21, 39, 141, 0.9);
  margin: 0 auto;
  margin-top: 10%;
}
</style>
