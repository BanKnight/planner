<template>
  <router-view />
</template>

<script>

export default {
  path: "wiki",
  weight: 5,
  meta: {
    menu_title: "Wiki",
    menu_icon: "el-icon-notebook-2",
    require_logined: true
  },
};
</script>
