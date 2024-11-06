<template>
  <el-form :model="form" label-width="120px">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>烫金工艺选择</span>
        </div>
      </template>
      
      <el-form-item label="烫金面积">
        <el-select v-model="form.foilArea" placeholder="请选择烫金面积">
          <el-option
            v-for="item in areaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="烫金图案类型">
        <el-select v-model="form.foilPattern" placeholder="请选择图案类型">
          <el-option
            v-for="item in patternOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="颜色">
        <el-select v-model="form.color" placeholder="请选择颜色">
          <el-option
            v-for="item in colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="应用场景">
        <el-select v-model="form.application" placeholder="请选择应用场景">
          <el-option
            v-for="item in applicationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="表面处理">
        <el-select v-model="form.surfaceTreatment" placeholder="请选择表面处理">
          <el-option
            v-for="item in surfaceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="工艺顺序">
        <el-select v-model="form.processOrder" placeholder="请选择工艺顺序">
          <el-option
            v-for="item in processOrderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否需要UV">
        <el-switch v-model="form.requiresUV" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">查找匹配烫金纸</el-button>
      </el-form-item>
    </el-card>

    <el-card v-if="recommendedFoils.length" class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>推荐烫金纸</span>
        </div>
      </template>

      <el-table :data="recommendedFoils" style="width: 100%">
        <el-table-column prop="companyCode" label="公司编号" />
        <el-table-column prop="supplierCode" label="供应商编号" />
        <el-table-column prop="series" label="系列" />
        <el-table-column prop="usage" label="用途说明" />
        <el-table-column prop="mainApplication" label="主要应用" />
        <el-table-column prop="suitableSize" label="适用尺寸" />
        <el-table-column label="UV兼容" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.uvCompatible ? 'success' : 'danger'">
              {{ scope.row.uvCompatible ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="selectFoil(scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-if="selectedFoil" class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>已选择的烫金纸详细信息</span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="公司编号">{{ selectedFoil.companyCode }}</el-descriptions-item>
        <el-descriptions-item label="供应商编号">{{ selectedFoil.supplierCode }}</el-descriptions-item>
        <el-descriptions-item label="烫金纸系列">{{ selectedFoil.series }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ selectedFoil.category }}</el-descriptions-item>
        <el-descriptions-item label="用途说明" :span="2">{{ selectedFoil.usage }}</el-descriptions-item>
        <el-descriptions-item label="主要应用">{{ selectedFoil.mainApplication }}</el-descriptions-item>
        <el-descriptions-item label="合适尺寸">{{ selectedFoil.suitableSize }}</el-descriptions-item>
        <el-descriptions-item label="松紧度">{{ selectedFoil.tension }}</el-descriptions-item>
        <el-descriptions-item label="是否能过UV">
          <el-tag :type="selectedFoil.uvCompatible ? 'success' : 'danger'">
            {{ selectedFoil.uvCompatible ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div style="margin-top: 20px">
        <el-button type="success" @click="generatePO">生成采购订单</el-button>
      </div>
    </el-card>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  areaOptions,
  patternOptions,
  surfaceOptions,
  processOrderOptions,
  colorOptions,
  applicationOptions,
  matchFoils
} from '../data/foilMappings'
import type { FoilCriteria, SelectedFoil } from '../types/po'

const form = reactive<FoilCriteria>({
  foilArea: 'small',
  foilPattern: 'normal',
  surfaceTreatment: 'normal',
  processOrder: 'uvThenFoil',
  color: undefined,
  application: undefined,
  requiresUV: false
})

const recommendedFoils = ref([])
const selectedFoil = ref<SelectedFoil | null>(null)

const handleSubmit = () => {
  const matchedFoils = matchFoils(form)
  recommendedFoils.value = matchedFoils

  if (matchedFoils.length === 0) {
    ElMessage.warning('没有找到匹配的烫金纸，请调整选择条件')
  }
}

const selectFoil = (foil: SelectedFoil) => {
  selectedFoil.value = foil
  ElMessage.success('已选择烫金纸')
}

const generatePO = () => {
  if (!selectedFoil.value) {
    ElMessage.warning('请先选择烫金纸')
    return
  }

  ElMessage.success('采购订单生成成功！')
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
.card-header {
  font-weight: bold;
}
.el-descriptions {
  margin: 20px 0;
}
</style>