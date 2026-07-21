package contact

type ContactMessage struct {
	ID      string `bson:"_id,omitempty" json:"id"`
	Name    string `bson:"name" json:"name"`
	Email   string `bson:"email" json:"email"`
	Subject string `bson:"subject" json:"subject"`
	Message string `bson:"message" json:"message"`
	Created string `bson:"created" json:"created"`
}
