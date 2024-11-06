<template>
  <div class="foil-test">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>烫金工艺选择</span>
          <el-button type="primary" :icon="RefreshRight" @click="resetForm">重置</el-button>
        </div>
      </template>

      <el-form :model="form" label-width="120px">
        <el-form-item label="烫金面积" required>
          <el-select v-model="form.foilArea" clearable placeholder="请选择烫金面积" style="width: 100%">
            <el-option
              v-for="item in sizes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="烫金图案类型" required>
          <el-select v-model="form.foilPattern" clearable placeholder="请选择烫金图案类型" style="width: 100%">
            <el-option
              v-for="item in patternTypes.filter(item => item.value !== '')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="颜色">
          <el-select v-model="form.color" clearable placeholder="请选择颜色" style="width: 100%">
            <el-option
              v-for="item in colorOptions.filter(item => item.value !== '')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="应用场景">
          <el-select v-model="form.application" clearable placeholder="请选择应用场景" style="width: 100%">
            <el-option
              v-for="item in applications.filter(item => item.value !== '')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="表面处理">
          <el-select v-model="form.surfaceTreatment" clearable placeholder="请选择表面处理" style="width: 100%">
            <el-option
              v-for="item in surfaceOptions.filter(item => item.value !== '')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="工艺顺序">
          <el-select v-model="form.processOrder" clearable placeholder="请选择工艺顺序" style="width: 100%">
            <el-option
              v-for="item in processOrders.filter(item => item.value !== '')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            :icon="Search" 
            @click="handleTest"
            :disabled="!isRequiredFieldsFilled"
          >
            查找匹配烫金纸
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="hasSearched" class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>推荐烫金纸</span>
        </div>
      </template>

      <el-table :data="recommendedFoils" style="width: 100%">
        <el-table-column prop="companyCode" label="公司编号" width="120" />
        <el-table-column prop="supplierCode" label="供应商编号" width="120" />
        <el-table-column prop="series" label="系列" width="120" />
        <el-table-column prop="usage" label="用途说明" />
        <el-table-column prop="mainApplication" label="主要应用" width="150" />
        <el-table-column prop="suitableSize" label="适用尺寸" width="120" />
        <el-table-column label="UV兼容" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.uvCompatible ? 'success' : 'danger'">
              {{ scope.row.uvCompatible ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { 
  sizes,
  patternTypes,
  colorOptions,
  applications,
  surfaceOptions,
  processOrders,
  mappingData
} from '../data/mappingData'

const form = reactive({
  foilArea: '',
  foilPattern: '',
  color: '',
  application: '',
  surfaceTreatment: '',
  processOrder: ''
})

const recommendedFoils = ref([])
const hasSearched = ref(false)

const isRequiredFieldsFilled = computed(() => {
  return form.foilArea && form.foilPattern
})

const matchFoils = (criteria) => {
  if (!criteria.foilArea || !criteria.foilPattern) {
    ElMessage.warning('请至少选择烫金面积和图案类型')
    return []
  }

  const matches = []
  
  mappingData.forEach(mapping => {
    mapping.supplierCodes.forEach(supplier => {
      let isMatch = true
      
      // 检查面积匹配（必需）
      const sizeMatches = supplier.suitableSize.some(size => size === criteria.foilArea)
      if (!sizeMatches) {
        isMatch = false
        return
      }

      // 检查图案类型匹配（必需）
      const patternMatches = (() => {
        switch (criteria.foilPattern) {
          case 'fine':
            return supplier.usage.includes('幼细线条') || supplier.usage.includes('文字')
          case 'halftone':
            return supplier.usage.includes('渐变') || supplier.usage.includes('网点')
          case 'textured':
            return supplier.usage.includes('立体') || supplier.usage.includes('磨砂') || supplier.usage.includes('纹理')
          case 'normal':
            return supplier.usage.includes('普通图案') || supplier.usage.includes('普通烫金')
          default:
            return false
        }
      })()
      
      if (!patternMatches) {
        isMatch = false
        return
      }

      // 检查颜色匹配（可选）
      if (criteria.color && supplier.color !== criteria.color) {
        isMatch = false
        return
      }

      // 检查应用场景匹配（可选）
      if (criteria.application && !supplier.mainApplication.includes(criteria.application)) {
        isMatch = false
        return
      }

      // 检查表面处理和工艺顺序（可选）
      if (criteria.surfaceTreatment?.includes('uv') || criteria.processOrder?.includes('uv')) {
        if (!supplier.uvCompatible) {
          isMatch = false
          return
        }
      }

      if (isMatch) {
        matches.push({
          companyCode: mapping.companyCode,
          supplierCode: supplier.code,
          series: supplier.series,
          category: supplier.category,
          usage: supplier.usage,
          mainApplication: Array.isArray(supplier.mainApplication) 
            ? supplier.mainApplication.join('、')
            : supplier.mainApplication,
          suitableSize: Array.isArray(supplier.suitableSize)
            ? supplier.suitableSize.join('、')
            : supplier.suitableSize,
          uvCompatible: supplier.uvCompatible
        })
      }
    })
  })

  return matches
}

const handleTest = () => {
  if (!isRequiredFieldsFilled.value) {
    ElMessage.warning('请填写必选参数')
    return
  }
  hasSearched.value = true
  recommendedFoils.value = matchFoils(form)
  
  if (recommendedFoils.value.length === 0) {
    ElMessage.warning('没有找到匹配的烫金纸，请调整选择条件')
  } else {
    ElMessage.success(`找到 ${recommendedFoils.value.length} 个匹配结果`)
  }
}

const resetForm = () => {
  Object.keys(form).forEach(key => form[key] = '')
  hasSearched.value = false
  recommendedFoils.value = []
}
</script>

<style scoped>
.foil-test {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>