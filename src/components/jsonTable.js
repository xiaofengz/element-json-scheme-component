/* eslint-disable */
const TableBuilder = {
  name: 'ElJsonTable',

  props: {
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    config: {
      type: Object,
      default () {
        return {
          column: []
        }
      }
    },
  },
  watch: {
    config: {
      handler: function handler(newValue, oldValue) {
        this.pagination = {
          ...this.pagination,
          ...newValue.pagination
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      pagination: {}
    }
  },

  render(h, context) {
    const vm = this
    return h('div', {
        'class': 'ddmc-table__container',
        style: {
          marginTop: '10px'
        },
        attrs: {
        },
      },
      [
        ...(vm.$slots.tablePrepend || []),
        vm.renderTable(h, context),
        ...(vm.$slots.tableAppend || []),
        // 默认带分页组件
        ...(vm.$slots.paginationPrepend || []),
        ...(vm.config.pagination === false ? [] : [vm.renderPagination(h, context)]),
        ...(vm.$slots.paginationAppend || []),
      ],
    )
  },
  created() {
    const vm = this
    vm.pagination = {
      layout: "total, sizes, prev, pager, next, jumper",
      currentPage: 1,
      pageSize: 25,
      total: 0,
      pageSizes: [10, 25, 50, 100],
      ...vm.config.pagination
    }
  },
  methods: {
    renderPagination(h) {
      const vm = this
      
      return h(
        'el-pagination', {
          style: {
            marginTop: '10px'
          },
          attrs: {
            ...vm.pagination,
          },
          props: {
            ...vm.pagination,
          },
          on: {
            'size-change': (val) => {
              vm.pagination.pageSize = val
              vm.pagination.currentPage = 1
              vm.$emit('on-query', {currentPage: 1, pageSize: val})
            },
            'current-change': (val) => {
              vm.pagination.currentPage = val
              vm.$emit('on-query', {currentPage: val, pageSize: vm.pagination.pageSize})
            },
            'prev-change': (val) => {
              vm.pagination.currentPage = val
              vm.$emit('on-query', {currentPage: val, pageSize: vm.pagination.pageSize})
            },
            'next-change': (val) => {
              vm.pagination.currentPage = val
              vm.$emit('on-query', {currentPage: val, pageSize: vm.pagination.pageSize})
            },
          }
        }
      )
    },
    renderTable(h, context) {
      const vm = this
      return h(
        'el-table', {
          directives: [
            {
              name: 'loading',
              value: vm.loading,
            }
          ],
          attrs: {
            ...vm.filterAttrs(vm.config)
          },
          props: {
            data: vm.data,
            ...vm.config
          },
          on: {
            'select': (selection, row) => vm.emitEventHandler('select', selection, row),
            'select-all': selection => vm.emitEventHandler('select-all', selection),
            'selection-change': selection => vm.emitEventHandler('selection-change', selection),
            'cell-mouse-enter': (row, column, cell, event) => vm.emitEventHandler('cell-mouse-enter', row, column, cell, event),
            'cell-mouse-leave': (row, column, cell, event) => vm.emitEventHandler('cell-mouse-leave', row, column, cell, event),
            'cell-click': (row, column, cell, event) => vm.emitEventHandler('cell-click', row, column, cell, event),
            'cell-dblclick': (row, column, cell, event) => vm.emitEventHandler('cell-dblclick', row, column, cell, event),
            'row-click': (row, column, event) => vm.emitEventHandler('row-click', row, column, event),
            'row-contextmenu': (row, column, event) => vm.emitEventHandler('row-contextmenu', row, column, event),
            'row-dblclick': (row, column, event) => vm.emitEventHandler('row-dblclick', row, column, event),
            'header-click': (column, event) => vm.emitEventHandler('header-click', column, event),
            'header-contextmenu': (column, event) => vm.emitEventHandler('header-contextmenu', column, event),
            'sort-change': ({
              column,
              prop,
              order
            }) => vm.emitEventHandler('sort-change', {
              column,
              prop,
              order
            }),
            'filter-change': filters => vm.emitEventHandler('filter-change', filters),
            'current-change': (currentRow, oldCurrentRow) => vm.emitEventHandler('current-change', currentRow, oldCurrentRow),
            'header-dragend': (newWidth, oldWidth, column, event) => vm.emitEventHandler('header-dragend', newWidth, oldWidth, column, event),
            'expand-change': (row, expandedRows) => vm.emitEventHandler('expand-change', row, expandedRows)
          }
        },
        [
          ...(vm.$slots.prepend || []),
          ...(vm.renderTableColumns(h, context) || []),
          ...(vm.$slots.append || [])
        ]
      )
    },
    renderTableColumns(h, context) {
      const vm = this
      const {
        columns
      } = vm.config
      return columns.map((item, key) => {
        return vm.renderCloumn(h, context, item)
      })
    },
    renderCloumn(h, context, item) {
      const vm = this
      return h(
        'el-table-column',
        Object.assign({
            attrs: {
              ...vm.filterAttrs(item)
            },
            props: {
              data: vm.data,
              ...item
            },
            on: {},
          },
          // 根据row自定义table-column
          item.prop && vm.$scopedSlots[item.prop] ? {
            scopedSlots: {
              default: props => {
                return vm.$scopedSlots[item.prop](props)
                // return vm.cloumnsRender[item.prop](h, props.row[item.prop], props.row, props.row.$index) 
              }
            }
          } : {}),
        [
          ...(vm.$slots.prepend || []),
          ...(vm.$slots.append || [])
        ]
      )
    },
    emitEventHandler(event, ...args) {
      const vm = this
      vm.$emit(event, ...args)
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
  }
}


const install = function installTableBuilder(Vue) {
  Vue.component('el-json-table', TableBuilder)
}
const index = {
  install: install
};
export default index