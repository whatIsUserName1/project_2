<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <el-form ref="userFormRef" :model="userForm" label-width="80px" :rules="UserInfoRules">
      <el-form-item label="登录名称">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input type="text" v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input type="email" v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updataUserInfoAPI } from '@/api'
export default {
  data() {
    return {
      userForm: {
        username: this.$store.state.UserInfo.username,
        nickname: '',
        email: ''
      },
      UserInfoRules: {
        nickname: [
          { required: true, message: '请输入昵称名', tigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须时1-10位的非空字符串', tigger: 'blur' }
        ],
        email: [
          {
            required: true, message: '请输入邮箱号', tigger: 'blur'
          },
          {
            type: 'email', message: '邮箱格式不正确', tigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.userFormRef.validate(async valid => {
        if (valid) {
          // 因为后端更新用户基本资料接口 需要带id过去 this.userForm对象里面本身没有id 就需要我们手动添加一个
          this.userForm.id = this.$store.state.UserInfo.id
          const { data: res } = await updataUserInfoAPI(this.userForm)
          // console.log(res)
          if (res.code !== 0) return this.$message.error('更新用户信息失败')
          // 更新用户信息成功 刷新 Vuex中的数据
          this.$message.success('更新成功!')
          this.$store.dispatch('getUserInfoActions', res)
        } else {
          // 没有通过校验
          return false
        }
      })
    },
    resetFn() {
      // this.userForm.nickname = ''
      // this.userForm.email = ''
      // el-form 提供了一个重置表单 并且能重置报错提示
      this.$refs.userFormRef.resetFields()
    }
  }
}
</script>

<style>

</style>
