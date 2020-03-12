<template>
  <div :class="{ 'my-planner': value.is_member, 'planner-card': true }">
    <h3 class="planner-card-title">{{ value.name }}</h3>
    <div class="full-width">
      <el-tag size="mini" type="info">
        <i class="el-icon-date">{{ $format(value.created) }}</i>
      </el-tag>

      <member-preview
        :value="value.owner"
        size="mini"
        :planner="value.planner"
      />
    </div>
    <span class="planner-card-desc">{{ value.desc }}</span>
  </div>
</template>

<script>
import MemberPreview from "./MemberPreview";

export default {
  components: { MemberPreview },

  props: {
    value: Object
  }
};
</script>

<style>
.planner-card {
  width: 220px;
  height: 100px;
  padding: 10px;

  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  display: inline-block;
  box-sizing: border-box;

  margin-bottom: 20px;
}
.my-planner.planner-card {
  cursor: pointer;
}

.my-planner > .planner-card-title {
  color: #79b36e;
}

.planner-card-desc {
  color: #595959;
}
</style>
