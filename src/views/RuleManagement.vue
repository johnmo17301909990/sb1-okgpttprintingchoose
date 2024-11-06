<template>
  <div class="rule-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>映射规则管理</span>
          <el-button type="primary" @click="addRule">添加规则</el-button>
        </div>
      </template>

      <div v-for="categoryGroup in rulesByCategory" :key="categoryGroup.category">
        <h3 class="category-title">{{ categoryGroup.category }}</h3>
        <el-table :data="categoryGroup.rules" style="width: 100%; margin-bottom: 20px">
          <el-table-column prop="name" label="规则名称" width="180" />
          <el-table-column prop="description" label="规则描述" />
          <el-table-column prop="priority" label="优先级" width="80" align="center" />
          <el-table-column prop="enabled" label="状态" width="80" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.enabled ? 'success' : 'info'">
                {{ scope.row.enabled ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template #default="scope">
              <el-button size="small" @click="editRule(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteRule(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <rule-dialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :rule="currentRule"
      @save="saveRule"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import RuleDialog from '../components/rules/RuleDialog.vue'
import { useRules } from '../composables/useRules'

const { rules, addRule: addRuleToList, updateRule, removeRule, getRulesByCategory } = useRules()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRule = ref(null)
const rulesByCategory = computed(() => getRulesByCategory())

const addRule = () => {
  dialogTitle.value = '添加规则'
  currentRule.value = {
    id: Date.now(),
    name: '',
    description: '',
    priority: rules.value.length + 1,
    enabled: true,
    category: '',
    conditions: []
  }
  dialogVisible.value = true
}

const editRule = (rule) => {
  dialogTitle.value = '编辑规则'
  currentRule.value = { ...rule }
  dialogVisible.value = true
}

const deleteRule = (rule) => {
  removeRule(rule)
}

const saveRule = (rule) => {
  if (rules.value.find(r => r.id === rule.id)) {
    updateRule(rule)
  } else {
    addRuleToList(rule)
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.rule-management {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.category-title {
  margin: 20px 0 10px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
  font-size: 16px;
}
</style>