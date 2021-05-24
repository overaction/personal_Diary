from flask import Flask, json,request,jsonify
from flask_pymongo import PyMongo,ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config["MONGO_URI"] = 'mongodb+srv://dbUser:sik06256!@cluster0.qxe5r.mongodb.net/diary?retryWrites=true&w=majority'
mongo = PyMongo(app)

CORS(app)

db = mongo.db.users

@app.route('/users', methods=['POST'])
def createUser():
    id = db.insert({
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    })
    return jsonify(str(ObjectId(id)))

@app.route('/users', methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(users)
    
@app.route('/user/<id>', methods=['GET'])
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)})
    print(user)
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password']
    })

@app.route('/users/<id>', methods=['DELETE'])
def deleteUser(id):
    db.delete_one({'id': ObjectId(id)})
    return jsonify({'message': 'User deleted'})

@app.route('/users/<id>', methods=['PUT'])
def updateUser(id):
    db.update_one({'_id':ObjectId(id)}, {'$set': {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    }})
    return jsonify({'message': 'User updated'})

if __name__ == '__main__':
    app.run(debug=True)
    
