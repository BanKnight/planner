<template>
  <el-container class="full">
    <el-header height="auto" style="padding:0">
      <el-input
        placeholder="输入搜索关键字"
        v-model="keyword"
        clearable
        prefix-icon="el-icon-search"
        @clear="on_search"
        @keydown.enter.native.stop="on_search"
      ></el-input>
    </el-header>

    <el-table
      :data="page.data"
      v-loading="loading"
      style="width: 100%"
      height="100%"
      size="mini"
      class="el-card"
      :show-header="false"
      :border="false"
      :row-class-name="row_class"
      row-key="_id"
    >
      <el-table-column :fixed="true">
        <template slot-scope="scope">
          <router-link :to="`${root}/detail/${scope.row._id}`" class="el-link el-link--default">
            <member-preview size="mini" :planner="planner" v-model="scope.row.author" />
            {{ scope.row.title }}
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-footer height="auto" style="display: flex;justify-content: center">
      <el-pagination
        :page-count="page.count"
        layout="total,prev, pager, next"
        :total="page.total"
        @current-change="fetch"
        @prev-click="fetch"
        @next-click="fetch"
      ></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>

import MemberPreview from "@/components/MemberPreview";

export default {
  components: { MemberPreview },
  props: {
    planner: {
      type: String,
      required: true
    }
  },
  data()  {
    return {
      loading: false,
      page: {
        curr: 1, //当前页码
        count: 1, //总页数
        total: 0, //条目总数
        data: [] //当前页的数据
      },
      keyword: ""
    };
  },
  computed: {
    root()    {
      return `/planner/${this.planner}/wiki`;
    }
  },
  mounted()  {
    this.fetch(1);
  },
  methods: {
    refresh()    {
      this.fetch(this.page.curr);
    },
    async fetch(page)    {
      this.loading = true;

      const page_info = await this.$store.dispatch("wiki_list", {
        planner: this.planner,
        params: {
          curr: page, //页码
          keyword: this.keyword
        }
      });

      this.page.curr = page_info.curr;
      this.page.count = page_info.count;
      this.page.total = page_info.total;

      this.page.data = [];

      for (let one of page_info.data)      {
        this.page.data.push(one);
      }
      this.loading = false;
    },
    on_search()    {
      this.fetch(1);
    },

    row_class({ row, rowIndex })    {
      let classes = [];

      if (row._id == this.$route.params.article)      {
        classes.push("primary-row");
      }

      if (rowIndex % 2 == 0)      {
        classes.push("normal-row");
      }

      return classes.concat(" ");
    }

  }
};
</script>
