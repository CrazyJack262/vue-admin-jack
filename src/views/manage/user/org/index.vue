<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9" class="org-left">
        <div class="grid-content bg-purple " style="margin-top: 10px">
          <dividing-line :title="'组织架构'" />
          <div style="margin-top: 10px">
            <el-input v-model="filterText" placeholder="部门名称" style="margin-bottom:30px;width: 190px" />
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
            @node-click="nodeClick"
          />
        </div>
      </el-col>
      <el-col :span="14" class="org-right">
        <div class="grid-content bg-purple" style="margin-top: 10px">
          <dividing-line :title="selectOrgTitle" />
          <div style="margin-top: 10px">
            <el-input
              v-model="listQuery.username"
              placeholder="用户名称"
              style="margin-bottom:30px;width: 270px"
              @keyup.enter.native="handleSearch"
            />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
              查询
            </el-button>
            <el-button v-waves class="filter-item" type="primary" icon="el-third-icon-add-copy" @click="handleAdd">
              新增
            </el-button>
          </div>
        </div>

        <el-table
          ref="multipleTable"
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" prop="id" align="center" min-width="15">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="登录账号" align="center" min-width="40">
            <template slot-scope="{row}">
              <span>{{ row.loginName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户名称" align="center" min-width="40">
            <template slot-scope="{row}">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话号码" align="center" min-width="50">
            <template slot-scope="{row}">
              <span>{{ row.userPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="{row}">
              <span>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="版本号">
            <template slot-scope="{row}">
              <span>{{ row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" class-name="status-col" align="center" min-width="30">
            <template slot-scope="{row}">
              {{ statusMap[row.userStatus] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button
                size="mini"
                type="success"
                @click="handleDelete(row,$index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>=0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <!--新增部门用户-->
    <el-dialog :title="textMap['create']" :visible.sync="dialogFormVisible">
      <div style="margin-top: 10px">
        <el-input
          v-model="selectListQuery.username"
          placeholder="用户名称"
          style="margin-bottom:30px;width: 270px"
          @keyup.enter.native="handleSelectSearch"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSelectSearch">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-s-claim" @click="saveOrgUserData">
          保存
        </el-button>
        <el-table
          ref="saveMultipleTable"
          v-loading="selectListLoading"
          :data="selectList"
          tooltip-effect="dark"
          style="width: 100%"
          border
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="ID"
            prop="id"
            align="center"
            min-width="15"
          >
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="登录账号" align="center" min-width="40">
            <template slot-scope="{row}">
              <span>{{ row.loginName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户名称" align="center" min-width="40">
            <template slot-scope="{row}">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话号码" align="center" min-width="50">
            <template slot-scope="{row}">
              <span>{{ row.userPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="{row}">
              <span>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="版本号">
            <template slot-scope="{row}">
              <span>{{ row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" class-name="status-col" align="center" min-width="30">
            <template slot-scope="{row}">
              {{ statusMap[row.userStatus] }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="selectTotal>=0"
          :total="selectTotal"
          :page.sync="selectListQuery.page"
          :limit.sync="selectListQuery.limit"
          @pagination="getSelectList"
        />
      </div>
    </el-dialog>

    <!--新增组织架构-->
    <el-dialog :title="textMap[orgStatus]" :visible.sync="orgDialogFormVisible">
      <el-form
        ref="orgDataForm"
        :model="tempOrg"
        :rules="rules"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        :hide-required-asterisk="true"
      >
        <el-form-item v-if="orgStatus === 'orgAdd'" label="上级部门" prop="orgPid">
          <el-select v-model="tempOrg.orgPid" filterable style="width: 300px" class="filter-item">
            <el-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="orgName">
          <el-input v-model="tempOrg.orgName" style="width: 300px" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="orgDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="orgStatus === 'orgEdit'? updateData():saveData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchOrgList } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import DividingLine from '@/components/DividingLine'
import { deleteOrgById, getOrgList, getTrees, saveOrg, updateOrgyId, saveOrgUser, deleteOrgUserByUserId } from '@/api/org'

export default {
  name: 'Org',
  components: { Pagination, DividingLine },
  directives: { waves },
  data() {
    return {
      tempOrg: {
        id: undefined,
        orgName: undefined,
        version: undefined
      },
      rules: {
        orgPid: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
        orgName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
      },
      orgStatus: null,
      orgDialogFormVisible: false,
      textMap: {
        create: '部门新增成员',
        orgAdd: '新增部门',
        orgEdit: '编辑部门'
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
      selectListQuery: {
        page: 1,
        limit: 10,
        username: undefined,
        orgId: undefined,
        orgStatus: 1
      },
      list: null,
      selectList: null,
      total: 0,
      selectTotal: 0,
      listLoading: false,
      treeLoading: false,
      selectListLoading: false,
      statusMap: {
        0: '正常',
        1: '异常'
      },
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      orgList: null,
      selectOrgTitle: '成员维护'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTrees()
    this.getOrgList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleSearch() {
      if (this.listQuery.orgId === undefined) {
        this.$message({
          message: '请选择一个部门',
          type: 'warning'
        })
        return
      }
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectSearch() {
      if (this.selectListQuery.orgId === undefined) {
        this.$message({
          message: '请选择要查询的部门',
          type: 'warning'
        })
        return
      }
      this.selectListQuery.page = 1
      this.getSelectList()
    },
    getSelectList() {
      this.selectListLoading = true
      searchOrgList(this.selectListQuery).then(response => {
        this.selectList = response.data.records
        this.selectTotal = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.selectListLoading = false
        }, 1.5 * 200)
      })
    },
    getList() {
      this.listLoading = true
      searchOrgList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },
    getOrgList() {
      getOrgList().then(response => {
        this.orgList = response.data
      })
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
    handleDelete(row, index) {
      this.$confirm('确定移除 ' + row.userName + ' 用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrgUserByUserId(row.id).then(response => {
          const data = response.data
          if (data) {
            this.$notify({
              title: '成功',
              message: '用户移除成功！',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
            this.total--
          } else {
            this.$notify({
              title: '失败',
              message: '用户移除失败！',
              type: 'error',
              duration: 2000
            })
          }
        })
      }).catch(
        action => {
        }
      )
    },
    handleOrgDelete() {
      if (this.tempOrg.id === undefined) {
        this.$message({
          message: '请选择要删除的部门',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定移除 ' + this.tempOrg.orgName + ' 部门？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrgById(this.tempOrg.id).then(response => {
          const data = response.data
          if (data === true) {
            this.$notify({
              title: '成功',
              message: '部门移除成功！',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '部门移除失败！',
              type: 'error',
              duration: 2000
            })
          }
        })
      }).catch(
        action => {
        }
      )
    },
    resetTemp() {
      this.tempOrg = {
        id: undefined,
        orgName: undefined,
        version: undefined
      }
    },
    handleAdd() {
      if (this.listQuery.orgId === undefined) {
        this.$message({
          message: '请选择一个部门',
          type: 'warning'
        })
        return
      }
      this.resetTemp()
      this.dialogFormVisible = true
      this.getSelectList()
    },
    handleOrgAdd() {
      this.resetTemp()
      this.orgStatus = 'orgAdd'
      this.orgDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['orgDataForm'].clearValidate()
      })
    },
    handleOrgEdit() {
      if (this.tempOrg.id === undefined) {
        this.$message({
          message: '请选择要编辑的部门',
          type: 'warning'
        })
        return
      }
      this.orgStatus = 'orgEdit'
      this.orgDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['orgDataForm'].clearValidate()
      })
    },
    nodeClick(data) {
      this.tempOrg.id = data.id
      this.tempOrg.orgName = data.label
      this.tempOrg.version = data.version
      this.listQuery.orgId = data.id
      this.selectListQuery.orgId = data.id
      this.selectOrgTitle = data.label + '-成员维护'
      this.getList()
    },
    saveData() {
      this.$refs['orgDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempOrg)
          saveOrg(tempData).then((response) => {
            this.orgDialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '部门新增成功',
              type: 'success',
              duration: 2000
            })
            this.getTrees()
            this.getOrgList()
          })
        }
      })
    },
    saveOrgUserData() {
      const selection = this.$refs.saveMultipleTable.selection
      if (selection.length === 0) {
        this.dialogFormVisible = false
        return 0
      }
      const newList = []
      selection.forEach(item => {
        newList.push(item.id)
      })
      const tempData = { orgId: this.selectListQuery.orgId, userList: newList }
      console.log(tempData)
      saveOrgUser(tempData).then((response) => {
        this.dialogFormVisible = false
        if (response.data === true) {
          this.$notify({
            title: '成功',
            message: '新增部门用户成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    updateData() {
      this.$refs['orgDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempOrg)
          updateOrgyId(tempData).then((response) => {
            this.orgDialogFormVisible = false
            if (response.data === true) {
              this.$notify({
                title: '成功',
                message: '部门更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '部门更新失败',
                type: 'error',
                duration: 2000
              })
            }
            this.getTrees()
          })
        }
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
