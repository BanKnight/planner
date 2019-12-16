<template>
  <el-main class="full" style="padding:10px">
    <slot />
  </el-main>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: () => {
        return "vertical";
      }
    }
  }
};
</script>
