
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
    