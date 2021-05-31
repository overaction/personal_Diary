from flask import Flask, json,request,jsonify
from flask.helpers import url_for
from flask_pymongo import PyMongo,ObjectId
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config["MONGO_URI"] = 'mongodb+srv://dbUser:sik06256!@cluster0.qxe5r.mongodb.net/diary?retryWrites=true&w=majority'
mongo = PyMongo(app)

CORS(app)

db = mongo.db.users
posts = mongo.db.posts

# 유저 생성
@app.route('/users', methods=['POST'])
async def createUser():
    errors = {}
    username = request.json['username']
    password = request.json['password']
    confirmPassword = request.json['confirmPassword']

    # 에러검출
    if username.strip() == '':
        errors['username'] = "Username is empty"
    if password.strip() == '':
        errors['password'] = "Password is empty"
    elif password != confirmPassword:
        errors['confirmPassword'] = "Passwords must match"
    
    if len(errors.keys()):
        return errors

    user = db.find_one({"username": username})
    if user:
        errors['exist'] = "Username already exists"
        return errors
    db.insert({
        'username': request.json['username'],
        'password': request.json['password']
    })
    return {"success": "user created"}

# 로그인
@app.route('/users/login', methods=['POST'])
async def loginUser():
    errors = {}
    username = request.json['username']
    password = request.json['password']

    # 에러검출
    if username.strip() == '':
        errors['username'] = "Username is empty"
    if password.strip() == '':
        errors['password'] = "Password is empty"
    
    if len(errors.keys()):
        return errors

    user = db.find_one({"username": username})
    if user['password'] == password:
        return {"success": "user login successfully"}
    else:
        return {
            'password' : "Password does not match"
        }

# 포스트생성
@app.route('/createpost', methods=['POST'])
def createpost():
    username = request.form['username']
    text = request.form['text']
    images = []
    if 'image1' in request.files:
        for img in request.files:
            image = request.files[img]
            images.append(image.filename)
            mongo.save_file(image.filename,image)
    posts.insert({
            'username':username,
            'text':text,
            'images':images,
            'date': str(datetime.now())
        })  
    return jsonify({'message': 'post created'})

# 포스트 업데이트
@app.route('/<postId>', methods=['PUT'])
def updateUser(postId):
    text = request.form['text']
    clear = request.form['clear']
    images = []
    if 'image1' in request.files:
        for img in request.files:
            image = request.files[img]
            images.append(image.filename)
            mongo.save_file(image.filename,image)
        posts.update_one({'_id':ObjectId(postId)}, {'$set': {
            'text': text,
            'images': images,
            'date': str(datetime.now())
        }})
    elif clear == 'false':
        posts.update_one({'_id':ObjectId(postId)}, {'$set': {
            'text': text,
            'date': str(datetime.now())
        }})
    else:
        posts.update_one({'_id':ObjectId(postId)}, {'$set': {
            'text': text,
            'images': [],
            'date': str(datetime.now())
        }})
    return jsonify({'message': 'post updated'})


# 이미지
@app.route('/file/<filename>')
def file(filename):
    return mongo.send_file(filename)

# 유저의 포스트
@app.route('/<username>', methods=['GET'])
def showDiary(username):
    postsData = []
    myPosts = posts.find({'username': username}).sort("date",-1)
    for post in myPosts:
        images = []
        for image in post.get('images'):
            images.append('http://localhost:5000/file/'+image)
        postsData.append({
            '_id': str(ObjectId(post['_id'])),
            'username': post['username'],
            'text': post['text'],
            'images': images,
            'date': post['date']
        })
    return jsonify(postsData)

# 포스트 삭제
@app.route('/<postId>', methods=['DELETE'])
def deleteUser(postId):
    posts.delete_one({'_id': ObjectId(postId)})
    return jsonify({'message': 'post Deleted'})


# 유저들 정보
@app.route('/users', methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'username': doc['username'],
            'password': doc['password']
        })
    return jsonify(users)

# 유저 정보   
@app.route('/user/<id>', methods=['GET'])
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)})
    print(user)
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'username': user['username'],
        'password': user['password']
    })

if __name__ == '__main__':
    app.run(debug=True)
    
