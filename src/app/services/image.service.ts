import { Observable } from 'rxjs';

export class ImageService {
  private readonly allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private readonly maxSizeInMB = 5;

  /**
   * Encodes the first selected image file from an input element into a base64 string.
   *
   * @param inputElement - The HTML input element containing the image file.
   * @returns An observable that emits the base64 string or an error.
   */
  encodeImage(inputElement: HTMLInputElement): Observable<string | null> {
    return new Observable(observer => {
      if (!inputElement.files || inputElement.files.length === 0) {
        observer.next(null);
        observer.complete();
        return;
      }

      const file = inputElement.files[0];

      // Validate file type
      if (!this.allowedTypes.includes(file.type)) {
        observer.error(
          new Error(
            'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.'
          )
        );
        return;
      }

      // Validate file size
      const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        observer.error(
          new Error(
            `File is too large. Max allowed size is ${this.maxSizeInMB} MB.`
          )
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.onerror = () => {
        observer.error(new Error('Failed to read the file. Please try again.'));
      };

      try {
        reader.readAsDataURL(file);
      } catch (err) {
        observer.error(new Error('Unexpected error while reading the file.'));
      }
    });
  }
}
