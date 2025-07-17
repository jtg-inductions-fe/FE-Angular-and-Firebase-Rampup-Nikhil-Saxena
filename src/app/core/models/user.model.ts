export class User {
  uid: string;
  email: string;
  username: string;
  createdAt: string;

  constructor(uid: string, email: string, username: string, createdAt: string) {
    this.email = email;
    this.uid = uid;
    this.username = username;
    this.createdAt = createdAt;
  }
}
