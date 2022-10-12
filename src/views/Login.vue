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
              <q-input v-model="id" label="User ID">
                <template #prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input v-model="password" type="password" label="Password">
                <template #prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <q-card-actions class="q-px-lg q-mt-md q-mb-xl">
                <q-btn
                
                  unelevated
                  size="lg"
                  class="btn"
                  type="submit"
                  label="Sign In"
                  :loading="submitting"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { Buffer } from "buffer";
import { useRouter } from "vue-router";
// import authapi from "../services/auth";
import { getcompanyname, postlogin } from "../api/getComponents";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "PageLogin",

  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const id = ref("");
    const password = ref("");
    const submitting = ref(false);

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
        postlogin(creds).then((res) => {
          if (res) {
            creds.token = res.token;
            store.commit("savetoken", creds);
            store.dispatch("getuserMessage", creds.id);
            router.replace({ path: "/published" });
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
.firstline{
    height: 150px;
    width: 100%;
    background:rgba(21, 39, 141, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.my-card {
  width:80%;
  color: white;
  background-color: transparent;
}

.q-my-md{
  font-size: calc(100vw * 42 / 1920);
  color: white;
  font-weight: 700;
  line-height: 60px;
}

.q-page{
    background-image: url("../assets/loginbg.jpeg");
    background-size: 100% 100%;
    background-position: center center;
    overflow: auto;
    background-repeat: no-repeat;
}

.loginbox{
    background-clip: padding-box;
    width: 100%;
    background-color:  rgba(255, 255, 255, 0.8);
    padding-bottom: 5%;
}

.loginbox .line{
    width: 80%;
    margin: 0 auto;
    padding: 30px;
    border-bottom: 1px #0E37AC solid;
    margin-bottom: 30px;
}

.loginbox .line .circle{
    width: 30px;
    height: 30px;
}

.q-form{
  width: 40%;
  margin: 0 auto;
}

.q-icon{
  font-size: 25px;
  color: #0E37AC;
}
.q-input{
  margin-top: 5%;
}

.btn{
  width: 30%;
  background-color: rgba(21, 39, 141, 0.9);
  margin: 0 auto;
  margin-top: 10%;
}

</style>
