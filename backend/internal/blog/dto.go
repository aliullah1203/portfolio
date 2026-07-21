package blog

type BlogRequest struct {
	Slug            string `json:"slug"`
	Title           string `json:"title"`
	Excerpt         string `json:"excerpt"`
	Content         string `json:"content"`
	PublishedAt     string `json:"publishedAt"`
	Category        string `json:"category"`
	ReadTime        string `json:"readTime"`
	CoverImage      string `json:"coverImage"`
	Tags            string `json:"tags"`
	MetaTitle       string `json:"metaTitle"`
	MetaDescription string `json:"metaDescription"`
	Status          string `json:"status"`
	Featured        bool   `json:"featured"`
	AllowComments   bool   `json:"allowComments"`
}

type BlogReactionRequest struct {
	ReactionType string `json:"reactionType" binding:"required"`
}

type BlogCommentRequest struct {
	Author string `json:"author" binding:"required"`
	Text   string `json:"text" binding:"required"`
}
