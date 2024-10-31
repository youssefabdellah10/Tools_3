from config import db
from werkzeug.security import generate_password_hash, check_password_hash

class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(100), unique = False, nullable=False)
    password = db.Column(db.String(256), unique =False, nullable=False)
    orders = db.relationship('OrderModel', back_populates='user',lazy='dynamic')
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password, password)
    

    def json(self):
        return {"name": self.name,
                "email": self.email,
                "phone": self.phone
        }
        
        
        
class AdminModel(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(100), unique = False, nullable=False)
    password = db.Column(db.String(256), unique =False, nullable=False)
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password, password)
    

    def json(self):
        return {"name": self.name,
                "email": self.email,
                "phone": self.phone
        }

class CourierModel(db.Model):
    __tablename__ = 'couriers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(256), unique =False, nullable=False)
    orders = db.relationship('OrderModel', back_populates='courier',lazy='dynamic')
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    
class OrderModel(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(100), nullable=False)
    products = db.relationship('ProductModel', secondary='orders_products', back_populates='orders')
    courier_id = db.Column(db.Integer, db.ForeignKey('couriers.id'),index = True)
    courier = db.relationship('CourierModel', back_populates='orders')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),index = True)
    user= db.relationship('UserModel', back_populates='orders')
    
    def json(self):
        return {"id": self.id,
                "total": self.total,
                "status": self.status,
                "user_id": self.user_id,
                "courier_id": self.courier_id,
                "list_of_products": [product.json() for product in self.products]
        }
     

class ProductModel(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    orders = db.relationship('OrderModel', secondary='orders_products', back_populates='products')
    
    def json(self):
        return {"name": self.name,
                "price": self.price,
                "quantity": self.quantity
                }
           
order_product = db.Table('orders_products',
    db.Column('order_id', db.Integer, db.ForeignKey('orders.id')),
    db.Column('product_id', db.Integer, db.ForeignKey('products.id'))
)
    
        