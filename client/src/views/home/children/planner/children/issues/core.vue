<template>
  <layout>
    <router-view />
  </layout>
</template>

<script>
import layout from "../../layout";

export default {
  path: "issues",
  weight: 7,
  meta: {
    menu_title: "问题",
    menu_icon: "el-icon-question",
    require_logined: true
  },
  components: { layout }
};
</script>
