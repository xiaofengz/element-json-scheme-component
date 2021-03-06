/* eslint-disable */
if (typeof String.prototype.startWith != 'function') {
  String.prototype.startWith = function (prefix) {
    return this.slice(0, prefix.length) === prefix;
  };
}
const FormBuilder = {
  name: 'ElJsonForm',

  props: {
    model: {
      type: Object,
    },
    formRef: {
      type: String,
      default () {
        return 'form1'
      }
    },
    config: {
      type: Object,
      default () {
        return {
          formAttr: {

          },
          rules: {},
          properties: {}
        }
      }
    },
    labelWidth: {
      type: String
    }
  },
  watch: {
    values: {
      handler: function handler(values) {
        this.updating = true;
        this.$emit('input', values);
        this.updating = false;
      },
      deep: true,
      immediate: true
    },
    model: {
      handler(model, model2) {
        if (!this.updating) {
          this.values = this.mergeValues()
        } else {
          this.updating = false
        }
      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      updating: false,
      values: this.mergeValues()
    }
  },
  render(h) {
    const vm = this
    return h(
      'el-form', {
        props: {
          ...vm.config.formAttr,
          model: vm.values,
          labelWidth: vm.labelWidth
        },
        ref: vm.formRef
      },
      [
        h('h3', vm.config.title || ''),
        h('p', vm.config.describe || ''),
        ...(vm.$slots.prepend || []),
        ...(vm.renderFormItems(h) || []),
        ...(vm.$slots.append || [])
      ]
    )
  },
  created() {
    this.$emit('input', this.values)
  },
  methods: {
    resetFields() {
      const vm = this;
      vm.$refs[vm.formRef].resetFields();
    },
    setFieldValue(key, value) {
      const vm = this;
      vm.values[key] = value
    },
    setFieldsValue(obj) {
      const vm = this;
      Object.keys(obj).map(key => {
        vm.values[key] = obj[key]
      })
    },
    getFieldsValue() {
      const vm = this;
      return vm.values
    },
    validate(cb) {
      const vm = this;
      vm.$refs[vm.formRef].validate(cb);
    },
    validateField(cb) {
      vm.$refs[vm.formRef].validateField(cb);
    },
    // 异步校验表单，直接返回values
    validateFields(cb) {
      const vm = this;
      return new Promise((resolve, reject) => {
        vm.$refs[vm.formRef].validate((valid, err) => {
          if (valid) resolve(vm.values)
          else reject(err)
        })
      })
      
    },
    mergeValues() {
      const vm = this;
      const {
        model
      } = vm;
      const {
        properties
      } = vm.config;

      let formData = {}
      Object.keys(properties).map(key => {
        const {
          type,
          multiple
        } = properties[key]
        let defaultValue
        if (type === 'checkbox' || (type === 'select' && multiple)) {
          defaultValue = defaultValue != null ? properties[key].defaultValue : []
        } else {
          defaultValue = properties[key].defaultValue
        }
        Object.assign(formData, {
          [key]: defaultValue
        })
      })
      let mergeValues = {
        ...formData,
        ...model
      }
      Object.keys(formData).forEach(key => {
        // 强制设置多选的value为空数组，因为model可能会乱设置
        if (Array.isArray(formData[key]) && formData[key].length === 0 && (!model || !model[key])) {
          mergeValues[key] = []
        }
        const {
          type
        } = properties[key]
        // 如果是button
        if (type === 'button') delete mergeValues[key]
      })
      return mergeValues
    },
    filterAttrs(item = {}) {
      const keys = Object.keys(item)
      const attrs = {}

      keys.forEach(key => {
        const value = item[key]

        if (
          typeof value === 'number' ||
          typeof value === 'string' ||
          typeof value === 'boolean'
        ) {
          attrs[key] = value
        }
      })

      return attrs
    },
    filterEvents(item = {}) {
      const keys = Object.keys(item)
      const events = {}

      keys.forEach(key => {
        const value = item[key]

        if ( typeof value === 'function' ) {
          events[key] = value
        }
      })

      return events
    },
    renderFormItems(h) {
      const vm = this
      const {
        properties
      } = vm.config;

      return Object.keys(properties).map((key, index) => {
        return vm.renderFormItem(h, properties[key], key, index)
      })
    },
    renderFormItem(h, item, key) {
      const vm = this
      const {
        values
      } = vm
      const value = values[key] || null
      const modelEvents = {
        input: function (value) {
          values[key] = value
        },
        ...vm.filterEvents(item)
      }
      const {
        type,
        label,
        size
      } = item

      const formEachItem = h(type.startWith("el") ? `${type}` : `el-${type}`, {
        style: item.style || {},
        attrs: {
          ...vm.filterAttrs(item)
        },
        props: {
          value,
          ...item
        },
        on: {
          ...modelEvents
        }
      })
      const button = h('el-button', {
        style: item.style || {},
        attrs: {
          ...vm.filterAttrs(item),
          type: item._type
        },
        props: {
          ...item,
          type: item._type
        },
        on: {
          ...modelEvents
        }
      }, item.text || item.value)
      // select
      const select = h(
        'el-select', {
          style: item.style || {},
          attrs: {
            ...vm.filterAttrs(item)
          },
          props: {
            value,
            ...item
          },
          on: {
            ...modelEvents
          }
        },

        (item.options || []).map(option => {
          return h('el-option', {
            attrs: {
              ...vm.filterAttrs(option)
            },
            props: {
              key: option.value,
              ...option
            }
          })
        })
      )
      const radios = (item.options || []).map(option => {
        option = {
          name: item.name,
          ...option
        }
        return h(
          'el-radio', {
            style: item.style || {},
            attrs: {
              ...vm.filterAttrs(option)
            },
            props: {
              value,
              ...option
            },
            on: {
              ...modelEvents
            }
          },
          [
            option.text
          ]
        )
      })
      const datePicker = h('el-date-picker', {
        style: item.style || {},
        attrs: {
          ...vm.filterAttrs(item),
          type: item._type
        },
        props: {
          value,
          ...item,
          type: item._type
        },
        on: {
          ...modelEvents
        }
      })
      const input = h('el-input', {
        style: item.style || {},
        attrs: {
          ...vm.filterAttrs(item)
        },
        props: {
          value,
          ...item
        },
        on: {
          ...modelEvents
        }
      })
      const elements = {
        [type]: formEachItem,
        'button': button,
        'select': select,
        'input': input,
        'radios': radios,
        'datePicker': datePicker,
        'date-picker': datePicker
      }
      return h(
        'el-form-item', {
          props: {
            prop: key,
            label,
            size
          }
        },
        [elements[type]]
      )
    }
  }
}


const install = function installFormBuilder(Vue) {
  Vue.component('el-json-form', FormBuilder)
}
const index = {
  install: install
};
export default index