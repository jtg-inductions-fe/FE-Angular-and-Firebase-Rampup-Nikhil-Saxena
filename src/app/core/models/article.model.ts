export class ArticleRequestModel {
  userId: string;
  articleUsername: string;
  articleTitle: string;
  articleImage: string;
  articleContent: string;
  articleTags: string[];
  lastUpdated: Date;
  createdAt: Date;

  constructor(
    userId: string,
    articleUsername: string,
    articleTitle: string,
    articleImage: string,
    articleContent: string,
    articleTags: string[],
    lastUpdated: Date,
    createdAt: Date
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

export class Article extends ArticleRequestModel {
  articleId?: string;

  constructor(
    userId: string,
    articleId: string,
    articleUsername: string,
    articleTitle: string,
    articleImage: string,
    articleContent: string,
    articleTags: string[],
    lastUpdated: Date,
    createdAt: Date
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
