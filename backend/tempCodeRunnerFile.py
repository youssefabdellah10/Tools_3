from flask import request, jsonify
from config import app, db
from model import UserModel


@app.route('/users/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if UserModel.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    new_user = UserModel(name=data['name'], email=data['email'], password=data['password'])
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
    if user and user.password == data['password']:   
        return jsonify(user.json()), 200
    return jsonify({'message': 'Wrong email or password'}), 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)