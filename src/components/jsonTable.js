/* eslint-disable */
const TableBuilder = {
  name: 'ElJsonTable',

  props: {
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
  watch: {},
  data() {
    return {}
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
  created() {},
  methods: {
    renderPagination(h) {
      const vm = this

      return h(
        'el-pagination', {
          style: {
            marginTop: '10px'
          },
          attrs: {
            layout: "total, sizes, prev, pager, next, jumper",
            currentPage: 1,
            pageSize: 25,
            total: 0,
            pageSizes: [10, 25, 50, 100],
            ...vm.filterAttrs(vm.config.pagination),
          },
          on: {
            'size-change': (val) => vm.$emit('on-query', {
              limit: val,
              page: 1
            }),
            'current-change': (val) => vm.$emit('on-query', {
              page: val
            }),
            'prev-change': (val) => vm.$emit('on-query', {
              page: val
            }),
            'next-change': (val) => vm.$emit('on-query', {
              page: val
            }),
          }
        }
      )
    },
    renderTable(h, context) {
      const vm = this

      return h(
        'el-table', {
          attrs: {
            ...vm.filterAttrs(vm.config)
          },
          props: {
            data: vm.data
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
              data: vm.data
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