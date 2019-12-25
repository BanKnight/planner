<template>
  <el-container style="padding:10px" class="full">
    <router-view />
  </el-container>
</template>

<script>
export default {
  path: "wiki",
  weight: 5,
  meta: { menu_title: "Wiki", require_logined: true },

  components: {}
};
</script>