<template>
  <div  class="reg_container" style="margin-top: 10%;margin-left: 37%">
    <div style="width: 150px;height: 60px;font-size: calc(100vw * 24 / 1920); margin-left: 170px">创建新用户</div>
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
  </div>
</template>

<script>
import {useStore, mapState} from "vuex";
import store from "../store";
import {postcopytask, postsuperaddcompany} from "../api/getComponents";

export default {
  name: "Register",
  data() {
    return {
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
          {message: '请输入手机号', trigger: 'change'},
          {pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {min: 9, message: '密码位数需大于8位', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'change'},
        ],
        companyname: [
          {required: true, message: '请输入所属分公司名称', trigger: 'change'},
        ],
        companyid: [
          {required: true, message: '请输入所属分公司id', trigger: 'change'},
          {pattern: /^\w+$/, message: 'id由大小写字母以及数字', trigger: 'change'},
        ],
        id: [
          {required: true, trigger: 'change'},
        ],
        role: [
          {required: true, trigger: 'change'},
        ]
      }
    }
  },
  computed: {
    ...mapState({
      usermessage: (state) => {
        return state.user
      },
      token: (state) => {
        return state.jwtToken
      }
    })
  },
  methods: {
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
              postcopytask(companydata.id, this.token);
            }
        )
        if (store.state.user.role === 'admin') {
          this.$store.dispatch('getallusersMessage', 'admin')
        } else if (store.state.user.role === 'superadmin'){
          this.$store.dispatch('getallusersMessage', 'superadmin')
        } else {
          this.$store.dispatch('getoneusersMessage')
        }
        let location = {
          name: 'user'
        }
        setTimeout(()=>{
          this.$router.push(location);
        },500)
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
        this.$store.dispatch('addnewuser', userdata);
        let location = {
          name: 'user'
        }
        setTimeout(()=>{
          this.$router.push(location);
        },1000)
      }
    },
    gousers() {
      let location = {
        name: 'user'
      }
      this.$router.push(location);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

.reg_container {
  width: 500px;
  height: 450px;

  border: 1px solid rgb(174, 174, 174);
  box-shadow: 1px 1px 5px #888888;

  margin: 0 auto;
  padding: 30px;
}
</style>