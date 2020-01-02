<template>
  <el-main style="padding:10px">
    <el-tabs tab-position="left" type="border-card" class="full">
      <el-tab-pane label="基础" class="full" style="padding:10px">
        <el-form label-width="100px" label-position="top">
          <el-form-item label="邮箱:">
            <h1>这是姓名</h1>
          </el-form-item>

          <el-form-item label="姓名">
            <h2>这是姓名</h2>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" :loading="loading" size="medium" @click="summit_basic">确定</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
export default {
  path: "/setting",
  weight: 0,
  meta: {
    menu_title: "设置",
    menu_icon: "el-icon-setting",
    require_logined: true
  },
  data() {
    return {
      form: {}
    };
  }
};
</script>