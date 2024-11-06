import { createRouter, createWebHistory } from 'vue-router'
import RuleManagement from '../views/RuleManagement.vue'
import SupplierManagement from '../views/SupplierManagement.vue'
import POForm from '../components/POForm.vue'
import MappingRelationship from '../views/MappingRelationship.vue'
import FoilTest from '../components/FoilTest.vue'

const routes = [
  {
    path: '/',
    redirect: '/foil'
  },
  {
    path: '/foil',
    name: 'foil',
    component: POForm,
    meta: { title: '烫金工艺选择' }
  },
  {
    path: '/mapping',
    name: 'mapping',
    component: MappingRelationship,
    meta: { title: '映射关系' }
  },
  {
    path: '/rules',
    name: 'rules',
    component: RuleManagement,
    meta: { title: '规则管理' }
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    component: SupplierManagement,
    meta: { title: '供应商管理' }
  },
  {
    path: '/test',
    name: 'test',
    component: FoilTest,
    meta: { title: '烫金工艺测试' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})