<template>
  <layout>
    <router-view />
  </layout>
</template>

<script>
import layout from "../../layout";

export default {
  path: "backlogs",
  weight: 9,
  meta: {
    menu_title: "需求池",
    menu_icon: "el-icon-s-order",
    require_logined: true
  },
  components: { layout }
};
</script>