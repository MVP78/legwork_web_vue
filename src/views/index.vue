<template>
  <div>

    <div class="app-container home">
      校园速递后台管理平台为管理员提供一站式服务。

    </div>
    <div class="app-container home">
      主要功能有：管理员登录、用户管理、骑手管理、订单管理、快递标准管理、提现设置。
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.7",
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  font-size: 40px;
  color: #1296db;
}
</style>

