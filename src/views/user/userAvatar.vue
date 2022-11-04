<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!avatar" src="../../assets/images/avatar.jpg" alt="" />
      <img class="the_img" :src="avatar" v-else alt="">
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updataUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    // 选择文件 ->点击事件
    chooseImg() {
      // 目的：为了让input[type=file]标签 让他再用js代码来触发它的点击事件 导致它默认行为给一个文件选择窗口
      // 原因 input[type=file]它是原生标签 样式不太好改
      // 解决：移花接木
      this.$refs.iptRef.click()
    },
    onFileChange(e) {
      const files = e.target.files // 拿到用户选择的文件数组
      if (files.length === 0) {
        // 证明刚才文件选择窗口打开了 但是它一个文件都没有选择然后点击了关闭弹窗
      } else {
        // 证明它选择了文件(默认只有一个,)
        // console.log(files[0])
        // 目标：选择的图片文件，要给img标签上做纯前端的预览
        // img的标签src值
        // 只能是图片的链接地址(外链http//开头的  图片文件的相对路径)
        // 或者时图片的base64字符串(而且字符串还必须时 data: image / png;base64 图片专base64字符串)
        // 解决方法1: 文件 -> 内存临时地址(这个地址只能在js里内存里时不能发给后台的)
        // 语法: URL.createObjectURL(文件)
        // 返回值：内存临时地址
        // this.avatar = URL.createObjectURL(files[0])
        // 解决方法二: 文件 -> base64字符串  此字符串时可以发给后台的
        const fr = new FileReader()
        fr.readAsDataURL(files[0]) // 传入文件对象开始读取
        fr.onload = (e) => { // onload等待文件读成base64字符串后会触发onload
          // e.target.result的值就是读完的结果
          this.avatar = e.target.result // 赋值给变量 让他显示到img的src中
        }
      }
    },
    async uploadFn() {
      const { data: res } = await updataUserAvatarAPI(this.avatar)
      // console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('getUserInfoActions')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}

.preview {
  object-fit: cover;
}

.the_img {
  width: 350px;
  height: 350px;
}
</style>
