<template>
  <div>
    <div class="title">
      <el-icon>
        <List />
      </el-icon>
      <p>用户中心</p>
    </div>

    <el-table border :data="userlist" style="width: 85%;margin-left: 7%;margin-top: 1%" v-if="this.usermessage.role === 'superadmin'">
      <el-table-column prop="id" label="ID" align='center' />
      <el-table-column prop="name" label="姓名" align='center' />
      <el-table-column prop="phone" label="电话号码" align='center' />
      <el-table-column prop="role" label="角色" align='center' />
      <el-table-column prop="company_id" label="分公司id" align='center' />
      <el-table-column label="操作" align='center'>
        <template #default="scope">
          <el-button @click="Deleteadminuser(scope.row)" type="text" size="small" v-if="scope.row.role === '管理员'">删除用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table border :data="userlist" style="width: 85%;margin-left: 7%;margin-top: 1%" v-else>
      <el-table-column prop="id" label="ID" align='center' />
      <el-table-column prop="name" label="姓名" align='center' />
      <el-table-column prop="phone" label="电话号码" align='center' />
      <el-table-column prop="role" label="角色" align='center' />
      <el-table-column prop="company_id" label="分公司id" align='center' />
      <el-table-column label="操作" align='center'>
        <template #default="scope">
          <el-button @click="Deleteuser(scope.row)" type="text" size="small"
            v-if="scope.row.role !== '管理员' && this.usermessage.role === 'admin'">删除用户
          </el-button>
          <el-button @click="Changepassword(scope.row)" type="text" size="small">修改密码
          </el-button>
          <el-button type="text" @click="xiugai(scope.row)" v-if="this.usermessage.role === 'admin'">修改用户信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button class="homebutton1" @click="adduser" v-if="this.usermessage.role === 'admin'">
      新增用户
    </el-button>
    <el-button class="homebutton1" style="margin-left: 30%; margin-top: 40px" @click="adduser"
      v-if="this.usermessage.role === 'superadmin'">
      新增分公司
    </el-button>
    <el-button class="homebutton1" style="margin-left: 30%; margin-top: 40px" @click="deleteCompany"
      v-if="this.usermessage.role === 'superadmin'">
      删除分公司
    </el-button>

    <!-- 修改用户信息 -->
    <el-dialog title="修改用户信息" v-model="dialogTableVisible" width="30%">
      <el-form :model="form" :rules="rules1">
        <el-form-item label="工号" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio label="管理员"></el-radio>
            <el-radio label="普通用户"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span class="btn">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="adminupdate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增分公司 -->
    <el-dialog title="新建用户" v-model="dialogTableVisible2" width="40%">
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
        <el-form-item label="所属分公司" prop="companyname" v-if="this.usermessage.role === 'superadmin'">
          <el-input v-model="ruleForm.companyname" style="width: 300px" placeholder="请输入所属分公司名称"></el-input>
        </el-form-item>
        <el-form-item label="分公司id" prop="companyid" v-if="this.usermessage.role === 'superadmin'">
          <el-input v-model="ruleForm.companyid" style="width: 300px" placeholder="请输入所属分公司id"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone" style="width: 300px" placeholder="请输入员工联系电话"></el-input>
        </el-form-item>
        <el-form-item label="员工权限" prop="role" v-if="this.usermessage.role === 'admin'">
          <el-radio-group v-model="ruleForm.role">
            <el-radio label="管理员"></el-radio>
            <el-radio label="普通用户" v-if="this.usermessage.role === 'admin'"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" v-if="this.usermessage.role === 'admin'">立即创建</el-button>
          <el-button type="primary" @click="superadminsubmitForm" v-else>立即创建</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button @click="gousers">返回</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import { mapState, useStore } from "vuex";
import { useQuasar, date } from "quasar";
import userService from "../services/user";
import { List } from "@element-plus/icons";

