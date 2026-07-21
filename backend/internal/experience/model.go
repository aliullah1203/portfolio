package experience

type Experience struct {
	ID          string   `bson:"_id,omitempty" json:"id"`
	Title       string   `bson:"title" json:"title"`
	Company     string   `bson:"company" json:"company"`
	DateRange   string   `bson:"dateRange" json:"dateRange"`
	Description string   `bson:"description" json:"description"`
	Tags        []string `bson:"tags" json:"tags"`
}
