import { ActionsButtonsListComponent } from '@features/actions-buttons-list/actions-buttons-list.component';
import type { ColDef } from 'ag-grid-community';

export const articleListColumnDefinition: ColDef[] = [
  {
    field: 'articleTitle',
    headerName: 'Title',
    flex: 3,
    minWidth: 100,
    filter: true,
  },
  {
    field: 'lastUpdated',
    headerName: 'Last Updated',
    filter: 'agDateColumnFilter',
    flex: 1,
    minWidth: 150,
    cellDataType: 'date',
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    filter: true,
    flex: 1,
    minWidth: 150,
    cellDataType: 'date',
  },
  {
    field: 'articleTags',
    headerName: 'Tags',
    minWidth: 150,
    valueFormatter: ({ value }) => value.join(', '),
    filter: true,
  },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionsButtonsListComponent,
    flex: 1,
    minWidth: 200,
    resizable: false,
    sortable: false,
    filter: false,
  },
];