import {
  postcopytask,
  postsuperaddcompany,
  changepassword,
  deletecompany,
  getallusers,
  deleteuser,
  postnewuser,
  postadminupdate
} from "../api/getComponents";
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  name: "PageUser",
  data() {
    return {
      input: '',
      dialogTableVisible: false,
      // dialogTableVisible2: false,
      id: '',
    }
  },
  components: {
    List
  },
  computed: {
    ...mapState({
      usermessage: (state) => {
        return state.user
      },
      token: (state) => {
        return state.jwtToken
      },
      allusers: (state) => {
        return state.allUsers
      }
    })
  },

  setup() {
    const userlist = ref([])
    const id = ref('')
    const dialogTableVisible2 = ref(false)
    const dialogTableVisible = ref(false)
    const ruleForm = reactive({
      id: '',
      name: '',
      phone: '',
      companyname: '',
      companyid: '',
      password: '',
      role: '普通用户',
    })
    const form = reactive({
      id: '',
      password: '',
      name: '',
      phone: '',
      role: ''
    })
    const ruleFormRef = ref()
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

    const getadminalluser = () => {
      let companyid = store.state.user.company_id
      getallusers().then((res) => {
        if (res) {
          userlist.value = []
          for (var i in res.users) {
            if (res.users[i].role === 'admin' && res.users[i].company_id === companyid) {
              res.users[i].role = '管理员'
              userlist.value.push(res.users[i])
            } else if (res.users[i].role === 'appuser' && res.users[i].company_id === companyid) {
              res.users[i].role = '普通用户'
              userlist.value.push(res.users[i])
            }
          }
        }
      })
    }
    const getsuperadminalluser = () => {
      getallusers().then((res) => {
        if (res) {
          userlist.value = []
          for (var i in res.users) {
            if (res.users[i].role === 'admin') {
              res.users[i].role = '管理员'
              userlist.value.push(res.users[i])
            } else if (res.users[i].role === 'superadmin') {
              res.users[i].role = '超级管理员'
              userlist.value.push(res.users[i])
            }
          }
        }
      })
    }
    const adduser = () => {
      dialogTableVisible2.value = true
    }
    const gousers = () => {
      dialogTableVisible2.value = false
    }
    const submitForm = () => {
      if (ruleForm.id === '' || ruleForm.password === '' || ruleForm.password.length <= 8 || ruleForm.name === '') {
        ElMessage({
          message: '信息不足',
          type: 'error',
        })
      } else {
        if (ruleForm.role === '管理员') {
          ruleForm.role = 'admin'
        } else {
          ruleForm.role = 'appuser'
        }
        var userdata = {
          id: ruleForm.id,
          name: ruleForm.name,
          phone: ruleForm.phone,
          password: ruleForm.password,
          company_id: store.state.user.company_id,
          role: ruleForm.role,
        }
        postnewuser(userdata).then(() => {
          getadminalluser()
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
      if (store.state.user.role === 'admin') {
        ElMessageBox.confirm(
          '是否删除该用户',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
          }
        ).then(() => {
          deleteuser(prop.id).then((res) => {
            getadminalluser()
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
      } else {
        ElMessage({
          type: 'error',
          message: '权限不足',
        })
      }
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
    const deleteCompany = () => {
      ElMessageBox.prompt('请输入需要删除的分公司id', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        deletecompany(value).then((res) => {
          if (res) {
            ElMessage({
              message: '删除成功',
              type: 'success',
            })
          }
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除'
        });
      });
    }
    const xiugai = (prop) => {
      form.value = prop;
      id.value = prop.id;
      dialogTableVisible.value = true
    }
    const adminupdate = () => {
      let params = {
        id: form.id,
        body: form
      }
      if (form.role === '管理员') {
        params.body.role = 'admin'
      }
      if (form.role === '普通用户') {
        params.body.role = 'appuser'
      }
      postadminupdate(params.id, params.body).then((res) => {
        getadminalluser()
        ElMessage({
          type: 'success',
          message: '用户信息修改成功'
        });
      })
    }
    const Changepassword = (prop) => {
      ElMessageBox.prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value.length <= 8) {
          ElMessage({
            type: 'error',
            message: '密码位数需大于8位'
          });
        } else {
          let body = {
            password: value
          }
          if (this.usermessage.role === 'admin') {
            adminchangepassword(prop.id, body).then((res) => {
              if (res) {
                ElMessage({
                  type: 'success',
                  message: '修改成功'
                })
              }
            })
          } else {
            changepassword(prop.id, body).then((res) => {
              if (res) {
                ElMessage({
                  type: 'success',
                  message: '修改成功'
                })
              }
            })
          }
        }
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消修改'
        });
      });
    }

    onMounted(() => {
      if (store.state.user.role === 'admin') {
        getadminalluser()
      } else if (store.state.user.role === 'superadmin') {
        getsuperadminalluser()
      } else {
        this.$store.dispatch('getoneusersMessage')
      }
    })

    return {
      userlist,
      dialogTableVisible2,
      dialogTableVisible,
      id,
      ruleForm,
      ruleFormRef,
      rules1,
      rules,
      form,

      getadminalluser,
      getsuperadminalluser,
      adduser,
      submitForm,
      superadminsubmitForm,
      resetForm,
      gousers,
      Deleteuser,
      Deleteadminuser,
      deleteCompany,
      xiugai,
      adminupdate,
      Changepassword,
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
  width: 120px;
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

.btn {}
</style>
