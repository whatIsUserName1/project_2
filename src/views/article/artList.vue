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
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
      <!-- 文章的内容区域 -->
      <el-table style="width: 100%" :data="artList" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="报表时间" prop="pub_date">
          <!-- scope对象: {row:行对象 } v-slot作用域插槽 用来获取插槽信息和绑定插槽里面的数据 -->
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <!-- scope变量值:{
            row:行数据对象
          } -->
          <template v-slot="{ row: row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 发表文章的Dialog对话框 -->
      <el-dialog title="提示" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose"
        @close="dialogCloseFn">
        <!-- 发布文章的对话框 -->
        <el-form :inline="true" :model="pubForm" :rules="pubFormRules" ref="pubRef">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <!-- 循环渲染分类的可选项 因为整个表单要发给后台 所以要去看vue代码里绑定的值需要什么 发现接口文档里要的是分类id -->
          <el-form-item label="文章分类" style="margin-left: 15px" prop="cate_id">
            <el-select v-model="pubForm.cate_id" placeholder="请选择状态" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 文章内容  -->
          <el-form-item label="文章内容" prop="content">
            <quill-editor v-model="pubForm.content" @blur="contentChangeFn">
            </quill-editor>
          </el-form-item>
          <!-- 用来显示封面的图片 -->
          <el-form-item label="文章封面" prop="cover_img">
            <img class="cover-img" src="../../assets/images/avatar.jpg" alt="" ref="imgRef" />
            <br>
            <!-- 选择封面按钮区域 -->
            <input type="file" accept="image/*" style="display: none" ref="iptFileRef" @change="changeCoverFn" />
            <el-button type="text" @click="chooseImgFn">选择图片</el-button>
          </el-form-item>
          <!-- 发布区域按钮 -->
          <el-form-item style="display:block">
            <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
            <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChangeFn" @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum" :page-sizes="[2, 3, 5, 10]" :page-size.sync="q.pagesize"
        layout="sizes, prev, pager, next, jumper, total" :total="total">
      </el-pagination>
      <!-- 查看文章详情的对话框 -->
      <el-dialog :visible.sync="detailvisible" width="80%">
        <h1 class="title">{{ artDetail.title }}</h1>
        <div class="info">
          <span>作者:{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间:{{ $formatDate(artDetail.pub_date) }}</span>
          <span>所属分类:{{ artDetail.cate_name }}</span>
          <span>状态:{{ artDetail.state }}</span>
        </div>
        <!-- 分割线 -->
        <el-divider></el-divider>
        <!-- 文章的封面 -->
        <!-- 详情请看main.js最下方注释 -->
        <img v-if="artDetail.cover_img" :src="baseURLR + artDetail.cover_img" alt="">
        <!-- 文章的详情 -->
        <div class="detail-box" v-html="artDetail.content"></div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI, getArtListAPI, getArtDetailAPI, delArticleAPI } from '@/api'
