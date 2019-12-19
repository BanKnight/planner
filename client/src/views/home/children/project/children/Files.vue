<template>
  <layout>我是文件</layout>
</template>

<script>
import layout from "../layout";

export default {
  path: "files",
  weight: 4,
  meta: { menu_title: "文件", require_logined: true },

  components: { layout }
};
</script>