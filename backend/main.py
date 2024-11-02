from flask import request, jsonify, current_app
from config import app, db
from model import UserModel , AdminModel, CourierModel, OrderModel

#======================================================================================================================#
#=========Users==================#
@app.route('/users/signup', methods=['POST'])
def signup_for_user():
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
def login_for_user():
    data = request.get_json()
    user = UserModel.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'message': 'Email not registered'}), 404  
    if user.check_password(data['password']):
        return jsonify(user.json()), 200
    return jsonify({'message': 'password'}), 401  


#======================================================================================================================#
#=========Admins==================#
@app.route('/admins/signup', methods=['POST'])
def signup_for_admin():
    data = request.get_json()
    if AdminModel.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Admin already exists'}), 400
    new_admin = AdminModel(name=data['name'], email=data['email'], phone=data['phone'])
    new_admin.set_password(data['password'])
    try:
        db.session.add(new_admin)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    return jsonify(new_admin.json()), 201

@app.route('/admins/login', methods=['POST'])
def login_for_admin():
    data = request.get_json()
    admin = AdminModel.query.filter_by(email=data['email']).first()
    if not admin:
        return jsonify({'message': 'Email not registered'}), 404
    if admin.check_password(data['password']):
        return jsonify(admin.json()), 200

#======================================================================================================================#
#=========Couriers==================#
@app.route('/couriers/signup', methods=['POST'])
def signup_for_courier():
    data = request.get_json()
    if CourierModel.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Courier already exists'}), 400
    new_courier = CourierModel(name=data['name'], email=data['email'])
    new_courier.set_password(data['password'])
    try:
        db.session.add(new_courier)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    return jsonify(new_courier.json()), 201

@app.route('/couriers/login', methods=['POST'])
def login_for_courier():
    data = request.get_json()
    courier = CourierModel.query.filter_by(email=data['email']).first()
    if not courier:
        return jsonify({'message': 'Email not registered'}), 404
    if courier.check_password(data['password']):
        return jsonify(courier.json()), 200
    return jsonify({'message': 'password'}), 401

#======================================================================================================================#
#=========Orders==================#

@app.route('/orders/create', methods=['POST'])
def create_order():
    data = request.get_json()
    if not data or not all(key in data for key in ['user_id', 'pickup_location', 'dropoff_location','package_details']):
        return jsonify({'message': 'Invalid request'}), 400
    user = db.session.get(UserModel,data['user_id'])
    if not user:
        return jsonify({'message': 'User not found'}), 404
    new_order = OrderModel(pickup_location=data['pickup_location'], dropoff_location=data['dropoff_location'], user_id=data['user_id'],status='pending',package_details=data['package_details'])
    try:
        db.session.add(new_order)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400
    return jsonify(new_order.json()), 201

@app.route('/users/order', methods=['GET'])
def get_user_orders():
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400

    user = db.session.get(UserModel, user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    orders = OrderModel.query.filter_by(user_id=user_id).all()
    return jsonify([order.json() for order in orders]), 200

@app.route('/users/order', methods=['GET'])
def get_order():
    user_id = request.args.get('user_id',type=int)
    order_id = request.args.get('order_id',type=int)
    if not user_id or not order_id:
        return jsonify({'message': 'User ID and Order ID are required'}), 400

    user = db.session.get(UserModel, user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    order = db.session.get(OrderModel, order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    return jsonify(order.json()), 200
#///////////////////////////////////////////////////////////////////////////////
# Admin features

#Reterive all orders
@app.route('/admin/AllOrders', methods=['GET'])
def get_all_orders():
    orders = OrderModel.query.all()
    return jsonify([order.json() for order in orders]), 200

# Delete Order
@app.route('/admin/delete/order', methods=['DELETE'])
def delete_order():
    order_id = request.args.get('order_id',type=int)
    if not order_id:
        return jsonify({'message': 'Bad Request \n Please enter the order id you want to delete'}), 400
    order = db.session.get(OrderModel, order_id)
    if  not order:
        return jsonify({'message': 'Order ID not found'}), 404
    db.session.delete(order) 
    db.session.commit()
    return jsonify({'message': 'Order is deleted'}), 200


    
    

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)