// 标签和央视中，把图片文件可以写成路径，在js里引入图片要用import引入
// webpack会把图片变成为一个base64字符串/在打包后的图片临时地址
import imgObj from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request.js'
export default {
  name: 'ArtList',
  data() {
    return {
      baseURLR: baseURL,
      q: { // 查询参数对象
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 默认当前页需要几条数据(传递给后台,后台就返回几个数据)
        cate_id: '', // 文章id
        state: '' // 文章状态
      },
      // 查询参数对象
      pubForm: { // 发布文章 表单的数据对象
        cate_id: '', // 文章分类id
        state: '', // 文章状态
        title: '', // 文章标题
        content: '', // 文章内容
        cover_img: '' // 文章图片
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
      cateList: [],
      artList: [], // 保存文章列表
      total: 0, // 保存现有文章的总数
      detailvisible: false, // 打开文章详情 显示/隐藏
      artDetail: {} // 文章详情
    }
  },
  methods: {
    // 初始化文章分类的列表数据
    async initCateList() {
      const { data: res } = await getArtCateListAPI()
      if (res.code !== 0) return
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 初始化文章列表数据
    async getArtListFN() {
      const { data: res } = await getArtListAPI(this.q)
      this.artList = res.data
      this.total = res.total
      console.log(res)
    },
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
    // 校验发布文章表单有存为草稿和发布两个按钮
    pubArticleFn(str) {
      this.pubForm.state = str
      this.$refs.pubRef.validate(async valid => {
        if (valid) {
          // 通过校验
          console.log(this.pubForm.state)
          const fd = new FormData() // 准备一个表单数据对象的容器 FormData类是HTML5新出的专门为了装文件内容和其他参数的一个容器
          // fd.append('参数名',值)
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          console.log(res)
          // 让发布页面重置
          this.$refs.pubRef.resetFields()
          // 让封面重置
          this.$refs.imgRef.setAttribute('src', imgObj)
          this.getArtListFN()
          // 关闭弹窗
          this.pubDialogVisible = false
        } else {
          // 没有通过
          return false // 阻止默认行为(因为按钮有默认提交行为)
        }
      })
    },
    // 富文本编辑器校验
    contentChangeFn() {
      // 目的让 el-form校验 只校验content这个规则
      this.$refs.pubRef.validateField('content')
    },
    // 新增文章->对话框关闭时->清空表单
    dialogCloseFn() {
      this.$refs.iptFileRef.resetFields()
    },
    // 核心思想:根据选择的页码/条数,影响q对象对应属性的值,再重新发一次请求让后台重新返回数据
    // 每页显示的条数发生改变
    handleSizeChangeFn(sizes) {
      // sizes:当前需要每页显示的条数
      // 因为Pagination的标签上已经加了.sync,子组件内会双向绑定到右侧vue变量上(q对象中pagesize已经改变)
      // 如果不放心可以再写一遍
      this.q.pagesize = sizes

      // 问题:先点击最后一个页码,切换每页显示条数2->3 总数不够 分页只能到2
      // 每页条数改变了 页码从3到2改变了 两个事件都会触发
      // 偶发性的bug:有时候自动回到第二页有数据 有的时候没有
      // 知识点: 两个网络请求一起发 谁先回来不一定
      // 原因:可能第2页3条数据回来有值铺设 紧接着第3页的3条数据回来了,空数组所以页面就是空的
      // 解决： 当切换每页显示的条数 我们就把当前页码设置为1 而且标签里要设置
      this.q.pagenum = 1
      this.getArtListFN()
    },
    // 页数发生改变
    handleCurrentChangeFn(nowPage) {
      // nowPage:当前要看的第几页,页数
      this.q.pagenum = nowPage
      this.getArtListFN()
    },
    // 筛选按钮->点击事件
    choseFn() {
      // 目的:当有了筛选的条件 我想让页码回到1,每页条数到2
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArtListFN()
    },
    // 重置按钮 ->点击事件
    resetFn() {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = '' // 对象改变  v-model关联的表单标签也会变为空
      this.getArtListFN()
    },
    // 文章的点击事件
    async showDetailFn(id) {
      this.detailvisible = true
      const { data: res } = await getArtDetailAPI(id)
      this.artDetail = res.data
      console.log(this.artDetail)
    },
    // 删除文章点击事件
    async removeFn(id) {
      const { data: res } = await delArticleAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 数组里只保存当前页的数据,别的页的需要传参q给后台获取覆盖
      // 1的原因:虽然你调用删除接口但是那是后端删除,前端数组里你没有代码去修改它
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) { // 不能让页面变成-1
          this.q.pagenum--
        }
      }
      // 问题:在最后一夜,删除最后一条时,虽然页码能回到上一页,但是数据没有出现
      // 原因:发现network里参数q.pagenum的值不会自己回到上一页 因为你的代码里没有修改过这个q.pagenum值 用geiArtcleFn方法 带着之前的参数请求去了所以没有数据
      // 解决: 在调用接口以后,刷新数组列表之前,对页码做一些处理
      // 直接携带当前q里有的参数，重新去后台获取一次
      this.getArtListFN()
      // 或者把分页和筛选条件重置，让表格的数据重新请求一次
      // this.resetFn()
    }

  },
  created() {
    // 获取数据
    this.initCateList()
    this.getArtListFN()
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
