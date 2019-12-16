<template>
  <layout>
    <el-table :data="items" style="width: 100%" height="100%" :stripe="true">
      <el-table-column label="标题" prop="title" width="180">
        <template slot="header">
          <el-button type="primary" icon="el-icon-plus"></el-button>
        </template>
      </el-table-column>

      <el-table-column label="描述" prop="desc"></el-table-column>

      <el-table-column label="日期" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ $format(scope.row.created) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" width="180">
        <template slot-scope="scope">
          <el-progress
            :percentage="scope.row.percent"
            :title="scope.row.percent + '%'"
            :show-text="false"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="right">
        <el-button-group>
          <el-button size="mini" icon="el-icon-edit" type="primary"></el-button>
          <el-button size="mini" icon="el-icon-check" type="success"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger"></el-button>
        </el-button-group>
      </el-table-column>
    </el-table>
  </layout>
</template>

<script>
import layout from "../layout";

export default {
  title: "里程碑",
  path: "",
  weight: 10,
  components: { layout },
  data() {
    return { items: [] };
  },
  mounted() {
    for (let i = 0; i < 10; ++i) {
      this.items.push({
        _id: i,
        title: `里程碑${i}`,
        desc: `这是描述${i}`,
        percent: Number((Math.random() * 100).toFixed(2)),
        created: Date.now()
      });
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>