from flask import request, jsonify
from config import app, db
from model import UserModel


@app.route('/users/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if UserModel.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    if UserModel.query.filter_by(phone=data['phone']).first():
        return jsonify({'message': 'Phone number already exists'}), 400
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
    return jsonify({'message': 'Wrong email or password'}), 401  # Change to 401 for wrong password

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)