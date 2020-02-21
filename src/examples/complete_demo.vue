
<template>
  <div id="app">
    <el-json-form :config="formJson" :model="formModel" ref="form" label-width="80px">
      <div slot="append" class="submit-item el-form-item">
        <el-button type="primary" :loading="loading" @click="onSubmit({currentPage: 1})">提交</el-button>
      </div>
    </el-json-form>
    <el-json-table :config="tableJson" :data="tableData" @on-query="onSubmit" @select="select" @select-all="selectAll" @selection-change="handleSelectionChange" @cell-click="handleCellClick" @sort-change="handleSortChange">
      <!--如果要自定义table-column, 只要指定v-slot:名字, 然后像以前一样写就可以了(3.0以上才支持v-slot，可以改成slot="xxx" slot-scope="scope")-->
      <template slot="name" slot-scope="scope"  >
        <el-button type="text" @click="openModel(scope.row)">{{scope.row.name + '自定义row'}}
        </el-button>
      </template>

      <template slot="sex" slot-scope="scope" >
        <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
      </template>

      <template slot="operate" slot-scope="scope" >
        <el-button type="text" @click="openModel(scope.row)">
          {{'操作1'}}</el-button>
        <el-button type="text" @click="openModel(scope.row)">{{'操作2'}}</el-button>
      </template>
    </el-json-table>
  </div>
</template>

<script>
  /* eslint-disable */
  import Vue from 'vue'
  export default {
    name: "app",
    components: {},
    data() {
      return {
        loading: false,
        formModel: {},
        timer: null,
        tableData: [],
        tableJson: {
          "style": {
            "width": "300px"
          },
          "border": true,
          "columns": [{
            type: 'selection',
            width: 55
          }, {
            prop: 'name',
            label: 'Name',
            width: 140,
            sortable: true
          }, {
            prop: 'mobile',
            label: 'Mobile',
            minWidth: 100
          }, {
            prop: 'sex',
            label: 'Sex',
            width: 80,
            renderHeader: (h, { column, $index }) => {
            return h(
                'span', null,
                [
                    column.label,
                    h('el-button',
                        {
                            props: {
                                size: 'mini',
                                type: 'primary',
                            },
                            class: 'm-l-5',
                            on: {
                                click: () => {console.log('刷新')}
                            }
                        },
                        ['刷新']
                    )
                ]
            );
        },
          }, {
            prop: 'operate',
            label: '操作',
            width: 180
          }],
          "pagination": {
            layout: "total, sizes, prev, pager, next, jumper",
            // hideOnSinglePage: true,
          }
        },
        formJson: {
          "title": "这是一个form+table+pagination完整demo(带搜索&&分页)",
          "describe": "基于emelent ui",
          "formAttr": {
            "inline": true,
            "label-position": "right",
            "rules": {
              "name": [{
                  "required": false,
                  "message": '请输入名称'
                },
                {
                  "max": 5,
                  "message": '最多 5 个字符'
                }
              ]
            },
            "size": "mini"
          },
          "properties": {
            "name": {
              "type": "input",
              // "mode": "text",  // textarea, number, password...
              "label": "活动名称",
              "placeholder": "请输入...",
            },
            "sex": {
              "type": "select",
              "label": "性别",
              // "multiple": true,
              "options": [{
                  "label": "男",
                  "value": 1
                },
                {
                  "label": "女",
                  "value": 2
                },
              ]
            },
            "date": {
              "type": "datePicker",
              "label": "日期",
              "_type": "daterange",
              "format": "yyyy 第 WW 周",
              "placeholder": "选择周",
              "rangeSeparator": "至",
              "start-placeholder": "开始日期1",
              "end-placeholder": "结束日期"
            },
            "switch": {
              "type": "switch"
            },
            "button": {
              "type": "button",
              "text": "按钮",
              "_type": "success"
            },
            "search": {
              "type": "autocomplete",
              "label": "远程搜索",
              "placeholder": "请搜索...",
            },
            "id": {
              "type": "input",
              // "mode": "text",  // textarea, number, password...
              "label": "工号",
              // "suffix-icon": "el-icon-search",
              "placeholder": "请输入工号...",
            },
          },
        }
      }
    },
    mounted() {
      // 如果options是后端数据的demo, 手动修改this.formJson即可
      new Promise((resolve) => {
        setTimeout(() => {
          this.formJson.properties.sex.options = [{
              "label": "男1111",
              "value": 1
            },
            {
              "label": "女",
              "value": 2
            },
          ]
        }, 1000)
      })
      // 绑定change,blur,focus等事件demo
      this.formJson.properties.id.change = (value) => {
        console.log(value)
        this.onSubmit()
      }
      this.formJson.properties.button.click = (value) => {
        console.log(value)
        this.onSubmit()
      }
      
      this.formJson.properties.date.change = (value) => {
        console.log(value[0], value[1])
        this.onSubmit()
      }
      // 异步搜索demo
      this.formJson.properties.search.fetchSuggestions = (queryString, cb) => this.fetch(queryString, cb)
    },
    methods: {
      // 异步搜索demo
      fetch(queryString, cb) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          cb([{
            "label": "结果1",
            "value": "结果1"
          }, {
            "label": "结果2",
            "value": "结果2"
          }, ])
        }, 3000 * Math.random())
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      onSubmit(payload={}) {
        console.log('submit! formValue:', this.$refs.form.values);
        console.log('pagination-payload:', payload)
        // 调用form实例的方法demo
        // this.$refs.form.resetFields();
        this.$refs.form.validate((valid, err) => {
          if (valid) {
            const resJson = {
              data: [{
                  name: 'Sam',
                  mobile: '15299xxxx',
                  sex: 0
                },
                {
                  name: 'Jean',
                  mobile: '13452xxxx',
                  sex: 1
                },
                {
                  name: 'Tony',
                  mobile: '187233xxxx',
                  sex: 0
                }
              ],
              total: 98,
              currentPage: payload.currentPage || 1
            }
            this.loading = true
            setTimeout(() => {
              this.tableData = resJson.data
              this.tableJson.pagination = {
                total: resJson.total,
                currentPage: resJson.currentPage
              }
              this.loading = false
            }, 1500 * Math.random())
          } else {
            console.log('error submit!!', err);
            return false;
          }
        });
      },
      handleSelectionChange(val) {
        console.log('handleSelectionChange', val)
      },
      selectAll(val) {
        console.log('selectAll', val)
      },
      select(val) {
        console.log('select', val)
      },
      handleCellClick(val) {
        console.log('handleCellClick', val)
      },
      handleSortChange(sort) {
        console.log('handleSortChange', sort)
      },
      openModel(row) {
        console.log('openModel', row)
      }
    }
  };
</script>
