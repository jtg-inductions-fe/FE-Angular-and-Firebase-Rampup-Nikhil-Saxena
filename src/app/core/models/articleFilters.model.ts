interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface ArticleFilters {
  searchString?: string;
  tags?: string[];
  createdAtRange?: DateRange;
  lastUpdatedRange?: DateRange;
}
