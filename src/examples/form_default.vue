

<template>
  <div class="e-container">
    <div id="jsoneditor" ></div>
    <el-button class="btn" @click="handleJson">></el-button>
    <div class="form-content">
        <el-json-form :config="formJson" :model="formModel"  ref="form" label-width="80px" >
            <div slot="append" class="submit-item">
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </div>
        </el-json-form>
        <p>点击【提交】查看form values:</p>
        <div>{{values}}</div>
    </div>
    
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
      formModel: {},
      timer: null,
      formJson: {
        "title": "这是一个json schema自动生成的表单",
        "describe": "基于emelent ui",
        "formAttr": {
          "inline": true,
          "label-position": "right",
          "rules": {
            "name": [{
                "required": true,
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
            "multiple": true,
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
          }
        },
      },
      values: {}
    }
  },
  mounted() {
        const container = document.getElementById("jsoneditor")
        this.editor = new JSONEditor(container, {mode: 'code',})
        const initialJson = {
            "Array": [1, 2, 3],
            "Boolean": true,
            "Null": null,
            "Number": 123,
            "Object": {"a": "b", "c": "d"},
            "String": "Hello World"
        }
        this.editor.set(this.formJson)

        // get json
        const updatedJson = this.editor.get()

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
    // 异步搜索demo
    this.formJson.properties.search.fetchSuggestions = (queryString, cb) => this.fetch(queryString, cb)
  },
  methods: {
      handleJson() {
        this.editor.set(this.editor.get())
        this.formJson = this.editor.get()
      },
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
    onSubmit() {
      console.log('submit!', this.$refs.form, this.$refs.form.values);
      // 调用form实例的方法demo
      // this.$refs.form.resetFields();
      this.$refs.form.validate((valid, err) => {
        if (valid) {
          this.values = '提交成功, ' + JSON.stringify(this.$refs.form.values)
          
        } else {
            this.values = '提交失败, ' + JSON.stringify(err)
          console.log('提交成功,', err);
          return false;
        }
      });
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