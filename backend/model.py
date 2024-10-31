from config import db
from werkzeug.security import generate_password_hash, check_password_hash

class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(100), unique = False, nullable=False)
    password = db.Column(db.String(256), unique =False, nullable=False)
    orders = db.relationship('OrderModel', back_populates='user')
    
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
    table_name = 'couriers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(256), unique =False, nullable=False)
    orders = db.relationship('OrderModel', back_populates='courier')
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    

class ProductModel(db.Model):
    table_name = 'products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique = False, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    order_associations = db.relationship('OrderProducts', back_populates='product')
    
    def json(self):
        return {"name": self.name,
                "price": self.price,
                "quantity": self.quantity
                }
        
class OrderModel(db.Model):
    table_name = 'orders'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(100), nullable=False)
    product = db.relationship('ProductModel', back_populates='order_associations')
    order = db.relationship('OrderModel', back_populates='product_associations')
    courier = db.relationship('CourierModel', back_populates='orders')
    user = db.relationship('UserModel', back_populates='orders')
    
    def json(self):
        return {"id": self.id,
                "total": self.total,
                "status": self.status,
                "user_id": self.user_id,
                "courier_id": self.courier_id,
                "list_of_products": [product.json() for product in self.products]
                }
    
        