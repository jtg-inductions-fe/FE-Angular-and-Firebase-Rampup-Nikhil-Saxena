import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ImageService } from '@services/image.service';
import { QuillModule } from 'ngx-quill';

import { TextEditorComponent } from './rich-editor.component';

@NgModule({
  declarations: [TextEditorComponent],
  imports: [CommonModule, QuillModule.forRoot(), FormsModule],
  exports: [TextEditorComponent],
  providers: [ImageService],
})
export class EditorModule {}
