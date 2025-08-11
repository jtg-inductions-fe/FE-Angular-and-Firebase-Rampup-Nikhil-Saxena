/**
 * Represents a basic user profile.
 */
export class User {
  userId: string = ''; // Unique identifier of the user
  email: string = ''; // User's email address
  username: string = ''; // Username or display name
  createdAt: Date = new Date(); // Account creation timestamp
}

/**
 * Extends User with password field
 */
export class AuthUser extends User {
  password: string = ''; // User's password
}
