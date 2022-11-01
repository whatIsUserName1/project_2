<template>
  <div>
    <el-card class="box-card">
      <!-- 头部区域 -->
      <div slot="header" class="clearfix">
        <span>文章列表</span>
        <el-button style="float: right" type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发布文章
        </el-button>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="pubForm">
          <el-form-item label="文章分类">
            <el-select v-model="pubForm.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.cate_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="pubForm.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
      <!-- 发表文章的Dialog对话框 -->
      <el-dialog title="提示" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose">
        <!-- 发布文章的对话框 -->
        <el-form :inline="true" :model="pubForm" :rules="pubFormRules" ref="pubRef">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" style="margin-left: 15px" prop="cate_id">
            <!-- 循环渲染分类的可选项 因为整个表单要发给后台 所以要去看vue代码里绑定的值需要什么 发现接口文档里要的是分类id -->
            <el-select v-model="pubForm.cate_id" placeholder="请选择状态" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 文章内容  -->
          <el-form-item label="文章内容" prop="content">
            <quill-editor v-model="pubForm.content" @change="contentChangeFn">
            </quill-editor>
          </el-form-item>
          <el-form-item label="文章封面" prop="cover_img">
            <!-- 用来显示封面的图片 -->
            <img class="cover-img" src="../../assets/images/avatar.jpg" alt="" ref="imgRef" />
            <br>
            <!-- 选择封面按钮区域 -->
            <input type="file" accept="image/*" style="display: none" ref="iptFileRef" @change="changeCoverFn" />
            <el-button type="text" @click="chooseImgFn">选择图片</el-button>
          </el-form-item>
          <el-form-item style="display:block">
            <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
            <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getArtCateListAPI } from '@/api'
// 标签和央视中，把图片文件可以写成路径，在js里引入图片要用import引入
// webpack会把图片变成为一个base64字符串/在打包后的图片临时地址
import imgObj from '@/assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
      pubForm: { // 发布文章 表单的数据对象
        cate_id: '', // 文章分类id
        state: '', // 文章状态
        title: '', // 文章标题
        content: '', // 文章内容
        cover_img: ''
      },
      // 弹窗是否打开
      pubDialogVisible: false,
      // 规则校验
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [
          { required: true, message: '请选择文章id', trigger: 'change' }
        ],
        content: [
          // 为何在这个输入内容了 校验还不自己去掉
          // 原因:
          // content对应quill-editor富文本编辑器 他不是el提供的表单标签
          // el-input等输入框的在blur事件时进行校验
          // 下来菜单 单选框 复选框 是在change事件时进行校验
          // quill-editor2个事件都没有 所以你输入内容也不会自动走校验
          // 解决:
          // 自己给quill-editor绑定change事件(在文档里查到它支持change事件内容改变事件)
          // 在事件处理函数中用 el-form组件对象内 调用某个校验规则再重新执行
          { required: true, message: '请选择文章内容', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择文章状态', trigger: 'blur' }

        ],
        cover_img: [
          { required: true, message: '请选择文章封面', trigger: 'blur' }
        ]
      },
      cateList: []
    }
  },
  methods: {
    // 发表文章按钮点击事件 ->让对话框出现
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    // 发布文章-对话框-关闭前的回调
    // 注意:自带的3种关闭方式:dialog自带的点右上角的x和按下esc按键 和点击半透明蒙层关闭才会走这里以及你自己点击设置visible对应变量为false 都会导致关闭前回调触发
    async handleClose(done) { // done的作用: 调用才会放行让对话框关闭
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // 捕获确认框Promise对象里选择取消时  拒绝状态结果为cancel字符串
      // $confirm内部虽然是一个确认提示框，但是它借用了Promise语法来管理 点击确定它的状态为兑现成功状态返回'confirm'，如果用户点击了取消按钮 此Promise对象状态为拒绝状态，参会cancel字符串
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 初始化文章分类的列表数据
    async initCateList() {
      const { data: res } = await getArtCateListAPI()
      if (res.code !== 0) return
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 上传文件选择
    chooseImgFn() {
      this.$refs.iptFileRef.click()
    },
    // 封面选择改变的事件
    changeCoverFn(e) {
      // 获取用户选择的文件列表
      // e.target拿到触发事件的那个标签(input标签对象本身)
      // e.target.files拿到选择的文件数组
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        // img要显示回默认的cover.png
        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0]
        // 预览效果
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubRef.validateField('cover_img')
    },
    // 校验发布文章表单
    pubArticleFn(str) {
      this.pubForm.state = str
      this.$refs.pubRef.validate(async valid => {
        if (valid) {
          // 通过校验
          console.log(this.pubForm.state)
        } else {
          // 没有通过
        }
      })
    },
    // 富文本编辑器校验
    contentChangeFn() {
      // 目的让 el-form校验 只校验content这个规则
      this.$refs.pubRef.validateField('content')
    }
  },
  created() {
    // 获取数据
    this.initCateList()
  }
}

// $confirm内部虽然是一个确认提示框  但是它借用了Promise语法来管理，点击确定它的状态为兑现成功状态返回'confirm'，如果用户点击了取消按钮，此Promise对象状态为拒绝状态，返回'cancel'字符串

// 知识点回顾:
// 1.await只能用在async修饰的函数内
// async修饰:就是在当前函数名左边加async关键字 如果没有函数名 在形参的左边加async
// 原因 async修饰的函数就是异步函数 如果此函数被调用 总是返回一个全新 Promise对象
// 而且本次函数调用因为时异步函数 ,所以外边的同步代码继续执行,而await暂停代码只能暂停async函数内的,等待await后面异步结果
// 2.await只能拿到成功的结果并放行往下走,如果失败内部就会向浏览器控制台抛出错误并不会让await往下走代码
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;

  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
