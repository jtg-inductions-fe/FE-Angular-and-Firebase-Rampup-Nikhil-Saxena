import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ArticleTagInputComponent } from '@features/articleTagInput/articleTagInput.component';
import { TagInputModule } from 'ngx-chips';

import { FiltersSidebarComponent } from './filtersSidebar.component';

@NgModule({
  declarations: [FiltersSidebarComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    TagInputModule,
    ArticleTagInputComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [FiltersSidebarComponent],
  providers: [provideNativeDateAdapter()],
})
export class FiltersSidebarModule {}
