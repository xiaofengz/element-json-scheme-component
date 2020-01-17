/* eslint-disable */
if (typeof String.prototype.startWith != 'function') {
  String.prototype.startWith = function (prefix){
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
      type: String,
      default: '150px'
    }
  },
  watch: {
    values: {
      handler: function handler(values) {
        this.updating = true;
        this.$emit('input', values);
        this.updating = false;
      },
      deep: true
    },
    model: {
      handler (model, model2) {
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
  render (h) {
      const vm = this
      return h(
        'el-form',
        {
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
    created () {
      this.$emit('input', this.values)
    },
  methods: {
      resetFields() {
        const vm = this;
        // model为props传递，在父组件调用from的方法，并不会触发该form实例组件的model的watch，因此临时解决办法手动改变model的引用
        // vm.model = Object.assign({}, vm.model)
        vm.$refs[vm.formRef].resetFields();
      },
      validate(cb) {
        const vm = this;
        vm.$refs[vm.formRef].validate(cb);
      },
      validateField(cb) {
        vm.$refs[vm.formRef].validateField(cb);
      },
      mergeValues() {
          const vm = this;
          const { model } = vm
          const { properties }=  vm.config;
          let formData = {}
          
          Object.keys(properties).map(key => {
            const { type, multiple } = properties[key]
            let defaultValue
            if (type === 'checkbox' || (type === 'select' && multiple)) {
              
              defaultValue = defaultValue != null ? properties[key].defaultValue : []
            } else {
              defaultValue = properties[key].defaultValue 
            }
              Object.assign(formData, 
                {
                  [key]: defaultValue 
                })
          })
          let mergeValues = { ...formData, ...model }
          Object.keys(formData).forEach(key => {
            if (Array.isArray(formData[key]) && formData[key].length === 0 && (!model || !model[key])) {
              mergeValues[key] = []
            }
            const { type } = properties[key]
            // 如果是button
            if (type === 'button') delete mergeValues[key]
          })
          
          return mergeValues
      },
      filterAttrs (item = {}) {
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
      renderFormItems (h) {
          const vm = this
          const { properties }=  vm.config;
          
          return Object.keys(properties).map((key, index) => {
              return vm.renderFormItem(h, properties[key], key, index)
          })
      },
      renderFormItem(h, item, key) {
          const vm = this
          const { values } = vm
          const value = values[key] || null
          const modelEvents = {
              input: function (value) {
                  values[key] = value
              }
            }
          const {
              type,
              label,
              size
          } = item

          const formEachItem = h(type.startWith("el") ? `${type}`: `el-${type}`, {
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
            attrs: {
              ...vm.filterAttrs(item),
              type: item._type
            },
            props: {
              ...item,
              type: item._type
            }
          }, item.text || item.value)
          // select
          const select = h(
              'el-select',
              {
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
                'el-radio',
                {
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
                [option.text]
              )
            })
            const datePicker = h('el-date-picker', {
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
              'el-form-item',
              {
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


const install = function installFormBuilder (Vue) {
  Vue.component('el-json-form', FormBuilder)
}
var index = {
  install: install
};
export default index