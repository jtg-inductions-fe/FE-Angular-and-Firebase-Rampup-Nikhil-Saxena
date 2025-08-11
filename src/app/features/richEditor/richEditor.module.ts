import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuillModule } from 'ngx-quill';

import { RichEditorComponent } from './richEditor.component';

@NgModule({
  declarations: [RichEditorComponent],
  imports: [CommonModule, QuillModule.forRoot(), FormsModule],
  exports: [RichEditorComponent],
  providers: [],
})
export class EditorModule {}
