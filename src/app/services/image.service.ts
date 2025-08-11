import {
  UNEXPECTED_ERROR,
  INVALID_IMAGE_SIZE,
} from '@core/constants/messages.const';
import {
  validateImageType,
  validateImageSize,
} from '@core/validators/image.validators';

import { Observable } from 'rxjs';

export class ImageService {
  /**
   * Encodes the first selected image file from an input element into a base64 string.
   *
   * @param inputElement - The HTML input element containing the image file.
   * @returns An observable that emits the base64 string or null if no file is selected.
   */
  encodeImage(inputElement: HTMLInputElement): Observable<string | null> {
    return new Observable(observer => {
      if (!inputElement.files || inputElement.files.length === 0) {
        observer.next(null);
        observer.complete();
        return;
      }

      const file = inputElement.files[0];

      try {
        validateImageType(file);
        validateImageSize(file);
      } catch (err) {
        observer.error(err);
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.onerror = () => {
        observer.error(new Error(INVALID_IMAGE_SIZE));
      };

      try {
        reader.readAsDataURL(file);
      } catch (err) {
        observer.error(new Error(UNEXPECTED_ERROR));
      }
    });
  }
}
