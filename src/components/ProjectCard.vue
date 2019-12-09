<template>
  <el-card shadow="never" class="card">
    <el-row slot="header" type="flex" justify="space-between">
      <router-link :to="'/project/' + value.id" class="el-link el-link--default">
        <h4>{{value.title}}</h4>
      </router-link>

      <el-button-group>
        <el-button size="mini" icon="el-icon-star-off"></el-button>
        <el-button size="mini" icon="el-icon-more"></el-button>
      </el-button-group>
    </el-row>
    <span>{{value.desc}}</span>
  </el-card>
</template>

<script>
export default {
  props: {
    value: Object
  }
};
</script>

<style >
.card {
  min-width: 250px;
  min-height: 100px;

  margin-bottom: 10px;
}

.card:last-child {
  margin-bottom: 0;
}
</style>
