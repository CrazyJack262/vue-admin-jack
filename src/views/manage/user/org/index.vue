<template>
  <el-row :gutter="20">
    <el-col :span="10" class="org-left">
      <div class="grid-content bg-purple " style="margin-top: 10px">
        <h2>组织架构</h2>
        <div class="tableTitle" />
        <div style="margin-top: 10px">
          <el-input v-model="filterText" placeholder="部门名称" style="margin-bottom:30px;width: 270px" />
          <el-button v-waves class="filter-item" type="primary" icon="el-third-icon-add-copy">
            新增
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-third-icon-edit">
            修改
          </el-button>
          <el-button v-waves class="filter-item" type="danger" icon="el-third-icon-delete">
            删除
          </el-button>
        </div>
        <el-tree
          ref="tree2"
          :data="data2"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          default-expand-all
        />
      </div>
    </el-col>
    <el-col :span="13" class="org-right">
      <div class="grid-content bg-purple" style="margin-top: 10px">
        <h2>成员维护</h2>
        <div class="tableTitle" />
        <div style="margin-top: 10px">
          <el-input v-model="filterText" placeholder="用户名称" style="margin-bottom:30px;width: 270px" />
          <el-button v-waves class="filter-item " type="success" icon="el-icon-check">
            保存
          </el-button>
        </div>
        <el-tree
          ref="tree2"
          :data="data2"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          default-expand-all
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Org',
  directives: { waves },
  data() {
    return {
      filterText: '',
      data2: [{
        id: 1,
        label: 'Level one 1',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          children: [{
            id: 9,
            label: 'Level three 1-1-1'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style scoped>
  .panel-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 0;
    margin-top: 0;
  }
  .org-left{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px
  }
  .org-right{
    margin-left: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px
  }
  .tableTitle {
    position: relative;
    height: 1px;
    margin-top: -10px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
  }
</style>
