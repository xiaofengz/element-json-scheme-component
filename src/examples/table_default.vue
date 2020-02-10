

<template>
    <div class="e-container">
        <div id="jsoneditor"></div>
        <el-button class="btn" @click="handleJson">></el-button>
        <el-json-table :config="tableJson" :data="tableData" @select="select" @select-all="selectAll" @selection-change="handleSelectionChange" @cell-click="handleCellClick">
            <!--如果要自定义table-column, 只要指定v-slot:名字, 然后像以前一样写就可以了----->
            <!-- <template v-slot:name="scope">
                  <el-button type="text" @click="openModel(scope.row)">{{scope.row.name + '自定义row'}}
                  </el-button>
            </template>

            <template v-slot:sex="scope">
                <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
            </template>

            <template v-slot:operate="scope">
                <el-button type="text" @click="openModel(scope.row)">
                    {{'操作1'}}</el-button>
                <el-button type="text" @click="openModel(scope.row)">{{'操作2'}}</el-button>
            </template> -->
        </el-json-table>
    </div>
</template>

<script>
    /* eslint-disable */
    import Vue from 'vue';
    import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js';
    import 'jsoneditor/dist/jsoneditor.min.css';
    export default {
        name: "app",
        components: {},
        data() {
            return {
                tableData: [{
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
                tableJson: {
                    "style": {
                        "width": "300px"
                    },
                    "columns": [{
                            type: 'selection',
                            width: 55
                        },
                        {
                            prop: 'name',
                            label: 'Name',
                            width: 120
                        },
                        {
                            prop: 'mobile',
                            label: 'Mobile',
                            minWidth: 100
                        },
                        {
                            prop: 'sex',
                            label: 'Sex',
                            width: 80
                        },
                        {
                            prop: 'operate',
                            label: '操作',
                            width: 180
                        }
                    ],
                    // 分页配置
                    "pagination": {
                        "layout": "total, sizes, prev, pager, next, jumper",
                        "total": 3,
                        "hideOnSinglePage": false
                    }
                },
            }
        },
        mounted() {
            const container = document.getElementById("jsoneditor")
            this.editor = new JSONEditor(container, {
                mode: 'code',
            })
            this.editor.set({ ...{
                    tableJson: this.tableJson
                },
                ...{
                    tableData: this.tableData
                }
            })
        },
        methods: {
            handleJson() {
                // this.editor.set(this.editor.get())
                this.tableJson = this.editor.get().tableJson
                this.tableData = this.editor.get().tableData
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
            openModel(row) {
                console.log('openModel', row)
            }
        }
    };
</script>

<style scoped>
    .e-container {
        display: inline-flex
    }
    #jsoneditor {
        flex-basis: 500px;
        width: 500px;
        height: 90vh;
    }
    .btn {
        width: 100px;
        height: 50px;
        margin: auto 20px;
    }
    .form-content {
        flex: 1
    }
</style>