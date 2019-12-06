<template>
  <el-main class="full">
    <el-row type="flex" justify="space-between" style="flex-wrap:wrap">
      <project-card v-for="project in projects" :key="project.id" :value="project" />
    </el-row>
  </el-main>
</template>

<script>
import ProjectCard from "@/components/ProjectCard";

export default {
  title: "项目",
  path: "",
  weight: 0,
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

