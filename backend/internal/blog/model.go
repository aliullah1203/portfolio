package blog

type BlogPost struct {
	ID              string `bson:"_id,omitempty" json:"id"`
	Slug            string `bson:"slug" json:"slug"`
	Title           string `bson:"title" json:"title"`
	Excerpt         string `bson:"excerpt" json:"excerpt"`
	Content         string `bson:"content" json:"content"`
	PublishedAt     string `bson:"publishedAt" json:"publishedAt"`
	Category        string `bson:"category" json:"category"`
	ReadTime        string `bson:"readTime" json:"readTime"`
	CoverImage      string `bson:"coverImage" json:"coverImage"`
	Tags            string `bson:"tags" json:"tags"`
	MetaTitle       string `bson:"metaTitle" json:"metaTitle"`
	MetaDescription string `bson:"metaDescription" json:"metaDescription"`
	Status          string `bson:"status" json:"status"`
	Featured        bool   `bson:"featured" json:"featured"`
	AllowComments   bool   `bson:"allowComments" json:"allowComments"`
}

type BlogReaction struct {
	BlogSlug     string `json:"blogSlug"`
	ReactionType string `json:"reactionType"`
	Count        int    `json:"count"`
}

type BlogComment struct {
	ID        string `json:"id"`
	BlogSlug  string `json:"blogSlug"`
	Author    string `json:"author"`
	Text      string `json:"text"`
	CreatedAt string `json:"createdAt"`
}
