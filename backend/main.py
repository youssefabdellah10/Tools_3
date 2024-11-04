from flask import request, jsonify, current_app
from config import app, db
from model import UserModel , AdminModel, CourierModel, OrderModel

#======================================================================================================================#
#=========Signup/Login==================#

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    required_fields = ['name', 'email', 'phone', 'password', 'role']
    if not data or not all(key in data for key in required_fields):
        return jsonify({'message': 'Invalid request'}), 400

    existing_user = UserModel.query.filter_by(email=data['email']).first() or \
                    CourierModel.query.filter_by(email=data['email']).first() or \
                    AdminModel.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    def create_user(role, model):
        new_user = model(name=data['name'], email=data['email'], phone=data['phone'], role=role)
        new_user.set_password(data['password'])
        return new_user

    role = data['role'].strip().lower()
    if role == 'customer':
        new_user = create_user(role, UserModel)
    elif role == 'courier':
        new_user = create_user(role, CourierModel)
    elif role == 'admin':
        new_user = create_user(role, AdminModel)
    else:
        return jsonify({'message': 'Invalid role'}), 400

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400

    return jsonify(new_user.json()), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(key in data for key in ['email', 'password']):
        return jsonify({'message': 'Invalid request'}), 400

    user = UserModel.query.filter_by(email=data['email']).first()
    courier = CourierModel.query.filter_by(email=data['email']).first()
    admin = AdminModel.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        return jsonify({'message': 'Logged in successfully', 'role': 'user'}), 200
    elif courier and courier.check_password(data['password']):
        return jsonify({'message': 'Logged in successfully', 'role': 'courier'}), 200
    elif admin and admin.check_password(data['password']):
        return jsonify({'message': 'Logged in successfully', 'role': 'admin'}), 200
    else:
        return jsonify({'message': 'Incorrect email or password, please try again'}), 404



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
    data = request.get_json() 
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400

    user = db.session.get(UserModel, user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    orders = OrderModel.query.filter_by(user_id=user_id).all()
    return jsonify([order.json() for order in orders]), 200

@app.route('/users/order', methods=['GET'])
def get_order():
    data = request.get_json() 
    user_id = data.get('user_id')
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


    #Couruier features

#get Courier orders
@app.route('/CourieOrder', methods=['GET'])
def get_Courier_orders():
    orders = OrderModel.query.all()
    courier_id = request.args.get('courier_id',type=int)
    if not courier_id:
        return jsonify({'message': 'Bad request , Please enter a correct ID for the courier'}), 400
    courier = db.session.get(CourierModel,courier_id)
    if not courier:
        return jsonify({'message': 'Courier ID not found'}), 404
    assigned_Order = []
    for order in orders:
        if order.courier is courier:
         assigned_Order.append(order)
    if not assigned_Order:
        return  jsonify({'message': 'No assigned orders'}), 200  
    return jsonify([order.json() for order in assigned_Order]), 200

# Accept Order
@app.route('/acceptOrder', methods=['PUT'])
def accept_order():
    data = request.get_json() 
    order_id = data.get('order_id')
    order = OrderModel.query.get(order_id)
    order.status = 'picked up'
    db.session.commit()
    return jsonify({'message': 'Order is accepted successfully'}),200

# Decline Order
@app.route('/DeclineOrder', methods=['PUT'])
def decline_order():
    data = request.get_json() 
    order_id = data.get('order_id')
    order = OrderModel.query.get(order_id)
    order.courier = None
    db.session.commit()
    return jsonify({'message': 'Order is declined successfully'}),200

    

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)