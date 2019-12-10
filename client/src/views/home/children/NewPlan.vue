<template>
  <el-main>
    <el-form label-position="top">
      <el-form-item label="标题">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-button>取消</el-button>

          <el-button type="primary">立即创建</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
export default {
  title: "New plan",
  path: "new-plan",
  weight: 10,
  data() {
    return {
      form: {
        name: "",
        desc: ""
      }
    };
  }
};
</script>