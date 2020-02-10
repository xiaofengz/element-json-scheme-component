/**
 * v1.0.6
 * (c) 2020 by xiaofengz
 */
var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* eslint-disable */
if (typeof String.prototype.startWith != 'function') {
  String.prototype.startWith = function (prefix) {
    return this.slice(0, prefix.length) === prefix;
  };
}
var FormBuilder = {
  name: 'ElJsonForm',

  props: {
    model: {
      type: Object
    },
    formRef: {
      type: String,
      default: function _default() {
        return 'form1';
      }
    },
    config: {
      type: Object,
      default: function _default() {
        return {
          formAttr: {},
          rules: {},
          properties: {}
        };
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
      handler: function handler(model, model2) {
        if (!this.updating) {
          this.values = this.mergeValues();
        } else {
          this.updating = false;
        }
      },

      immediate: true,
      deep: true
    }
  },
  data: function data() {
    return {
      updating: false,
      values: this.mergeValues()
    };
  },
  render: function render(h) {
    var vm = this;
    return h('el-form', {
      props: _extends({}, vm.config.formAttr, {
        model: vm.values,
        labelWidth: vm.labelWidth
      }),
      ref: vm.formRef
    }, [h('h3', vm.config.title || ''), h('p', vm.config.describe || '')].concat(toConsumableArray(vm.$slots.prepend || []), toConsumableArray(vm.renderFormItems(h) || []), toConsumableArray(vm.$slots.append || [])));
  },
  created: function created() {
    this.$emit('input', this.values);
  },

  methods: {
    resetFields: function resetFields() {
      var vm = this;
      // model为props传递，在父组件调用from的方法，并不会触发该form实例组件的model的watch，因此临时解决办法手动改变model的引用
      // vm.model = Object.assign({}, vm.model)
      vm.$refs[vm.formRef].resetFields();
    },
    validate: function validate(cb) {
      var vm = this;
      vm.$refs[vm.formRef].validate(cb);
    },
    validateField: function validateField(cb) {
      vm.$refs[vm.formRef].validateField(cb);
    },
    mergeValues: function mergeValues() {
      var vm = this;
      var model = vm.model;
      var properties = vm.config.properties;

      var formData = {};

      Object.keys(properties).map(function (key) {
        var _properties$key = properties[key],
            type = _properties$key.type,
            multiple = _properties$key.multiple;

        var defaultValue = void 0;
        if (type === 'checkbox' || type === 'select' && multiple) {

          defaultValue = defaultValue != null ? properties[key].defaultValue : [];
        } else {
          defaultValue = properties[key].defaultValue;
        }
        Object.assign(formData, defineProperty({}, key, defaultValue));
      });
      var mergeValues = _extends({}, formData, model);
      Object.keys(formData).forEach(function (key) {
        if (Array.isArray(formData[key]) && formData[key].length === 0 && (!model || !model[key])) {
          mergeValues[key] = [];
        }
        var type = properties[key].type;
        // 如果是button

        if (type === 'button') delete mergeValues[key];
      });

      return mergeValues;
    },
    filterAttrs: function filterAttrs() {
      var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var keys = Object.keys(item);
      var attrs = {};

      keys.forEach(function (key) {
        var value = item[key];

        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
          attrs[key] = value;
        }
      });

      return attrs;
    },
    renderFormItems: function renderFormItems(h) {
      var vm = this;
      var properties = vm.config.properties;


      return Object.keys(properties).map(function (key, index) {
        return vm.renderFormItem(h, properties[key], key, index);
      });
    },
    renderFormItem: function renderFormItem(h, item, key) {
      var _elements;

      var vm = this;
      var values = vm.values;

      var value = values[key] || null;
      var modelEvents = {
        input: function input(value) {
          values[key] = value;
        }
      };
      var type = item.type,
          label = item.label,
          size = item.size;


      var formEachItem = h(type.startWith("el") ? '' + type : 'el-' + type, {
        attrs: _extends({}, vm.filterAttrs(item)),
        props: _extends({
          value: value
        }, item),
        on: _extends({}, modelEvents)
      });
      var button = h('el-button', {
        attrs: _extends({}, vm.filterAttrs(item), {
          type: item._type
        }),
        props: _extends({}, item, {
          type: item._type
        })
      }, item.text || item.value);
      // select
      var select = h('el-select', {
        attrs: _extends({}, vm.filterAttrs(item)),
        props: _extends({
          value: value
        }, item),
        on: _extends({}, modelEvents)
      }, (item.options || []).map(function (option) {
        return h('el-option', {
          attrs: _extends({}, vm.filterAttrs(option)),
          props: _extends({
            key: option.value
          }, option)
        });
      }));
      var radios = (item.options || []).map(function (option) {
        option = _extends({
          name: item.name
        }, option);
        return h('el-radio', {
          attrs: _extends({}, vm.filterAttrs(option)),
          props: _extends({
            value: value
          }, option),
          on: _extends({}, modelEvents)
        }, [option.text]);
      });
      var datePicker = h('el-date-picker', {
        attrs: _extends({}, vm.filterAttrs(item), {
          type: item._type
        }),
        props: _extends({
          value: value
        }, item, {
          type: item._type
        }),
        on: _extends({}, modelEvents)
      });
      var input = h('el-input', {
        attrs: _extends({}, vm.filterAttrs(item)),
        props: _extends({
          value: value
        }, item),
        on: _extends({}, modelEvents)
      });
      var elements = (_elements = {}, defineProperty(_elements, type, formEachItem), defineProperty(_elements, 'button', button), defineProperty(_elements, 'select', select), defineProperty(_elements, 'input', input), defineProperty(_elements, 'radios', radios), defineProperty(_elements, 'datePicker', datePicker), defineProperty(_elements, 'date-picker', datePicker), _elements);
      return h('el-form-item', {
        props: {
          prop: key,
          label: label,
          size: size
        }
      }, [elements[type]]);
    }
  }
};

