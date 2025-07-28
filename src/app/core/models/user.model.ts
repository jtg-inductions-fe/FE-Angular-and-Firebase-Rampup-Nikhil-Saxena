export class User {
  userId: string;
  email: string;
  username: string;
  createdAt?: Date;

  constructor(uid: string, email: string, username: string, createdAt: Date) {
    this.userId = uid;
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
  }
}

export class AuthReqUser extends User {
  password: string;

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
