<template>
  <router-view />
</template>

<script>

export default {
  path: "backlogs",
  weight: 9,
  meta: {
    menu_title: "需求",
    menu_icon: "el-icon-s-order",
    require_logined: true
  },
};
</script>
