<template>
  <el-container direction="vertical" class="full">
    <el-row type="flex" justify="space-between" align="middle" style="margin-bottom:10px;">
      <el-input
        class="search"
        placeholder="输入搜索关键字"
        v-model="keyword"
        clearable
        prefix-icon="el-icon-search"
        @clear="on_clear"
        @keydown.enter.native.stop="on_search"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-row>

    <el-row
      v-if="tags.length > 0"
      type="flex"
      style="flex-wrap: wrap;margin-bottom:10px;background-color:white;border-radius:4px;border: 1px solid #EBEEF5;padding:10px"
    >
      <el-checkbox v-for="one in tags" v-model="one.checked" :key="one.title">{{one.title}}</el-checkbox>
    </el-row>

    <el-table
      ref="data"
      v-loading="loading"
      :data="page.data"
      style="width: 100%"
      height="100%"
      size="small"
      :stripe="true"
      border
    >
      <el-table-column width="38">
        <template slot="header">
          <i class="el-icon-check"></i>
        </template>

        <template slot-scope="scope">
          <el-checkbox :value="!!scope.row.closed" @change="close(scope.row,$event)"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title">
        <template slot-scope="scope">
          <router-link
            :to="`${root}/detail/${scope.row._id}`"
            class="el-link el-link--default"
          >{{scope.row.title}}</router-link>
        </template>
      </el-table-column>

      <el-table-column label="标签" width="200">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" type="danger" size="small">{{tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="指派给" width="120">
        <template slot-scope="scope">
          <i v-if="scope.row.assignee" class="el-icon-user">{{scope.row.assignee.title }}</i>
          <el-tag v-else>无</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="里程碑" width="120">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.milestone"
            :to="`${milestone}/${scope.row.milestone._id}`"
            class="el-link el-link--default"
          >{{scope.row.milestone.title}}</router-link>
          <el-tag v-else>无</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" align="right" fixed="right">
        <template slot="header">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="$router.push(`${root}/new`)"
          ></el-button>
        </template>

        <el-button-group>
          <el-button size="mini" icon="el-icon-delete" type="danger"></el-button>
        </el-button-group>
      </el-table-column>
    </el-table>

    <el-footer height="auto" style="display: flex;justify-content: center">
      <el-pagination :page-count="page.count" layout="total,prev, pager, next" :total="page.total"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  path: "",
  weight: -1,
  meta: { require_logined: true },
  data() {
    return {
      loading: false,
      page: {
        curr: 1, //当前页码
        count: 1, //总页数
        total: 0, //条目总数
        data: [] //当前页的数据
      },
      tags: [],
      keyword: ""
    };
  },
  mounted() {
    this.fetch(1);
  },
  computed: {
    root() {
      return `/project/${this.planner_id}/backlogs`;
    },
    milestone() {
      return `/project/${this.planner_id}/milestone`;
    },
    planner_id() {
      return this.$route.params.id;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.fullPath != "/") {
        vm.from = from.fullPath;
      }
    });
  },
  methods: {
    async fetch(page) {
      this.loading = true;

      try {
        const page_info = await this.$store.dispatch("backlogs_list", {
          planner: this.planner_id,
          params: {
            curr: page //页码
          }
        });

        this.page.curr = page_info.curr;
        this.page.count = page_info.count;
        this.page.total = page_info.total;

        this.page.data = [];

        for (let one of page_info.data) {
          this.page.data.push(one);
        }

        console.log(this.page.data);
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    },
    on_clear() {},
    on_search() {}
  }
};
</script>