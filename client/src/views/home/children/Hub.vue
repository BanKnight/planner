<template>
  <el-main class="full">
    <el-row type="flex" class="full" justify="space-around" style="flex-wrap:wrap" align="middle">
      <project-card v-for="project in projects" :key="project.id" :value="project" />
    </el-row>
  </el-main>
</template>

<script>
import ProjectCard from "@/components/ProjectCard";

export default {
  title: "Hub",
  path: "hub",
  weight: 0,
  meta: { require_logined: true },
  components: { ProjectCard },
  data() {
    return {
      projects: []
    };
  },

  mounted() {
    setTimeout(() => {
      for (let i = 1; i < 20; ++i) {
        let one = {
          id: i,
          title: `标题${i}`,
          desc: "this is 描述"
        };

        this.projects.push(one);
      }
    }, 300);
  }
};
</script>

