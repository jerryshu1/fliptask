<template>
  <div>
    <div class="title">
      <el-icon>
        <List />
      </el-icon>
      <p>用户中心</p>
    </div>

    <el-table border :data="userlist" style="width: 90%" v-if="this.usermessage.role === 'superadmin'">
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

    <el-table border :data="userlist" style="width: 90%" v-else>
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
        <!--              <el-form-item label="密码" prop="password">-->
        <!--                <el-input v-model="form.password"></el-input>-->
        <!--              </el-form-item>-->
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
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="gousers">返回</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapState, useStore } from "vuex";
import { useQuasar, date } from "quasar";
import userService from "../services/user";
import { List } from "@element-plus/icons";
import store from "../store";
import { postcopytask, postsuperaddcompany } from "../api/getComponents";

import {
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
      dialogTableVisible2: false,
      id: '',
      form: {
        id: '',
        // password: '',
        password: '',
        name: '',
        phone: '',
        role: ''
      },
      rules1: {
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
      },
      ruleForm: {
        id: '',
        name: '',
        phone: '',
        companyname: '',
        companyid: '',
        password: '',
        role: '普通用户',
      },
      rules: {
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
      },
      userlist: []
    }
  },
  components: {
    List
  },
  mounted() {
    // getcompany("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMCIsInJvbGUiOiJzdXBlcmFkbWluIiwiY29tcGFueV9pZCI6IiIsIlN0YW5kYXJkQ2xhaW0iOnsiZXhwIjoxNjUyODQ0NTUwLCJpYXQiOjE2NTI4MzczNTAsImlzcyI6ImRlZXJsYW5kdGVjaCJ9fQ.PL7sORrdWWXkQ5o8bGtMs-rTdbCXMnZdzk2j_u6QkF4");
    if (useStore().state.user.role === 'admin') {
      this.getadminalluser()
      // this.$store.dispatch('getallusersMessage', 'admin')
    } else if (useStore().state.user.role === 'superadmin') {
      getallusers().then((res) => {
        console.log('xjw', res);
      })
      // this.$store.dispatch('getallusersMessage', 'superadmin')
    } else {
      this.$store.dispatch('getoneusersMessage')
    }
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
  methods: {
    getadminalluser() {
      let companyid = useStore().state.user.company_id
      console.log(companyid);
      getallusers().then((res) => {
        if (res) {
          this.userlist = []
          for (var i in res.users) {
            if (res.users[i].role === 'admin' && res.users[i].company_id === companyid) {
              res.users[i].role = '管理员'
              this.userlist.push(res.users[i])
            } else if (res.users[i].role === 'appuser' && res.users[i].company_id === companyid) {
              res.users[i].role = '普通用户'
              this.userlist.push(res.users[i])
            }
          }
          this.dialogTableVisible2 = false
        }
      })
    },
    Deleteadminuser(prop) {
      if (this.usermessage.role === 'superadmin') {
        ElMessageBox.confirm(
          '是否删除该用户',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',

          }
        )
          .then(() => {
            deleteuser(prop.id, this.token).then((res) => {
              this.$store.dispatch('getallusersMessage', 'superadmin')
              if (this.usermessage) {
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
              }
            });
            if (this.usermessage) {
              ElMessage({
                type: 'success',
                message: '删除成功',
              })
            }
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
      } else {
        this.$message({
          type: 'error',
          message: '权限不足'
        });
      }
    },
    Deleteuser(prop) {
      if (this.usermessage.role === 'admin') {
        ElMessageBox.confirm(
          '是否删除该用户',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
          }
        )
          .then(() => {
            deleteuser(prop.id, this.token).then((res) => {
              this.$store.dispatch('getallusersMessage', 'admin');
              if (this.usermessage) {
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
              }
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
      } else {
        this.$message({
          type: 'error',
          message: '权限不足'
        });
      }
    },
    Changepassword(prop) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value.length <= 8) {
          this.$message({
            type: 'error',
            message: '密码位数需大于8位'
          });
        } else {
          let body = {
            password: value
          }
          if (this.usermessage.role === 'admin') {
            adminchangepassword(prop.id, this.token, body)
          } else {
            changepassword(prop.id, this.token, body);
          }
          this.$message({
            type: 'success',
            message: '密码修改成功'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });
      });
    },
    xiugai(prop) {
      this.form = prop;
      this.id = prop.id;
      this.dialogTableVisible = true
    },
    adduser() {
      this.dialogTableVisible2 = true
    },
    adminupdate() {
      let params = {
        id: this.form.id,
        body: this.form
      }
      if (this.form.role === '管理员') {
        params.body.role = 'admin'
      }
      if (this.form.role === '普通用户') {
        params.body.role = 'appuser'
      }
      postadminupdate(params.id, params.body, this.token).then((res) => {
        if (this.$store.state.user.role === 'admin') {
          this.$store.dispatch('getallusersMessage', 'admin')
        } else if (this.$store.state.user.role === 'superadmin') {
          this.$store.dispatch('getallusersMessage', 'superadmin')
        } else {
          this.$store.dispatch('getoneusersMessage')
        }
        setTimeout(() => {
          this.dialogTableVisible = false;
        }, 500)
      })
      this.$message({
        type: 'success',
        message: '用户信息修改成功'
      });
    },
    deleteCompany() {
      this.$prompt('请输入需要删除的分公司id', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        deletecompany(value, this.token);
        // deletetasklist(value, this.token);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        });
      });
    },
    superadminsubmitForm() {
      if (this.ruleForm.id === '' || this.ruleForm.password === '' || this.ruleForm.password.length <= 8 || this.ruleForm.companyname === '' || this.ruleForm.companyid === '') {
        this.$message({
          type: 'error',
          message: '信息不足'
        });
      } else {
        this.ruleForm.role = 'admin';
        var userdata = {
          id: this.ruleForm.id,
          name: this.ruleForm.name,
          phone: this.ruleForm.phone,
          password: this.ruleForm.password,
          company_id: this.ruleForm.companyid,
          role: 'admin',
        }
        var companydata = {
          name: this.ruleForm.companyname,
          id: this.ruleForm.companyid,
        }
        this.$store.dispatch('addnewuser', userdata);
        postsuperaddcompany(companydata, this.token).then((res) => {
          postcopytask(companydata.id, this.token)

        }
        )
        if (store.state.user.role === 'admin') {
          this.$store.dispatch('getallusersMessage', 'admin')
        } else if (store.state.user.role === 'superadmin') {
          this.$store.dispatch('getallusersMessage', 'superadmin')
        } else {
          this.$store.dispatch('getoneusersMessage')
        }
        this.dialogTableVisible2 = false
        // this.$router.go(0)
      }
    },
    submitForm() {
      if (this.ruleForm.id === '' || this.ruleForm.password === '' || this.ruleForm.password.length <= 8 || this.ruleForm.name === '') {
        this.$message({
          type: 'error',
          message: '信息不足'
        });
      } else {
        if (this.ruleForm.role === '管理员') {
          this.ruleForm.role = 'admin'
        } else {
          this.ruleForm.role = 'appuser'
        }
        var userdata = {
          id: this.ruleForm.id,
          name: this.ruleForm.name,
          phone: this.ruleForm.phone,
          password: this.ruleForm.password,
          company_id: this.usermessage.company_id,
          role: this.ruleForm.role,
        }
        // this.$store.dispatch('addnewuser', userdata);
        postnewuser(userdata).then(() => {
            this.getadminalluser()
            this.dialogTableVisible2 = false

        })
        // this.$router.go(0)
      }
    },
    gousers() {
      this.dialogTableVisible2 = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

  setup() {
    const store = useStore();
    const $q = useQuasar();
    const user = ref({});
    const users = [];

    const showAddUserDialog = ref(false);
    const showUpdateUserDialog = ref(false);

    const addUser = () => {
      showAddUserDialog.value = true;
    };
    const editUser = (props) => {
      user.value = {
        id: props.row.id,
        name: props.row.name,
        role: props.row.role,
      };
      showUpdateUserDialog.value = true;
    };
    const deleteUser = (props) => {
      $q.dialog({
        title: "Delete user",
        message:
          "You are about to delete this user: <ul><li>" +
          props.row.id +
          "</li></ul>",
        cancel: true,
        persistent: true,
        html: true,
      }).onOk(() => {
        userService.delete(props.row.id).then(() => {
          getUsers();
        });
      });
    };

    return {
      user,
      showAddUserDialog,
      showUpdateUserDialog,
      users,
      pagination: {
        rowsPerPage: 20,
      },
      filterQuery: ref(""),
      filterData(rows, terms) {
        var filtered = [];
        terms = terms.toLowerCase();
        for (var i = 0; i < rows.length; i++) {
          if (rows[i]["name"].toLowerCase().includes(terms)) {
            filtered.push(rows[i]);
          }
        }
        return filtered;
      },
      addUser,
      editUser,
      deleteUser,
      userAdded() {
        showAddUserDialog.value = false;
        getUsers();
      },
      userUpdated() {
        showUpdateUserDialog.value = false;
        getUsers();
      },
    };
  },
});
</script>

<style>
.title {
  display: flex;
  margin-top: 3%;
  margin-left: 3%;
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
