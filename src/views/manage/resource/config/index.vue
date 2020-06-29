<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9" class="org-left">
        <div class="grid-content bg-purple " style="margin-top: 10px">
          <dividing-line :title="'菜单'" />
          <div style="margin-top: 10px">
            <el-input v-model="filterText" placeholder="菜单名称" style="margin-bottom:30px;width: 190px" />
            <el-button v-waves class="filter-item" type="primary" @click="handleMenuAdd">
              新增
            </el-button>
            <el-button v-waves class="filter-item" type="primary" @click="handleMenuEdit">
              编辑
            </el-button>
            <el-button v-waves class="filter-item" type="danger" @click="handleMenuDelete">
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
            style="margin-bottom: 10px"
            @node-click="nodeClick"
          />
        </div>
      </el-col>

      <el-col :span="14" class="org-right">
        <div class="grid-content bg-purple" style="margin-top: 10px">
          <dividing-line :title="selectMenuTitle" />
          <div style="margin-top: 10px">
            <el-input
              v-model="listQuery.resourceName"
              placeholder="接口名称"
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
          <el-table-column label="接口名称" align="center" min-width="40">
            <template slot-scope="{row}">
              <span>{{ row.resourceName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="请求路径" align="center" min-width="40">
            <template slot-scope="{row}">
              <span>{{ row.resourceUrl }}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限编码" align="center" min-width="50">
            <template slot-scope="{row}">
              <span>{{ row.permission }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(row,$index)"
              >
                删除
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

    <!--菜单-->
    <el-dialog :title="textMap[menuStatus]" :visible.sync="menuDialogFormVisible">
      <el-form
        ref="menuDataForm"
        :model="tempMenu"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        :hide-required-asterisk="true"
        :rules="rules"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="tempMenu.parentId" filterable style="width: 300px" class="filter-item">
            <el-option
              v-for="item in menuList"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="tempMenu.menuName" style="width: 300px" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="menuUrl">
          <el-input v-model="tempMenu.menuUrl" style="width: 300px" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-input v-model="tempMenu.menuIcon" style="width: 300px" />
        </el-form-item>
        <el-form-item label="排序" prop="menuOrder">
          <el-input-number v-model="tempMenu.menuOrder" :min="1" :max="10" label="描述文字" style="width: 300px" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="menuStatus === 'menuEdit'? updateMenuData():saveMenuData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--接口列表-->
    <el-dialog :title="textMap[menuStatus]" :visible.sync="resourceDialogFormVisible">
      <el-form
        ref="resourceDataForm"
        :model="tempResource"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        :hide-required-asterisk="true"
        :rules="resourceRules"
      >
        <el-form-item label="接口名称" prop="resourceName">
          <el-input v-model="tempResource.resourceName" style="width: 300px" />
        </el-form-item>
        <el-form-item label="请求路径" prop="resourceUrl">
          <el-input v-model="tempResource.resourceUrl" style="width: 300px" />
        </el-form-item>
        <el-form-item label="权限编码" prop="permission">
          <el-input v-model="tempResource.permission" style="width: 300px" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resourceDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="menuStatus === 'resourceEdit'? updateResData():saveResData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import DividingLine from '@/components/DividingLine'
import Pagination from '@/components/Pagination'
import { deleteMenuById, getById, getTreeList, getTrees, saveMenu, updateMenuById } from '@/api/menu'
import { deleteResourceById, saveResource, searchResource, updateResourceById } from '@/api/resource'

export default {
  name: 'Resource',
  components: { DividingLine, Pagination },
  directives: { waves },
  data() {
    return {
      tempMenu: {
        id: undefined,
        menuName: undefined,
        parentId: undefined,
        menuUrl: undefined,
        menuOrder: 1,
        menuIcon: undefined
      },
      tempResource: {
        id: undefined,
        resourceName: undefined

      },
      rules: {
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        parentId: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
        menuUrl: [{ required: true, message: '菜单路径不能为空', trigger: 'blur' }]
      },
      resourceRules: {
        resourceName: [{ required: true, message: '接口名不能为空', trigger: 'blur' }],
        resourceUrl: [{ required: true, message: '请求路径不能为空', trigger: 'blur' }]
      },
      textMap: {
        menuAdd: '菜单新增',
        menuEdit: '菜单编辑',
        resourceAdd: '资源新增',
        resourceEdit: '资源编辑'
      },
      selectMenuTitle: '资源列表',
      menuList: null,
      treeList: null,
      menuStatus: null,
      menuDialogFormVisible: false,
      resourceDialogFormVisible: false,
      tableKey: 0,
      filterText: '',
      listQuery: {
        page: 1,
        limit: 10,
        resourceName: undefined,
        menuId: undefined
      },
      list: null,
      total: 0,
      listLoading: false,
      treeLoading: false,
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTrees()
    this.getTreeList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    resetTemp() {
      this.tempMenu = {
        id: undefined,
        menuName: undefined,
        parentId: undefined,
        menuUrl: undefined,
        menuOrder: 1,
        menuIcon: undefined
      }
    },
    resetResTemp() {
      this.tempResource = {
        id: undefined,
        resourceName: undefined,
        resourceUrl: undefined,
        permission: undefined
      }
    },
    handleSearch() {
      if (this.listQuery.menuId === undefined) {
        this.$message({
          message: '请选择一个菜单',
          type: 'warning'
        })
        return
      }
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      searchResource(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },
    getTreeList() {
      getTreeList().then(response => {
        this.menuList = response.data
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
    nodeClick(data) {
      if (data.id !== 1) {
        this.tempMenu.id = data.id
        this.tempMenu.menuName = data.label
        this.selectMenuTitle = data.label + '-资源列表'
        this.listQuery.menuId = data.id
        this.getList()
      } else {
        this.$message({
          message: '主菜单不可选中',
          type: 'warning'
        })
        return
      }
    },
    handleMenuAdd() {
      this.menuStatus = 'menuAdd'
      this.menuDialogFormVisible = true
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['menuDataForm'].clearValidate()
      })
    },
    handleAdd() {
      if (this.listQuery.menuId === undefined) {
        this.$message({
          message: '请选择一个菜单',
          type: 'warning'
        })
        return
      }
      this.menuStatus = 'resourceAdd'
      this.resourceDialogFormVisible = true
      this.resetResTemp()
      this.$nextTick(() => {
      })
    },
    handleEdit(row) {
      this.menuStatus = 'resourceEdit'
      this.resourceDialogFormVisible = true
      this.tempResource = row
      this.$nextTick(() => {
        this.$refs['resourceDataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定删除 ' + row.resourceName + ' 资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResourceById(row.id).then(response => {
          const data = response.data
          if (data) {
            this.$notify({
              title: '成功',
              message: '资源删除成功！',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
            this.total--
          } else {
            this.$notify({
              title: '失败',
              message: '资源删除失败！',
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
    handleMenuEdit() {
      if (this.tempMenu.id === undefined) {
        this.$message({
          message: '请选择要编辑的菜单',
          type: 'warning'
        })
        return
      }
      this.menuStatus = 'menuEdit'
      this.menuDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['menuDataForm'].clearValidate()
      })
      getById(this.tempMenu.id).then(response => {
        this.tempMenu = response.data
      })
    },
    handleMenuDelete() {
      if (this.tempMenu.id === undefined) {
        this.$message({
          message: '请选择要删除的菜单',
          type: 'warning'
        })
        return
      }

      this.$confirm('确定删除 ' + this.tempMenu.menuName + ' 菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenuById(this.tempMenu.id).then(response => {
          const data = response.data
          if (data === true) {
            this.$notify({
              title: '成功',
              message: '菜单移除成功！',
              type: 'success',
              duration: 2000
            })
            this.getTrees()
            this.getTreeList()
          } else {
            this.$notify({
              title: '失败',
              message: '菜单移除失败！',
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
    saveResData() {
      const tempData = Object.assign({}, this.tempResource)
      tempData.menuId = this.listQuery.menuId
      saveResource(tempData).then((response) => {
        this.resourceDialogFormVisible = false
        if (response.data === true) {
          this.$notify({
            title: '成功',
            message: '资源新增成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    saveMenuData() {
      const tempData = Object.assign({}, this.tempMenu)
      saveMenu(tempData).then((response) => {
        this.menuDialogFormVisible = false
        if (response.data === true) {
          this.$notify({
            title: '成功',
            message: '菜单新增成功',
            type: 'success',
            duration: 2000
          })
          this.getTrees()
          this.getTreeList()
        }
      })
    },
    updateResData() {
      this.$refs['resourceDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempResource)
          updateResourceById(tempData).then((response) => {
            this.resourceDialogFormVisible = false
            if (response.data === true) {
              this.$notify({
                title: '成功',
                message: '资源更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '资源更新失败',
                type: 'error',
                duration: 2000
              })
            }
            this.getList()
          })
        }
      })
    },
    updateMenuData() {
      this.$refs['menuDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempMenu)
          updateMenuById(tempData).then((response) => {
            this.menuDialogFormVisible = false
            if (response.data === true) {
              this.$notify({
                title: '成功',
                message: '菜单更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '菜单更新失败',
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
