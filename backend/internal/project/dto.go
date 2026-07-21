package project

type ProjectRequest struct {
	Slug         string   `json:"slug" binding:"required"`
	Title        string   `json:"title" binding:"required"`
	Description  string   `json:"description" binding:"required"`
	Thumbnail    string   `json:"thumbnail" binding:"required,url"`
	Technologies []string `json:"technologies" binding:"required"`
	LiveURL      string   `json:"liveUrl" binding:"omitempty,url"`
	GitHubURL    string   `json:"githubUrl" binding:"omitempty,url"`
	Featured     bool     `json:"featured"`
}
