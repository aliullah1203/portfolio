package project

type Project struct {
	ID           string   `bson:"_id,omitempty" json:"id"`
	Slug         string   `bson:"slug" json:"slug"`
	Title        string   `bson:"title" json:"title"`
	Description  string   `bson:"description" json:"description"`
	Thumbnail    string   `bson:"thumbnail" json:"thumbnail"`
	Technologies []string `bson:"technologies" json:"technologies"`
	LiveURL      string   `bson:"liveUrl,omitempty" json:"liveUrl,omitempty"`
	GitHubURL    string   `bson:"githubUrl,omitempty" json:"githubUrl,omitempty"`
	Featured     bool     `bson:"featured" json:"featured"`
}
