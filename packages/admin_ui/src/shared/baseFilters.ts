import i18n from '@/plugins/i18n'
import { TableFilters } from '@/types/Table'

type TableFilter = TableFilters[keyof TableFilters]

function defineObject<T extends Record<string, TableFilter>>(arg: T): T {
  return arg
}

export default defineObject({
  createdAt: {
    text: i18n.t('filter.by-created-date'),
    type: 'select-date',
    data: [
      {
        text: i18n.t('after'),
        filter: (value) => {
          return { createdAt: { after: value } }
        },
      },
      {
        text: i18n.t('before'),
        filter: (value) => {
          return { createdAt: { before: value } }
        },
      },
      {
        text: i18n.t('between'),
        range: true,
        filter: (val1, val2) => {
          return { createdAt: { after: val1, before: val2 } }
        },
      },
    ],
  },
  deletedAt: {
    text: i18n.t('filter.by-deleted-date'),
    type: 'select-date',
    data: [
      {
        text: i18n.t('after'),
        filter: (value) => {
          return { deletedAt: { after: value } }
        },
      },
      {
        text: i18n.t('before'),
        filter: (value) => {
          return { deletedAt: { before: value } }
        },
      },
      {
        text: i18n.t('between'),
        range: true,
        filter: (val1, val2) => {
          return { deletedAt: { after: val1, before: val2 } }
        },
      },
    ],
  },
  updatedAt: {
    text: i18n.t('filter.by-updated-date'),
    type: 'select-date',
    data: [
      {
        text: i18n.t('after'),
        filter: (value) => {
          return { updatedAt: { after: value } }
        },
      },
      {
        text: i18n.t('before'),
        filter: (value) => {
          return { updatedAt: { before: value } }
        },
      },
      {
        text: i18n.t('between'),
        range: true,
        filter: (val1, val2) => {
          return { updatedAt: { after: val1, before: val2 } }
        },
      },
    ],
  },
})
