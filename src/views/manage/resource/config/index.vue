<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9" class="org-left">
        <div class="grid-content bg-purple " style="margin-top: 10px">
          <dividing-line :title="'菜单'" />
          <div style="margin-top: 10px">
            <el-input v-model="filterText" placeholder="菜单名称" style="margin-bottom:30px;width: 190px" />
            <el-button v-waves class="filter-item" type="primary" icon="el-third-icon-add-copy" @click="handleOrgAdd">
              新增
            </el-button>
            <el-button v-waves class="filter-item" type="primary" icon="el-third-icon-edit" @click="handleOrgEdit">
              编辑
            </el-button>
            <el-button v-waves class="filter-item" type="danger" icon="el-third-icon-delete" @click="handleOrgDelete">
              删除
            </el-button>
          </div>
          <el-tree
            ref="tree"
            v-loading="treeLoading"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="nodeClick"
          />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import DividingLine from '@/components/DividingLine'
import { getTrees } from '@/api/menu'
export default {
  name: 'Org',
  components: { DividingLine },
  directives: { waves },
  data() {
    return {
      tempOrg: {
        id: undefined,
        orgName: undefined,
        version: undefined
      },
      textMap: {
        create: '菜单新增成员'
      },
      dialogFormVisible: false,
      tableKey: 0,
      filterText: '',
      listQuery: {
        page: 1,
        limit: 10,
        username: undefined,
        orgId: undefined,
        orgStatus: 0
      },
      list: null,
      total: 0,
      listLoading: false,
      treeLoading: false,
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      orgList: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTrees()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getList() {
      console.log('search')
      // this.listLoading = true
      // searchOrgList(this.listQuery).then(response => {
      //   this.list = response.data.records
      //   this.total = response.data.total
      //
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 200)
      // })
    },
    getTrees() {
      this.treeLoading = true
      getTrees().then(response => {
        this.treeData = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.treeLoading = false
        }, 1.5 * 200)
      })
    },
    nodeClick(data) {
      console.log(data)
      console.log('点击节点')
    }
  }
}
</script>

<style scoped>
  .org-left {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px
  }

  .org-right {
    margin-left: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px
  }
</style>
