<template>
  <el-container style="padding:10px" class="full">
    <router-view />
  </el-container>
</template>

<script>
export default {
  title: "Wiki",
  path: "wiki",
  weight: 5,
  meta: { require_logined: true },

  components: {}
};
</script>