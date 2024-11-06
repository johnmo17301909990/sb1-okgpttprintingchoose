export const areaOptions = [
  { label: '小面积 (<50mm x 50mm)', value: 'small' },
  { label: '中面积 (50-100mm x 50-100mm)', value: 'medium' },
  { label: '大面积 (≥100mm x 100mm)', value: 'large' }
]

export const patternOptions = [
  { label: '幼细线条、文字', value: 'fine' },
  { label: '渐变、网点', value: 'halftone' },
  { label: '普通图案', value: 'normal' },
  { label: '立体、磨砂、有纹理效果', value: 'textured' }
]

export const surfaceOptions = [
  { label: '普通纸张', value: 'normal' },
  { label: 'UV涂层(亮光)', value: 'uvCoating' },
  { label: 'UV涂层(哑光)', value: 'mattUvCoating' },
  { label: '粉纸面', value: 'powderSurface' },
  { label: '无粉纸面', value: 'nonPowderSurface' }
]

export const processOrderOptions = [
  { label: 'UV后烫金', value: 'uvThenFoil' },
  { label: '烫金后UV', value: 'foilThenUv' },
  { label: '烫金后过胶', value: 'foilThenCoating' },
  { label: '烫金后印刷', value: 'foilThenPrint' }
]

export const colorOptions = [
  { label: '金色', value: 'gold' },
  { label: '银色', value: 'silver' },
  { label: '哑光金', value: 'mattGold' },
  { label: '哑光银', value: 'mattSilver' },
  { label: '黑色', value: 'black' }
]

export const applicationOptions = [
  { label: '贺卡', value: 'greetingCard' },
  { label: '精装书', value: 'hardcoverBook' },
  { label: '包装', value: 'packaging' },
  { label: '综合印刷', value: 'general' }
]

// 测试数据库
export const foilMappings = [
  {
    companyCode: 'HS#1G',
    supplierCodes: [
      {
        code: 'SH111',
        series: 'SH的标准金纸',
        category: '普通金纸',
        usage: '金色烫金纸，适用于高端印刷项目，渐变、网点烫金',
        mainApplication: '贺卡',
        suitableSize: '小面积',
        tension: '标准',
        uvCompatible: true,
        color: 'gold'
      }
    ]
  },
  {
    companyCode: 'HS#2G',
    supplierCodes: [
      {
        code: 'SY606',
        series: 'SY6-系列',
        category: '普通金纸',
        usage: '金色烫金纸，适用于幼细线条、文字',
        mainApplication: '精装书',
        suitableSize: '中面积',
        tension: '标准',
        uvCompatible: true,
        color: 'gold'
      }
    ]
  }
]

// 简化的匹配逻辑
export const matchFoils = (criteria) => {
  return foilMappings.filter(mapping => {
    return mapping.supplierCodes.some(supplier => {
      // 基础匹配：面积和图案类型
      const matchesArea = supplier.suitableSize.includes(
        criteria.foilArea === 'small' ? '小面积' : 
        criteria.foilArea === 'medium' ? '中面积' : '大面积'
      )

      const matchesPattern = supplier.usage.toLowerCase().includes(
        criteria.foilPattern === 'halftone' ? '渐变' :
        criteria.foilPattern === 'fine' ? '幼细' :
        criteria.foilPattern === 'textured' ? '立体' : '普通'
      )

      // 可选匹配：颜色和应用场景
      const matchesColor = !criteria.color || supplier.color === criteria.color
      const matchesApplication = !criteria.application || 
        supplier.mainApplication.toLowerCase().includes(
          criteria.application === 'greetingCard' ? '贺卡' :
          criteria.application === 'hardcoverBook' ? '精装书' :
          criteria.application === 'packaging' ? '包装' : '综合'
        )

      return matchesArea && matchesPattern && matchesColor && matchesApplication
    })
  }).map(mapping => {
    const supplier = mapping.supplierCodes[0]
    return {
      companyCode: mapping.companyCode,
      supplierCode: supplier.code,
      series: supplier.series,
      category: supplier.category,
      usage: supplier.usage,
      mainApplication: supplier.mainApplication,
      suitableSize: supplier.suitableSize,
      tension: supplier.tension,
      uvCompatible: supplier.uvCompatible,
      color: supplier.color
    }
  })
}