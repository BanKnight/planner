<template>
  <el-main style="padding:10px">
    <el-tabs tab-position="left" type="border-card" class="full">
      <el-tab-pane label="基础" class="full" style="padding:10px"></el-tab-pane>
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
  }
};
</script>