<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <el-form ref="userPwdRef" :model="userPwd" label-width="80px" :rules="userPwdRules">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="userPwd.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input type="password" v-model="userPwd.new_pwd"></el-input>
      </el-form-item>
      <el-form-item label="确定密码" prop="re_pwd">
        <el-input type="password" v-model="userPwd.re_pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updataPwdAPI } from '@/api'
export default {
  data() {
    // 旧密码和新密码不能相同
    const samePwd = (rules, value, callback) => {
      if (this.userPwd.old_pwd === value) {
        callback(new Error('新密码不能和旧密码相同'))
      } else {
        callback()
      }
    }
    // 确认密码和新密码必须保持一致
    const rePwd = (rules, value, callback) => {
      if (value !== this.userPwd.new_pwd) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      userPwd: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      userPwdRules: {
        old_pwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '请输入6-15位数的非空字符串', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '请输入6-15位数的非空字符串', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '请输入6-15位数的非空字符串', trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.userPwdRef.validate(async valid => {
        if (valid) {
          const { data: res } = await updataPwdAPI(this.userPwd)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.getArtCateFN()
          // console.log(res)
          // 清空token值
          this.$store.commit('updataToken', '')
          // 清空用户信息
          this.$store.commit('updataUserInfo', {})
          // 跳转到登录页面
          this.$router.push('login')
        } else {
          return false
        }
      })
    },
    resetFn() {
      this.$refs.userPwdRef.resetFields()
    }
  }
}
</script>

<style>

</style>
