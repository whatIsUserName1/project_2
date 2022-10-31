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
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="pubForm.cate_id">
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
        <el-form :inline="true" :model="pubForm" :rules="pubFormRules">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" style="margin-left: 15px" prop="cate_id">
            <!-- 循环渲染分类的可选项 因为整个表单要发给后台 所以要去看vue代码里绑定的值需要什么 发现接口文档里要的是分类id -->
            <el-select v-model="pubForm.state" placeholder="请选择状态" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="pubForm.cate_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pubDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="pubDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getArtCateListAPI } from '@/api'
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
      pubForm: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
        title: ''
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
          { required: true, message: '请选择文章标题', trigger: 'blur' }
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
