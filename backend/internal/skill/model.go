package skill

type Skill struct {
	ID       string `bson:"_id,omitempty" json:"id"`
	Name     string `bson:"name" json:"name"`
	Category string `bson:"category" json:"category"`
	Icon     string `bson:"icon" json:"icon"`
}
