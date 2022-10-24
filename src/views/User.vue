<template>
  <div>
    <div class="title">
      <el-icon>
        <List />
      </el-icon>
      <p>用户中心</p>
    </div>

    <el-table border :data="userinfos" style="width: 85%;margin-left: 7%;margin-top: 1%"
      v-if="current_userinfo.role === 'superadmin'">
      <el-table-column prop="id" label="ID" align='center' />
      <el-table-column prop="name" label="姓名" align='center' />
      <el-table-column prop="phone" label="电话号码" align='center' />
      <el-table-column prop="role" label="角色" align='center' />
      <el-table-column prop="company_id" label="分公司id" align='center' />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button @click="Deleteuser(scope.row)" type="text" size="small" v-if="scope.row.role !== '超级管理员'">
            删除用户
          </el-button>
          <el-button @click="Changepassword(scope.row)" type="text" size="small"
            v-if="scope.row.id === current_userinfo.id">
            修改密码
          </el-button>
          <el-button type="text" size="small" @click="xiugai(scope.row)" v-if="scope.row.role !== '超级管理员'">修改用户信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button class="homebutton1" @click="adduser" v-if="current_userinfo.role !== 'appuser'">
      新增用户
    </el-button>

    <!-- 修改用户信息 -->
    <el-dialog title="修改用户信息" v-model="dialogTableVisible1" width="30%">
      <el-form :model="form" label-position="right" label-width="auto" :rules="rules1">
        <!-- <el-form-item label="工号" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item> -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="权限" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio label="管理员"></el-radio>
            <el-radio label="普通用户"></el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span class="btn">
        <el-button class="hmebutton" @click="dialogTableVisible1 = false">取 消</el-button>
        <el-button class="hmebutton" type="primary" @click="adminupdate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增分公司管理员 -->
    <el-dialog title="分公司创建新用户" v-model="dialogTableVisible2" width="40%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号" prop="id">
          <el-input v-model="ruleForm.id" style="width: 300px" placeholder="请输入登录工号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" style="width: 300px" placeholder="请输入登录密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone" style="width: 300px" placeholder="请输入员工联系电话"></el-input>
        </el-form-item>
        <el-form-item label="员工权限" prop="role" v-if="current_role === 'admin'">
          <el-radio-group v-model="ruleForm.role">
            <el-radio label="分公司管理员"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm1">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="gousers1">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新建站点管理员 -->
    <el-dialog title="站点创建新用户" v-model="dialogTableVisible3" width="40%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="账户" prop="id">
          <el-input v-model="ruleForm.id" placeholder="请输入登录工号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入登录密码" type="password">
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入员工联系电话"></el-input>
        </el-form-item>
        <el-form-item label="员工权限" prop="role">
          <el-radio-group v-model="ruleForm.role">
            <el-radio label="站点管理员"></el-radio>
            <el-radio label="普通用户"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="btngroup">
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="gousers">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useStore, mapState } from "vuex";
import { List } from "@element-plus/icons";
import {
  postcopytask,
  postsuperaddcompany,
  // changepassword,
  // deletecompany,
  getallusers,
  deleteuser,
  postnewuser,
  getoneusers,
  newgetusersinfo,
  newgetoneuserinfo,
  newpostuserreset,
  newpostchangeuserinfo,
  newdeleteoneuserinfo,
  newpostadduser
} from "../api/getComponents";
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  name: "PageUser",
  components: {
    List
  },
  setup() {
    const userinfos = ref([])
    const current_role = ref('')
    const current_id = ref('')
    const id = ref('')
    const dialogTableVisible2 = ref(false)
    const dialogTableVisible1 = ref(false)
    const dialogTableVisible3 = ref(false)
    const ruleForm = reactive({
      id: '',
      name: '',
      phone: '',
      // companyname: '',
      // companyid: '',
      password: '',
      role: '普通用户',
    })
    const form = reactive({
      name: '',
      phone: '',
    })
    const ruleFormRef = ref()
    const changepeople = ref({})
    const rules1 = reactive({
      phone: [
        { message: '请输入手机号', trigger: 'change' },
        { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
      ],
      // password: [
      //   {message: '请输入密码', trigger: 'change'},
      //   {min: 9, message: '密码位数需大于8位', trigger: 'change'}
      // ],
      name: [
        { message: '请输入手机号', trigger: 'change' },
      ],
      id: [
        { required: true, trigger: 'change' },
      ],
      role: [
        { trigger: 'change' },
      ]
    })
    const rules = reactive({
      phone: [
        // 添加正则表达式 pattern: /^1[3|5|7|8|9]\d{9}$/，验证手机号是否正确
        { message: '请输入手机号', trigger: 'change' },
        { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'change' },
        { min: 9, message: '密码位数需大于8位', trigger: 'change' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'change' },
      ],
      companyname: [
        { required: true, message: '请输入所属分公司名称', trigger: 'change' },
      ],
      companyid: [
        { required: true, message: '请输入所属分公司id', trigger: 'change' },
        { pattern: /^\w+$/, message: 'id由大小写字母以及数字', trigger: 'change' },
      ],
      id: [
        { required: true, trigger: 'change' },
      ],
      role: [
        { required: true, trigger: 'change' },
      ]
    })

    const store = useStore();

    const storeStateFns = mapState(["current_userinfo", "company", "station"])
    const storeState = {};
    Object.keys(storeStateFns).forEach((fnKey) => {
      const fn = storeStateFns[fnKey].bind({ $store: store });
      storeState[fnKey] = computed(fn);
    })

    const newgetusers = () => {
      let current_userinfo = store.state.current_userinfo
      let company = store.state.company
      let station = store.state.state

      if (current_userinfo.role === 'superadmin') {
        let company_name = ''
        let station_name = ''
        if (company === '') {
          company_name = 'any'
        } else {
          company_name = company
        }
        if (station === '') {
          station_name = 'any'
        } else {
          station_name = station
        }
        newgetusersinfo(company_name, station_name).then((res) => {
          if (res) {
            console.log(res);
            userinfos.value = res.users
            for (var i in userinfos.value) {
              if (userinfos.value[i].role === "companyadmin") {
                userinfos.value[i].role = "分公司管理员";
              } else if (userinfos.value[i].role === "superadmin") {
                userinfos.value[i].role = "超级管理员";
              } else if (userinfos.value[i].role === "stationadmin") {
                userinfos.value[i].role = "站点管理员";
              } else {
                userinfos.value[i].role = "普通用户";
              }
            }
          }
        })
      } else if (current_userinfo.role === 'companyadmin') {
        let station_name = ''
        if (station === '') {
          station_name = 'any'
        } else {
          station_name = station
        }
        newgetusersinfo(company, station_name).then((res) => {
          if (res) {
            userinfos = res.users
            for (var i in userinfos) {
              if (userinfos[i].role === "companyadmin") {
                userinfos[i].role = "分公司管理员";
              } else if (userinfos[i].role === "stationadmin") {
                userinfos[i].role = "站点管理员";
              } else {
                userinfos[i].role = "普通用户";
              }
            }
          }
        })
      } else if (current_userinfo.role === 'stationadmin') {
        newgetusersinfo(company, station).then((res) => {
          if (res) {
            userinfos = res.users
            for (var i in userinfos) {
              if (userinfos[i].role === "stationadmin") {
                userinfos[i].role = "站点管理员";
              } else {
                userinfos[i].role = "普通用户";
              }
            }
          }
        })
      } else {
        newgetoneuserinfo(company, station, current_userinfo.id).then((res) => {
          if (res) {
            userinfos = [res.user]
            userinfos[0].role = "普通用户"
          }
        })

      }
    }
    const getadminalluser = () => {
      let companyid = store.state.user.company_id
      getallusers().then((res) => {
        if (res) {
          userinfos.value = []
          for (var i in res.users) {
            if (res.users[i].role === 'admin' && res.users[i].company_id === companyid) {
              res.users[i].role = '管理员'
              userinfos.value.push(res.users[i])
            } else if (res.users[i].role === 'appuser' && res.users[i].company_id === companyid) {
              res.users[i].role = '普通用户'
              userinfos.value.push(res.users[i])
            }
          }
        }
      })
    }

    const getsuperadminalluser = () => {
      getallusers().then((res) => {
        if (res) {
          userinfos.value = []
          for (var i in res.users) {
            if (res.users[i].role === 'admin') {
              res.users[i].role = '管理员'
              userinfos.value.push(res.users[i])
            } else if (res.users[i].role === 'superadmin') {
              res.users[i].role = '超级管理员'
              userinfos.value.push(res.users[i])
            }
          }
        }
      })
    }
    const getappuser = () => {
      userinfos.value = []
      getoneusers(store.state.user.id).then((res) => {
        if (res) {
          userinfos.value.push(res.user)
        }
      })
    }
    const adduser = () => {
      dialogTableVisible3.value = true
    }
    const gousers = () => {
      dialogTableVisible3.value = false
    }
    const adduser1 = () => {
      dialogTableVisible2.value = true
    }
    const gousers1 = () => {
      dialogTableVisible2.value = false
    }
    // 站点管理员
    const submitForm = () => {
      if (ruleForm.id === '' || ruleForm.password === '' || ruleForm.password.length <= 8 || ruleForm.name === '') {
        ElMessage({
          message: '信息不足',
          type: 'error',
        })
      } else {
        if (ruleForm.role === "站点管理员") {
          ruleForm.role = "stationadmin";
        } else {
          ruleForm.role = "appuser";
        }
        var userdata = {
          id: ruleForm.id,
          name: ruleForm.name,
          phone: ruleForm.phone,
          password: ruleForm.password,
        }
        newpostadduser(company, station, userdata).then(() => {
          ElMessage({
            message: '添加用户成功',
            type: 'success',
          })
          newgetusers()
          dialogTableVisible3.value = false
        })
      }
    }

    // 分公司管理员
    const submitForm1 = () => {
      if (ruleForm.id === '' || ruleForm.password === '' || ruleForm.password.length <= 8 || ruleForm.name === '') {
        ElMessage({
          message: '信息不足',
          type: 'error',
        })
      } else {
        ruleForm.role === "companyadmin"
         
        var userdata = {
          id: ruleForm.id,
          name: ruleForm.name,
          phone: ruleForm.phone,
          password: ruleForm.password,
        }
        newpostadduser(company, "any", userdata).then(() => {
          ElMessage({
            message: '添加用户成功',
            type: 'success',
          })
          newgetusers()
          dialogTableVisible2.value = false
        })
      }
    }

    const superadminsubmitForm = () => {
      if (ruleForm.id === '' || ruleForm.password === '' || ruleForm.password.length <= 8 || ruleForm.companyname === '' || ruleForm.companyid === '') {
        ElMessage({
          message: '信息不足',
          type: 'error',
        })
      } else {
        ruleForm.role = 'admin';
        var userdata = {
          id: ruleForm.id,
          name: ruleForm.name,
          phone: ruleForm.phone,
          password: ruleForm.password,
          company_id: ruleForm.companyid,
          role: 'admin',
        }
        var companydata = {
          name: ruleForm.companyname,
          id: ruleForm.companyid,
        }
        postnewuser(userdata).then(() => {
          postsuperaddcompany(companydata).then((res) => {
            postcopytask(companydata.id)
          })
          getsuperadminalluser()
          dialogTableVisible2.value = false
        })
      }
    }
    const Deleteuser = (prop) => {
      ElMessageBox.confirm(
        '是否删除该用户', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          newdeleteoneuserinfo(prop.company, prop.station, prop.id).then((res) => {
            newgetusers()
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
          })
        }).catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })


    }
    const resetForm = (formEl) => {
      formEl.resetFields()
    }
    const Deleteadminuser = (prop) => {
      ElMessageBox.confirm(
        '是否删除该用户',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',

        }
      ).then(() => {
        deleteuser(prop.id).then((res) => {
          getsuperadminalluser()
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
    }
    // const deleteCompany = () => {
    //   ElMessageBox.prompt('请输入需要删除的分公司id', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //   }).then(({ value }) => {
    //     deletecompany(value).then((res) => {
    //       if (res) {
    //         ElMessage({
    //           message: '删除成功',
    //           type: 'success',
    //         })
    //       }
    //     })
    //   }).catch(() => {
    //     ElMessage({
    //       type: 'info',
    //       message: '取消删除'
    //     });
    //   });
    // }
    const xiugai = (prop) => {
      changepeople.value = prop
      dialogTableVisible1.value = true
    }
    const adminupdate = () => {
      // console.log(changepeople.id);
      let params = {
        id: changepeople.value.id,
        name: form.name,
        phone: form.phone
      }
      let station = ''
      if (changepeople.value.station) {
        station = changepeople.station
      } else {
        station = 'any'
      }
      newpostchangeuserinfo(changepeople.value.company, station, changepeople.value.id, params).then((res) => {
        // if (res) {
        newgetusers()
        ElMessage({
          type: 'success',
          message: '用户信息修改成功'
        });
        dialogTableVisible1.value = false;
        // }
      })
    }
    // const Changepassword = (prop) => {
    //   ElMessageBox.prompt('请输入新密码', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /^(?=.*\d)[\s\S]{9,16}$/,
    //     inputErrorMessage: '密码长度需大于8位',
    //   }).then(({ value }) => {
    //     let body = {
    //       password: value
    //     }
    //     if (store.state.role === 'admin') {
    //       adminchangepassword(prop.id, body).then((res) => {
    //         ElMessage({
    //           type: 'success',
    //           message: '修改成功'
    //         })
    //       })
    //     } else {
    //       changepassword(prop.id, body).then((res) => {
    //         ElMessage({
    //           type: 'success',
    //           message: '修改成功'
    //         })
    //       })
    //     }
    //   }).catch(() => {
    //     ElMessage({
    //       type: 'info',
    //       message: '取消修改'
    //     });
    //   });
    // }

    const Changepassword = (prop) => {
      ElMessageBox.prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          if (value.length <= 8) {
            ElMessage({
              type: "error",
              message: "密码位数需大于8位",
            });
          } else {
            let body = {
              password: value,
            };
            let company_name = ''
            let station_name = ''
            if (company === '') {
              company_name = 'any'
            } else {
              company_name = company
            }
            if (station === '') {
              station_name = 'any'
            } else {
              station_name = station
            }
            newpostuserreset(company_name, station_name, prop.id, body).then(() => {
              ElMessage({
                type: "success",
                message: "密码修改成功",
              });
            })
          }
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消修改",
          });
        });
    }
    onMounted(() => {
      newgetusers()

      // current_role.value = store.state.user.role
      // current_id.value = store.state.user.id
      // if (store.state.user.role === 'admin') {
      //   getadminalluser()
      // } else if (store.state.user.role === 'superadmin') {
      //   getsuperadminalluser()
      // } else {
      //   getappuser()
      // }
    })

    return {
      userinfos,
      dialogTableVisible2,
      dialogTableVisible1,
      dialogTableVisible3,
      id,
      ruleForm,
      ruleFormRef,
      rules1,
      rules,
      form,
      current_role,
      current_id,
      changepeople,

      getadminalluser,
      getsuperadminalluser,
      adduser,
      adduser1,
      submitForm,
      submitForm1,
      superadminsubmitForm,
      resetForm,
      gousers,
      gousers1,
      Deleteuser,
      Deleteadminuser,
      xiugai,
      adminupdate,
      Changepassword,
      getappuser,
      newgetusers,
      ...storeState,
      List,
    };
  },
});
</script>

<style>
.title {
  display: flex;
  margin-top: 3%;
  margin-left: 7%;
}

.title .el-icon {
  font-size: calc(100vw * 26 / 1920);
  margin-right: 20px;
}

.title p {
  color: black;
  font-size: calc(100vw * 20 / 1920);
  font-weight: 800;
}

.homebutton1 {
  width: 150px;
  height: 40px;
  font-size: calc(100vw * 16 / 1920);
  margin-top: 5%;
  margin-bottom: 5%;
  color: #FFFFFF;
  margin-left: 45%;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}

.el-table {
  margin-left: 3%;
}

.hmebutton {
  width: 100px;
  height: 40px;
  font-size: calc(100vw * 16 / 1920);
  margin-top: 20px;
  color: #ffffff;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}
</style>
