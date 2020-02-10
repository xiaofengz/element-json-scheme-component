## json scheme Form && Table, based on element-ui
> 完全根据json scheme生成element ui的form组件和table组件，同时也支持自定义slot.

![](https://github.com/xiaofengz/element-json-schema-form/blob/master/gif/form11.gif)
## Live Preview 在线demo，在线编辑json
A [live Preview](https://xiaofengz.github.io/element-json-scheme-form/) is hosted on gh-pages.

## Install

```bash
npm i element-json-scheme-component
```

## Registry

```javascript
import ElJsonSchemaComponent from 'element-json-scheme-component';

const { ElJsonForm, ElJsonTable } = ElJsonSchemaComponent
Vue.use(ElJsonForm);
Vue.use(ElJsonTable);
```

### Form组件的用法：el-json-form组件   [示例代码](https://github.com/xiaofengz/element-json-scheme-component/blob/master/src/examples/form-default.vue)  [在线demo](https://xiaofengz.github.io/element-json-scheme-component/#/form-default)
- 必须手动绑定 :model="xxx", 在data里设置为xxx:{}即可，需初始化，否则elementUi会报错

#### 基本用法：
```
<el-json-form :config="formJson" :model="formModel" ref="form" label-width="80px">
  <div slot="append" class="submit-item">
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </div>
</el-json-form>

data() {
    return {
      formModel: {},
      formJson: {
        "formAttr": {
          "inline": true,
          "label-position": "right",
        },
        "properties": {
          "name": {
            "type": "input",
            "label": "活动名称",
            "placeholder": "请输入...",
          },
          "search": {
            "type": "autocomplete",
            "label": "远程搜索",
            "placeholder": "请搜索...",
          }
        },
      }
    }
},
mothods: {
  onSubmit() {
      // 调用form实例的方法demo
      // this.$refs.form.resetFields();
      this.$refs.form.validate((valid, err) => {
        if (valid) {
          // 打印form的values
          console.log('submit!', this.$refs.form, this.$refs.form.values);
          alert('submit!');
        } else {
          console.log('error submit!!', err);
          return false;
        }
      });
    }
}
```
### 如果select组件的options数据需后端获取，在mounted手动修改this.formJson即可，写法如下
```
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
  },
```
### 如果input组件为异步搜索，写法如下
```
mounted() {
    // 异步搜索demo
    this.formJson.properties.search.fetchSuggestions = (queryString, cb) => this.fetch(queryString, cb)
},
methods: {
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
    }
}
```



#### Table组件的用法：el-json-table组件 [示例代码](https://github.com/xiaofengz/element-json-scheme-component/blob/master/src/examples/table-default.vue)  [在线demo](https://xiaofengz.github.io/element-json-scheme-component/#/table-default)

基本用法：
```
<el-json-table 
    :config="tableJson" 
    :data="tableData" 
    @select="select" 
    @select-all="selectAll">
</el-json-table>

data() {
    return {
      tableJson: {
        "columns": [{
            type: 'selection',
            width: 55
          }, {
            prop: 'name',
            label: 'Name',
            width: 80
          }, {
            prop: 'operate',
            label: '操作',
            width: 180
          }
        ]
      },
      tableData: [{
          name: 'Sam'
        }
      ],
    }
},
methods: {
  selectAll(val) {
      console.log('selectAll', val)
    },
  select(val) {
    console.log('select', val)
  }
}
```

#### 自定义table-column
> 指定v-slot:xxx="scope"即可
```
<el-json-table 
  :config="tableJson" 
  :data="tableData" 
  @select-all="selectAll" >
    <!--如果要自定义table-column, 只要指定v-slot:名字, 然后像以前一样写就可以了----->
    <template v-slot:name="scope">
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
    </template>
</el-json-table>
```

### 完整demo代码: [示例代码](https://github.com/xiaofengz/element-json-scheme-component/blob/master/src/examples/table-default.vue)  [在线demo](https://xiaofengz.github.io/element-json-scheme-component/#/table-default)

> 完整页面包含form && table && 分页