import { Observable } from 'rxjs';

export class ImageService {
  /**
   * Encodes the first selected file from an input element into a base64 string.
   *
   * @param inputElement - The HTML input element containing the image file.
   * @returns An observable that emits the base64 string or null if no file is selected.
   */
  encodeImage(inputElement: HTMLInputElement): Observable<string | null> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.onerror = error => {
        observer.error(error);
      };

      if (inputElement.files && inputElement.files.length > 0) {
        reader.readAsDataURL(inputElement.files[0]);
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }
}
