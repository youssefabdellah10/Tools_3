from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
api = Api(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/store'
db = SQLAlchemy(app)


class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def json(self):
        return {'name': self.name, 'email': self.email, 'password': self.password}
    
with app.app_context():
    db.create_all()
    
    
class UserController(Resource):
    
    #Login user
    def post(self):
        data = request.get_json()
        
        if request.endpoint == 'signup':
            if UserModel.query.filter_by(email=data['email']).first():
                return {'message': 'User already exists'}, 400
            
            new_user = UserModel(name=data['name'], email=data['email'], password=data['password'])
           
            db.session.add(new_user)
            db.session.commit()
            return new_user.json(), 201
        
        elif request.endpoint == 'login':
            user = UserModel.query.filter_by(email=data['email']).first()
            if user and user.password == data['password']:   
                return user.json(), 200
            return {'message': 'Wrong email or password'}, 404
            

        
    
   
# Add routes for login and signup
api.add_resource(UserController, '/users/signup', endpoint='signup')
api.add_resource(UserController, '/users/login', endpoint='login')

    
if __name__ == '__main__':
    app.run(debug=True)