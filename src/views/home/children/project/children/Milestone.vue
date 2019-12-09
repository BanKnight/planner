<template>
  <layout>
    <el-table
      :data="items"
      style="width: 100%"
      height="100%"
      size="medium"
      :show-header="true"
      :stripe="true"
    >
      <el-table-column label="名称" prop="name" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="日期" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.create }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度">
        <template slot-scope="scope">
          <el-progress
            :percentage="scope.row.percent"
            :title="scope.row.percent + '%'"
            :show-text="false"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <el-button-group>
          <el-button size="mini" icon="el-icon-edit"></el-button>
          <el-button size="mini" icon="el-icon-close"></el-button>
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
  path: "Milestone",
  weight: 6,
  components: { layout },
  data() {
    return { items: [] };
  },
  mounted() {
    for (let i = 0; i < 10; ++i) {
      this.items.push({
        id: i,
        name: `里程碑${i}`,
        percent: Number((Math.random() * 100).toFixed(2)),
        create: "2016-05-02"
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