<template>
  <layout>
    <router-view />
  </layout>
</template>

<script>
import layout from "../../layout";

export default {
  path: "wiki",
  weight: 5,
  meta: {
    menu_title: "Wiki",
    menu_icon: "el-icon-notebook-2",
    require_logined: true
  },
  components: { layout }
};
</script>
