<template></template>

<script>
import { home_routes } from "@/router";

export default {
  data() {
    return {
      width: "120px"
    };
  },
  computed: {
    routes() {
      return home_routes;
    }
  }
};
</script>

<style>
.sidebar {
  background-color: #3c4146;
  color: white;
}
</style>

