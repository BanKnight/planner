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
  meta: { menu_title: "Wiki", require_logined: true },
  components: { layout }
};
</script>