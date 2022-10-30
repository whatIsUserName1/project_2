<template>
  <div>
    <!-- 卡片头部 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addListFN">添加分类</el-button>
      </div>
      <!-- 文章的分类 -->
      <el-table style="width: 100%" :data="cateList" border stripe>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <!-- scope对象: {row:行对象 } v-slot作用域插槽 用来获取插槽信息和绑定插槽里面的数据 -->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加的对话框 -->
      <!-- el-dialog 对话框组件 title: 左上角标题 visible: 控制对话框是否显示 (右侧Vue变量为true显示,为false就隐藏)
      扩展知识点: .sync是Vue2.3版本新增
      官方文档: https://cn.vuejs.org/v2/guide/components-custom-events.html#sync
      .sync类似 v-mode 可以给子组件实现双向绑定数据
      复习: v-model如何给子组件实现双向数据绑定(父Vue变量要传给子组件 子组件传出的值也要自动绑定到父Vue变量)
      v-model本质:给所在标签绑定:value="Vue变量"  @input="val => Vue变量 =val"
      <标签 v-model="Vue变量"></标签>
      运行时如下
      <标签 :value="Vue变量" @input="val =>Vue变量 = val"></标签>
      -->
      <el-dialog title="添加文章" :visible.sync="dialogFormVisible" @closed="dislogClosedFn">
        <el-form ref="dislogRef" :model="dislogFrom" :rules="dislogRules" label-width="80px">
          <el-form-item prop="Category" label="分类名称">
            <el-input v-model="dislogFrom.cate_name"></el-input>
          </el-form-item>
          <el-form-item prop="Classification" label="分类别名">
            <el-input v-model="dislogFrom.cate_alias"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelFn">取 消</el-button>
          <el-button type="primary" @click="confirmFn">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
// 分享的经验:如果用同一个按钮 想要做状态区分
// 1.定义一个标记变量isEdit(true为编辑,false新增)  还要定义本次要编辑的数据唯一id值  editId
// 2.在点击修改的时候 isEdit改为true,editId保持要修改的数据id
// 3.在点击新增按钮的时候 isEdit改为false editId置空
// 4.在点击保存按钮时(确定按钮时) 可以使用isEdit变量做区分
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI } from '@/api'
export default {
  name: 'ArtCate',
  data() {
    return {
      cateList: [], // 文章分类数组
      dialogFormVisible: false,
      dislogFrom: {
        cate_name: '',
        cate_alias: ''
      },
      dislogRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', tigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '请输入1-10非空字符', tigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', tigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', tigger: 'blur' }
        ]
      },
      // isEdit用来判断时修改点的还是 新增点的
      isEdit: false,
      editId: ''
    }
  },
  created() {
    // 获取文章分类列表
    this.getArtCateFN()
  },
  methods: {
    // 获取文章分类列表
    async getArtCateFN() {
      const { data: res } = await getArtCateListAPI()
      console.log(res)
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 点击添加对话框显示
    addListFN() {
      this.dialogFormVisible = true
    },
    // 对话框关闭时 内容清空
    dislogClosedFn() {
      this.$refs.dislogRef.resetFields()
    },
    // 点击取消清除对话框里面的内容
    cancelFn() {
      this.dialogFormVisible = false
    },
    // 点击确定 清除对话框里面的内容
    confirmFn() {
      this.$refs.dislogRef.validate(async valid => {
        if (valid) {
          // 通过校验
          if (this.isEdit) {
            // 要修改
            // this.dislogFrom.id = this.editId
            // updateArtCateAPI(this.dislogFrom)
            const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.dislogFrom })
            if (res.code !== 0) return this.$message.error('上传失败')
            this.$message.success('上传成功')
          } else {
            // 要新增
            this.editId = ''
            const { data: res } = await saveArtCateAPI(this.dislogFrom)
            // console.log(res)
            if (res.code !== 0) return this.$message.error('上传失败')
            this.$message.success('上传成功')
            // 再重新请求一次文章列表 拿到最新数据 让表格更新
            // 声明周期的方法比如 created 不会挂载到this身上  无法this.created
          }
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
      this.getArtCateFN()
    },
    // 修改文章别名，名称数据
    updateFn(obj) {
      this.isEdit = true
      this.editId = obj.id
      // obj的值:{id:文章分类id,cate_name:文章分类名字,cate_alias:文章分类别名}
      this.dialogFormVisible = true
      // 让里面的代码异步执行 先走初始化对话框
      this.$nextTick(() => {
        // 数据回显
        this.dislogFrom.cate_name = obj.cate_name
        this.dislogFrom.cate_alias = obj.cate_alias
      })
    }
  }
}
// 小bug: (el-form和el-dialog和数据回显 同时用 有bug)
// 复现:第一次打开网页 先点击修改 再点击新增 发现输入框竟然有值
// 原因: 点击修改后 关闭对话框的时候 置空失效了
// 具体分析: 主人公resetFields有问题
// 线索: Dialog的内容时懒渲染的，即在第一次被打开之之前 传入的默认slot不会被渲染到DOM上
// 线索:vue数据改变(先执行同步所有) 再去更新DOM(异步代码)
// 无问题:第一次打开网页 先点击新增 ->dialog出现 ->el-form组件第一次挂载 (关联的addForm对象的属性的值为空字符串) el-form组件内绑定了初始值 所以后续调用resetFields的时候它可以用到空字符串初始值来重置

// 有问题: 第一次打开网页 先点击修改按钮 ->虽然dialog变量为true了但是同步代码把addForm对象里赋值了(默认值) ->DOM更新异步 ->dialog出现 ->el-form组件第一次挂载(使用addForm内置做回显然后第一次el-form内绑定了初始值(有值))  以后做重置 它就用绑定的初始值的做重置

// 解决让 el-dialog第一次挂载到el-form时 先用addForm空字符串初始值绑定到内部 后续用做resetFields重置
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
