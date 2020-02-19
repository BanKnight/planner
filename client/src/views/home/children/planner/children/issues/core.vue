<template>
  <router-view />
</template>

<script>

export default {
  path: "issues",
  weight: 7,
  meta: {
    menu_title: "问题",
    menu_icon: "el-icon-question",
    require_logined: true
  },
};
</script>
