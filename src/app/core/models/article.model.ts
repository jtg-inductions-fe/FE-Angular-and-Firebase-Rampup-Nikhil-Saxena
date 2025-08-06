import { Timestamp } from '@angular/fire/firestore';

/**
 * Represents the data required to create or update an article.
 */
export class ArticleRequestModel {
  userId: string; // ID of the user who created the article
  articleUsername: string; // Username of the article author
  articleTitle: string; // Title of the article
  articleImage: string; // Base64-encoded image or URL
  articleContent: string; // HTML content of the article
  articleTags: string[]; // List of tags associated with the article
  lastUpdated: Date | Timestamp; // Last updated timestamp
  createdAt: Date | Timestamp; // Article creation timestamp

  constructor(
    userId: string,
    articleUsername: string,
    articleTitle: string,
    articleImage: string,
    articleContent: string,
    articleTags: string[],
    lastUpdated: Date | Timestamp,
    createdAt: Date | Timestamp
  ) {
    this.userId = userId;
    this.articleUsername = articleUsername;
    this.articleTitle = articleTitle;
    this.articleImage = articleImage;
    this.articleContent = articleContent;
    this.articleTags = articleTags;
    this.lastUpdated = lastUpdated;
    this.createdAt = createdAt;
  }
}

/**
 * Extends ArticleRequestModel with a unique articleId.
 */
export class Article extends ArticleRequestModel {
  articleId: string; // Unique identifier for the article

  constructor(
    userId: string,
    articleId: string,
    articleUsername: string,
    articleTitle: string,
    articleImage: string,
    articleContent: string,
    articleTags: string[],
    lastUpdated: Date | Timestamp,
    createdAt: Date | Timestamp
  ) {
    super(
      userId,
      articleUsername,
      articleTitle,
      articleImage,
      articleContent,
      articleTags,
      lastUpdated,
      createdAt
    );
    this.articleId = articleId;
  }
}
