import { ActionsButtonsListComponent } from '@features/actionsButtonsList/actionsButtonsList.module';
import type { ColDef } from 'ag-grid-community';

export const articleListColumnDefinition: ColDef[] = [
  {
    field: 'articleTitle',
    headerName: 'Title',
    flex: 3,
    minWidth: 100,
  },
  {
    field: 'lastUpdated',
    headerName: 'Last Updated',
    flex: 1,
    minWidth: 150,
    cellDataType: 'date',
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 1,
    minWidth: 150,
    cellDataType: 'date',
  },
  {
    field: 'articleTags',
    headerName: 'Tags',
    minWidth: 150,
    flex: 2,
    sortable: false,
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
