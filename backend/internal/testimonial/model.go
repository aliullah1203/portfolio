package testimonial

type Testimonial struct {
	ID           string `bson:"_id,omitempty" json:"id"`
	Quote        string `bson:"quote" json:"quote"`
	Author       string `bson:"author" json:"author"`
	Role         string `bson:"role" json:"role"`
	Organization string `bson:"organization" json:"organization"`
}
