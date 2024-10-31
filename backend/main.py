from flask import request, jsonify
from config import app, db
from model import UserModel

@app.route('/users/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if UserModel.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    new_user = UserModel(name=data['name'], email=data['email'], phone=data['phone'])
    new_user.set_password(data['password'])
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    return jsonify(new_user.json()), 201

@app.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    user = UserModel.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'message': 'Email not registered'}), 404  # Change the status code to 404
    if user.check_password(data['password']):
        return jsonify(user.json()), 200
    return jsonify({'message': 'password'}), 401  # Change to 401 for wrong password

""""
@app.route('/products/create', methods=['POST'])
def create_product():
    data = request.get_json()
    new_product = ProductModel(name=data['name'], price=data['price'], quantity=data['quantity'])
    try:
        db.session.add(new_product)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    return jsonify(new_product.json()), 201

@app.route('/orders/create', methods=['POST'])
def create_order():
    data = request.get_json()
    total_price = 0
    try:
        for product_data in data['products']:
            product = ProductModel.query.get(product_data['product_id'])
            if product and product.quantity >= product_data['quantity']:
                total_price += product.price * product_data['quantity']
                product.quantity -= product_data['quantity']
                db.session.execute(order_products.insert().values(order_id=new_order.id, product_id=product.id, quantity=product_data['quantity']))
            else:
                raise Exception('Product not found or insufficient quantity')
        new_order = OrderModel(user_id=data['user_id'],total=total_price, status='pending')
        db.session.add(new_order)
        db.session.flush()
        db.session.commit()
    except Exception as e:
        db.rollback()
        return jsonify({'message': str(e)}), 400
    return jsonify(new_order.json()), 201
"""

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)