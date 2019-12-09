<template>
  <el-container :direction="direction" class="full" style="padding:10px">
    <slot />
  </el-container>
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
