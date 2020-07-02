<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" class="org-left">
        <div class="grid-content bg-purple" style="margin-top: 10px">
          <dividing-line :title="'角色'" />
        </div>
        <el-table
          ref="multipleTable"
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;margin-top: 10px;margin-bottom: 10px"
          @row-click="roleClick"
        >
          <el-table-column label="角色名称" align="center" min-width="40">
            <template slot-scope="{row}">
              <span style="cursor:default">{{ row.roleName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="19" class="org-right">
        <div class="grid-content bg-purple " style="margin-top: 10px">
          <dividing-line :title="menuTitle" />
          <div style="margin-top: 10px">
            <el-input v-model="filterText" placeholder="菜单名称" style="margin-bottom:30px;width: 190px" />
            <el-button v-waves class="filter-item" type="success" @click="saveMenuConfig">
              保存
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
            show-checkbox
            default-expand-all
            :expand-on-click-node="false"
            style="margin-bottom: 10px"
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
import { getAllRoleList, getMenuByRoleId, saveRoleMenu } from '@/api/role'

export default {
  name: 'Menu',
  components: { DividingLine },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      filterText: '',
      list: null,
      listLoading: false,
      treeLoading: false,
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tempData: {
        roleId: undefined,
        menuIdList: undefined
      },
      menuTitle: '菜单'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTrees()
    this.getList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getList() {
      this.listLoading = true
      getAllRoleList(this.listQuery).then(response => {
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },
    saveMenuConfig() {
      if (this.tempData.roleId === undefined) {
        this.$message({
          message: '请选择一个角色',
          type: 'warning'
        })
        return
      }
      const checkedKeys = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      this.tempData.menuIdList = checkedKeys
      saveRoleMenu(this.tempData).then((response) => {
        if (response.data === true) {
          this.$notify({
            title: '成功',
            message: '菜单保存成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    getMenuByRole(roleId) {
      getMenuByRoleId(roleId).then(response => {
        const data = response.data
        data.forEach((i, n) => {
          const node = this.$refs.tree.getNode(i)
          if (node.isLeaf) {
            this.$refs.tree.setChecked(node, true)
          }
        })
      })
    },
    roleClick(row) {
      this.tempData.roleId = row.id
      this.menuTitle = row.roleName + '-菜单'
      this.$refs.tree.setCheckedKeys([])
      this.getMenuByRole(row.id)
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
