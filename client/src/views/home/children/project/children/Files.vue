<template>
  <layout>我是文件</layout>
</template>

<script>
import layout from "../layout";

export default {
  title: "文件",
  path: "files",
  weight: 4,
  meta: { require_logined: true },

  components: { layout }
};
</script>