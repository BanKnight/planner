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
    menu_title: "Issues",
    menu_icon: "el-icon-question",
    require_logined: true
  },
  components: { layout }
};
</script>