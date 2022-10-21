<template>
  <div>
    <el-button>123</el-button>
  </div>
</template>

<script>
import { getRequest } from '@/api/index.js'
export default {
  async created () {
    const res = await getRequest()
    console.log(res)
  }
}
</script>

<style lang="less" scoped>

</style>
