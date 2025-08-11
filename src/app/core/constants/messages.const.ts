// AUTH MESSAGES
const LOGOUT_MESSAGE = 'Logged out successfully';
const INVALID_CREDENTIALS = 'Invalid email or password.';
const USER_NOT_EXISTS = 'Account does not exist or was deleted.';
const USER_ALREADY_EXISTS = 'Email already in use. Please try logging in.';
const PASSWORD_VALIDATION_ERROR =
  'Password must be at least 8 characters and contain letters, numbers, and special characters.';

// ARTICLE MESSAGES
const DELETE_FAIL = 'Failed to Delete Article';
const ARTICLE_ID_MISSING = 'Article ID is missing';
const ARTICLE_NOT_FOUND = 'Article not found.';
const ARTICLE_LOAD_FAILED = 'Failed to load article';
const ARTICLE_UNAUTHORIZED_ACCESS = 'Unauthorized access to article';
const ARTILE_UPDATE_SUCCESS = 'Article updated successfully.';
const ARTICLE_UPDATE_FAIL = 'Failed to update article.';
const ARTICLE_CREATE_SUCCESS = 'Article created successfully.';
const ARTICLE_CREATE_FAIL = 'Failed to create article.';

// IMAGE MESSAGES
const UPLOAD_SUCCESSFULL = 'Image uploaded Successfully';
const UPLOAD_FAILED = 'Image upload failed';
const INVALID_IMAGE_TYPE =
  'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.';
const INVALID_IMAGE_SIZE = 'Failed to read the file. Please try again.';

// FORMS MESSAGES
const ALL_FIELDS_REQUIRED = 'Please fill out all required fields.';

//FIREBASE
const TOO_MANY_REQUEST = 'Too many failed attempts. Try again later.';

const UNEXPECTED_ERROR = 'An unexpected error occurred. Please try again.';

export {
  LOGOUT_MESSAGE,
  DELETE_FAIL,
  ARTICLE_ID_MISSING,
  ARTICLE_NOT_FOUND,
  ARTICLE_UNAUTHORIZED_ACCESS,
  ARTICLE_LOAD_FAILED,
  UPLOAD_FAILED,
  UPLOAD_SUCCESSFULL,
  ALL_FIELDS_REQUIRED,
  ARTICLE_UPDATE_FAIL,
  ARTILE_UPDATE_SUCCESS,
  ARTICLE_CREATE_FAIL,
  ARTICLE_CREATE_SUCCESS,
  INVALID_CREDENTIALS,
  TOO_MANY_REQUEST,
  USER_NOT_EXISTS,
  UNEXPECTED_ERROR,
  USER_ALREADY_EXISTS,
  PASSWORD_VALIDATION_ERROR,
  INVALID_IMAGE_TYPE,
  INVALID_IMAGE_SIZE,
};
