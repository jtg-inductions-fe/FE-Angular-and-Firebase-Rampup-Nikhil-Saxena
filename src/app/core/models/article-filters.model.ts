export interface ArticleFilters {
  searchString?: string;
  tags?: string[];
  createdAtRange?: {
    start: Date | null;
    end: Date | null;
  };
  lastUpdatedRange?: {
    start: Date | null;
    end: Date | null;
  };
}
