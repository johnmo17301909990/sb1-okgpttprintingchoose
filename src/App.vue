<template>
  <el-config-provider>
    <div class="app-container">
      <el-menu mode="horizontal" :router="true" class="menu">
        <el-menu-item index="/foil">烫金工艺选择</el-menu-item>
        <el-menu-item index="/mapping">映射关系</el-menu-item>
        <el-menu-item index="/rules">规则管理</el-menu-item>
        <el-menu-item index="/suppliers">供应商管理</el-menu-item>
        <el-menu-item index="/test">烫金测试</el-menu-item>
      </el-menu>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
</script>

<style>
.app-container {
  min-height: 100vh;
}

.menu {
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}

.content {
  padding: 20px;
}
</style>