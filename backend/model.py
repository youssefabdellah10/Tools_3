from config import db

class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), unique =False, nullable=False)
    

    def json(self):
        return {"name": self.name,
                "email": self.email,
                "password": self.password}
    