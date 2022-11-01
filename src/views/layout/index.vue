<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu class="el-menu-top" mode="horizontal" background-color="#23262E" text-color="#fff"
        active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="user_pic" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 左侧边栏的用户信息 -->
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/logo.png" alt="" v-else>
          <span>欢迎{{ nickname || username }}</span>
        </div>
        <!-- 左侧导航栏区域 -->
        <!-- default-active: 当前激活的index(el-submenu/el-menu-item的index值)，对应菜单就有激活样式
        @open:sub-menu 展开的回调
      @close:sub-menu 关闭的回调
    active-text-color:激活时的文字颜色 哪项index的值和default-active一致，就会被设置动态文字的颜色 -->
        <el-menu unique-opened :default-active="$route.path" router class="el-menu-vertical-demo" @open="handleOpen"
          @close="handleClose" background-color="#23262E" text-color="#fff" active-text-color="#409EFF">
          <template v-for="item, index in list.data">
            <!-- 首页 -->
            <el-menu-item :index="item.indexPath" v-if="!item.children" :key="item.indexPath">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
            <!-- 文章管理  -->
            <el-submenu v-else :index="item.indexPath" :key="index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item-group v-for="obj in item.children" :key="obj.indexPath">
                <el-menu-item :index="obj.indexPath">
                  <i :class="obj.icon"></i>
                  <span>{{ obj.title }}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 个人中心  -->
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <!-- 二级路由挂载点 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>www.wangchunlong.com</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenysListAPI } from '@/api'
// 总结: 在组件标签上绑定的所有事件(包括原生事件的名字 click,input等等)都是自定义事件 需要组件内$emit来触发才可以
// 万一组件内不支持这个远摄关事件名字  解决: @事件名.native="methods里的方法名"
// .native给组件内根标签 绑定这个原生的事件
export default {
  name: 'my-layout',
  data() {
    return {
      list: {}
    }
  },
  // 退出登录 ->点击事件
  methods: {
    logoutFn() {
      // 为了让用户体验更好  来个确认提示框
      this.$confirm('工作写完了吗?真的要下班了吗?', '提示', {
        confirmButtonText: '下班了',
        cancelButtonText: '不了多谢提醒',
        type: 'warning'
      }).then(() => {
        // 选择了退出
        // 清除 vuex
        this.$store.commit('updataToken', '')
        this.$store.commit('updataUserInfo', {})
        // 强制跳转登录页面
        this.$router.push('/login')
      }).catch(() => {
        // 选择了取消
      })
    },
    // 左侧菜单点击事件
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    // 获取右侧侧边栏数据
    async getMenysList() {
      const { data: menus } = await getMenysListAPI()
      console.log(menus)
      this.list = menus
      console.log(this.list)
    }
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  },
  created() {
    this.getMenysList()
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;

  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }

  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {

  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
