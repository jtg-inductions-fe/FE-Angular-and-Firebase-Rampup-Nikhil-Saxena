import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import { textEditorConfiguration } from './rich-editor.configuration';

@Component({
  selector: 'app-text-editor',
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RichEditorComponent implements OnChanges {
  @Input() content: string = '';
  @Input() type: 'editor' | 'viewer' = 'editor';
  @Output() contentChange = new EventEmitter<string>();

  quillConfig = textEditorConfiguration;

  localContent: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['content'] &&
      changes['content'].currentValue !== this.localContent
    ) {
      this.localContent = changes['content'].currentValue || '';
    }
  }

  changedEditor(): void {
    this.contentChange.emit(this.localContent);
  }
}
