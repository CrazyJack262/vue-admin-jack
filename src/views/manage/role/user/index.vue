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
            <el-input
              v-model="listQuery.username"
              placeholder="用户名称"
              style="margin-bottom:30px;width: 270px"
              @keyup.enter.native="handleSearch"
            />
            <el-button v-waves class="filter-item" type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button v-waves class="filter-item" type="primary" @click="handleAdd">
              新增
            </el-button>
          </div>
        </div>
        <el-table
          ref="userMultipleTable"
          :key="userTableKey"
          v-loading="userListLoading"
          :data="userList"
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
          @pagination="getUserList"
        />
      </el-col>
    </el-row>

    <!--新增部门用户-->
    <el-dialog :title="'角色新增成员'" :visible.sync="dialogFormVisible">
      <div>
        <el-input
          v-model="selectListQuery.username"
          placeholder="用户名称"
          style="margin-bottom:30px;width: 270px"
          @keyup.enter.native="handleSelectSearch"
        />
        <el-button v-waves class="filter-item" type="primary" @click="handleSelectSearch">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" @click="saveRoleUserData">
          保存
        </el-button>
        <el-table
          ref="saveMultipleTable"
          v-loading="selectUserListLoading"
          :data="selectUserList"
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
          @pagination="getUserList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import DividingLine from '@/components/DividingLine/index'
import Pagination from '@/components/Pagination'
import { getAllRoleList, saveRoleUser } from '@/api/role'
import { searchRoleList } from '@/api/user'
import { deleteRoleUserByUserId } from '@/api/role'

export default {
  name: 'Menu',
  components: { DividingLine, Pagination },
  directives: { waves },
  data() {
    return {
      statusMap: {
        0: '正常',
        1: '异常'
      },
      tableKey: 0,
      userTableKey: 0,
      selectUserTableKey: 0,
      list: null,
      userList: null,
      selectUserList: null,
      listLoading: false,
      userListLoading: false,
      selectUserListLoading: false,
      tempData: {
        roleId: undefined,
        menuIdList: undefined
      },
      menuTitle: '用户列表',
      listQuery: {
        page: 1,
        limit: 10,
        username: undefined,
        roleId: undefined,
        roleStatus: 0
      },
      selectListQuery: {
        page: 1,
        limit: 10,
        username: undefined,
        roleId: undefined,
        roleStatus: 1
      },
      total: 0,
      selectTotal: 0,
      dialogFormVisible: false
    }
  },
  created() {
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
    getUserList() {
      this.userListLoading = true
      searchRoleList(this.listQuery).then(response => {
        this.userList = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.userListLoading = false
        }, 1.5 * 200)
      })
    },
    getSelectUserList() {
      this.selectUserListLoading = true
      searchRoleList(this.selectListQuery).then(response => {
        this.selectUserList = response.data.records
        this.selectTotal = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.selectUserListLoading = false
        }, 1.5 * 200)
      })
    },
    roleClick(row) {
      this.tempData.roleId = row.id
      this.listQuery.roleId = row.id
      this.selectListQuery.roleId = row.id
      this.listQuery.username = undefined
      this.selectListQuery.username = undefined
      this.menuTitle = row.roleName + '-用户列表'
      this.getUserList()
    },
    handleSearch() {
      if (this.listQuery.roleId === undefined) {
        this.$message({
          message: '请选择一个角色',
          type: 'warning'
        })
        return
      }
      this.listQuery.page = 1
      this.getUserList()
    },
    handleDelete(row, index) {
      this.$confirm('确定移除 ' + row.userName + ' 用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleUserByUserId(row.id).then(response => {
          const data = response.data
          if (data) {
            this.$notify({
              title: '成功',
              message: '用户移除成功！',
              type: 'success',
              duration: 2000
            })
            this.userList.splice(index, 1)
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
    handleAdd() {
      if (this.listQuery.roleId === undefined) {
        this.$message({
          message: '请选择一个角色',
          type: 'warning'
        })
        return
      }
      this.dialogFormVisible = true
      this.getSelectUserList()
    },
    handleSelectSearch() {
      this.selectListQuery.page = 1
      this.getSelectUserList()
    },
    saveRoleUserData() {
      const selection = this.$refs.saveMultipleTable.selection
      if (selection.length === 0) {
        this.dialogFormVisible = false
        return 0
      }
      const newList = []
      selection.forEach(item => {
        newList.push(item.id)
      })
      const tempData = { roleId: this.selectListQuery.roleId, userList: newList }
      saveRoleUser(tempData).then((response) => {
        this.dialogFormVisible = false
        if (response.data === true) {
          this.$notify({
            title: '成功',
            message: '新增角色用户成功',
            type: 'success',
            duration: 2000
          })
          this.getUserList()
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