var install = function installFormBuilder(Vue) {
  Vue.component('el-json-form', FormBuilder);
};
var index = {
  install: install
};

/* eslint-disable */
var TableBuilder = {
  name: 'ElJsonTable',

  props: {
    data: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    config: {
      type: Object,
      default: function _default() {
        return {
          column: []
        };
      }
    }
  },
  watch: {},
  data: function data() {
    return {};
  },
  render: function render(h, context) {
    var vm = this;
    return h('div', {
      'class': 'ddmc-table__container',
      style: {
        marginTop: '10px'
      },
      attrs: {}
    }, [].concat(toConsumableArray(vm.$slots.tablePrepend || []), [vm.renderTable(h, context)], toConsumableArray(vm.$slots.tableAppend || []), toConsumableArray(vm.$slots.paginationPrepend || []), toConsumableArray(vm.config.pagination === false ? [] : [vm.renderPagination(h, context)]), toConsumableArray(vm.$slots.paginationAppend || [])));
  },
  created: function created() {},

  methods: {
    renderPagination: function renderPagination(h) {
      var vm = this;

      return h('el-pagination', {
        style: {
          marginTop: '10px'
        },
        attrs: _extends({
          layout: "total, sizes, prev, pager, next, jumper",
          currentPage: 1,
          pageSize: 25,
          total: 0,
          pageSizes: [10, 25, 50, 100]
        }, vm.filterAttrs(vm.config.pagination)),
        props: _extends({}, vm.config.pagination),
        on: {
          'size-change': function sizeChange(val) {
            return vm.$emit('on-query', {
              limit: val,
              page: 1
            });
          },
          'current-change': function currentChange(val) {
            return vm.$emit('on-query', {
              page: val
            });
          },
          'prev-change': function prevChange(val) {
            return vm.$emit('on-query', {
              page: val
            });
          },
          'next-change': function nextChange(val) {
            return vm.$emit('on-query', {
              page: val
            });
          }
        }
      });
    },
    renderTable: function renderTable(h, context) {
      var vm = this;

      return h('el-table', {
        attrs: _extends({}, vm.filterAttrs(vm.config)),
        props: _extends({
          data: vm.data
        }, vm.config),
        on: {
          'select': function select(selection, row) {
            return vm.emitEventHandler('select', selection, row);
          },
          'select-all': function selectAll(selection) {
            return vm.emitEventHandler('select-all', selection);
          },
          'selection-change': function selectionChange(selection) {
            return vm.emitEventHandler('selection-change', selection);
          },
          'cell-mouse-enter': function cellMouseEnter(row, column, cell, event) {
            return vm.emitEventHandler('cell-mouse-enter', row, column, cell, event);
          },
          'cell-mouse-leave': function cellMouseLeave(row, column, cell, event) {
            return vm.emitEventHandler('cell-mouse-leave', row, column, cell, event);
          },
          'cell-click': function cellClick(row, column, cell, event) {
            return vm.emitEventHandler('cell-click', row, column, cell, event);
          },
          'cell-dblclick': function cellDblclick(row, column, cell, event) {
            return vm.emitEventHandler('cell-dblclick', row, column, cell, event);
          },
          'row-click': function rowClick(row, column, event) {
            return vm.emitEventHandler('row-click', row, column, event);
          },
          'row-contextmenu': function rowContextmenu(row, column, event) {
            return vm.emitEventHandler('row-contextmenu', row, column, event);
          },
          'row-dblclick': function rowDblclick(row, column, event) {
            return vm.emitEventHandler('row-dblclick', row, column, event);
          },
          'header-click': function headerClick(column, event) {
            return vm.emitEventHandler('header-click', column, event);
          },
          'header-contextmenu': function headerContextmenu(column, event) {
            return vm.emitEventHandler('header-contextmenu', column, event);
          },
          'sort-change': function sortChange(_ref) {
            var column = _ref.column,
                prop = _ref.prop,
                order = _ref.order;
            return vm.emitEventHandler('sort-change', {
              column: column,
              prop: prop,
              order: order
            });
          },
          'filter-change': function filterChange(filters) {
            return vm.emitEventHandler('filter-change', filters);
          },
          'current-change': function currentChange(currentRow, oldCurrentRow) {
            return vm.emitEventHandler('current-change', currentRow, oldCurrentRow);
          },
          'header-dragend': function headerDragend(newWidth, oldWidth, column, event) {
            return vm.emitEventHandler('header-dragend', newWidth, oldWidth, column, event);
          },
          'expand-change': function expandChange(row, expandedRows) {
            return vm.emitEventHandler('expand-change', row, expandedRows);
          }
        }
      }, [].concat(toConsumableArray(vm.$slots.prepend || []), toConsumableArray(vm.renderTableColumns(h, context) || []), toConsumableArray(vm.$slots.append || [])));
    },
    renderTableColumns: function renderTableColumns(h, context) {
      var vm = this;
      var columns = vm.config.columns;

      return columns.map(function (item, key) {
        return vm.renderCloumn(h, context, item);
      });
    },
    renderCloumn: function renderCloumn(h, context, item) {
      var vm = this;
      return h('el-table-column', Object.assign({
        attrs: _extends({}, vm.filterAttrs(item)),
        props: _extends({
          data: vm.data
        }, item),
        on: {}
      },
      // 根据row自定义table-column
      item.prop && vm.$scopedSlots[item.prop] ? {
        scopedSlots: {
          default: function _default(props) {
            return vm.$scopedSlots[item.prop](props);
            // return vm.cloumnsRender[item.prop](h, props.row[item.prop], props.row, props.row.$index) 
          }
        }
      } : {}), [].concat(toConsumableArray(vm.$slots.prepend || []), toConsumableArray(vm.$slots.append || [])));
    },
    emitEventHandler: function emitEventHandler(event) {
      var vm = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      vm.$emit.apply(vm, [event].concat(toConsumableArray(args)));
    },
    filterAttrs: function filterAttrs() {
      var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var keys = Object.keys(item);
      var attrs = {};

      keys.forEach(function (key) {
        var value = item[key];

        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
          attrs[key] = value;
        }
      });
      return attrs;
    }
  }
};

var install$1 = function installTableBuilder(Vue) {
  Vue.component('el-json-table', TableBuilder);
};
var index$1 = {
  install: install$1
};

var ElJsonSchemaComponent = {
    ElJsonForm: index,
    ElJsonTable: index$1
};

export default ElJsonSchemaComponent;
