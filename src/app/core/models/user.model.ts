/**
 * Represents a basic user profile.
 */
export class User {
  userId: string; // Unique identifier of the user
  email: string; // User's email address
  username: string; // Username or display name
  createdAt: Date; // Account creation timestamp

  constructor(uid: string, email: string, username: string, createdAt: Date) {
    this.userId = uid;
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
  }
}

/**
 * Extends User with authentication-specific fields.
 */
export class AuthReqUser extends User {
  password: string; // User's password (must contain at least one special character)

  constructor(
    uid: string,
    email: string,
    username: string,
    createdAt: Date,
    password: string
  ) {
    super(uid, email, username, createdAt);
    this.password = password;
  }
}
