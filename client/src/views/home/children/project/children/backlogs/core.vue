<template>
  <layout>
    <router-view />
  </layout>
</template>

<script>
import layout from "../../layout";

export default {
  title: "需求池",
  path: "backlogs",
  weight: 9,
  components: { layout }
};
</script>