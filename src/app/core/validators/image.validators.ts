import {
  IMAGE_ALLOWED_TYPES,
  IMAGE_MAX_SIZE_BYTES,
  IMAGE_MAX_SIZE_MB,
} from '@core/constants/image.const';
import { INVALID_IMAGE_TYPE } from '@core/constants/messages.const';

/**
 * Validates whether the file type is allowed.
 * @param file - The file to validate.
 * @throws Error if the type is invalid.
 */
export function validateImageType(file: File): void {
  if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
    throw new Error(INVALID_IMAGE_TYPE);
  }
}

/**
 * Validates whether the file size is within the allowed limit.
 * @param file - The file to validate.
 * @throws Error if the size exceeds the limit.
 */
export function validateImageSize(file: File): void {
  if (file.size > IMAGE_MAX_SIZE_BYTES) {
    throw new Error(
      `File is too large. Max allowed size is ${IMAGE_MAX_SIZE_MB} MB.`
    );
  }
}
