<template>
  <div class="full scroll-if-need">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <h3>
          需求
          <el-tag type="success" effect="dark">{{ backlogs.length }}</el-tag>
        </h3>
      </div>
      <el-table
        :data="backlogs"
        style="width: 100%"
        :show-header="false"
        size="small"
        row-key="_id"
      >
        <el-table-column label="标题" prop="title">
          <template slot-scope="scope">
            <router-link
              :to="`${root}/backlogs/detail/${scope.row._id}`"
              class="el-link el-icon-s-opportunity el-link--default"
            >{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>

        <el-table-column label="里程碑" width="120">
          <template slot-scope="scope">
            <milestone-preview :value="scope.row.milestone" size="mini" :planner="planner_id" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <h3>
          工单
          <el-tag type="success" effect="dark">{{ notes.length }}</el-tag>
        </h3>
      </div>
      <el-table :data="notes" style="width: 100%" :show-header="false" size="small" row-key="_id">
        <el-table-column label="标题" prop="title">
          <template slot-scope="scope">
            <router-link
              :to="`${root}/boards`"
              class="el-link el-icon-document el-link--default"
            >{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>

        <el-table-column label="截止日期" width="130">
          <template slot-scope="scope">
            <date-preview :value="scope.row.stop" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <h3>
          问题
          <el-tag type="success" effect="dark">{{ issues.length }}</el-tag>
        </h3>
      </div>

      <el-table :data="issues" style="width: 100%" :show-header="false" size="small" row-key="_id">
        <el-table-column label="标题" prop="title">
          <template slot-scope="scope">
            <router-link
              :to="`${root}/issues/detail/${scope.row._id}`"
              class="el-link el-icon-question el-link--default"
            >{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>

        <el-table-column label="里程碑" width="120">
          <template slot-scope="scope">
            <milestone-preview :value="scope.row.milestone" size="mini" :planner="planner_id" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import MilestonePreview from "@/components/MilestonePreview";
import DatePreview from "@/components/DatePreview";

export default {
  path: "",
  weight: 11,
  meta: {
    menu_title: "我的",
    menu_icon: "el-icon-user",
    require_logined: true
  },
  components: { MilestonePreview, DatePreview },
  data()  {
    return {
      backlogs: [],
      issues: [],
      notes: []
    };
  },
  mounted()  {
    this.fetch();
  },
  computed: {
    root()    {
      return `/planner/${this.planner_id}`;
    },
    planner_id()    {
      return this.$route.params.planner;
    }
  },
  methods: {
    async fetch()    {
      let resp = await this.$store.dispatch("mine_list", {
        planner: this.planner_id
      });

      this.backlogs = resp.backlogs;
      this.issues = resp.issues;
      this.notes = resp.notes;
    }
  }
};
</script>

<style scoped>
.el-card.box-card {
  margin-bottom: 10px;
}
.el-card.box-card:last-child {
  margin-bottom: 0;
}
</style>
