import os
from datetime import datetime

import time

import requests
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("submit vote")
def vote(data):
    selection = data["selection"]
    message = f"{selection}, {datetime.now()}"

    print(f"******************{message}******************")

    # emit message to all clients
    emit("announce vote", { "selection": message }, broadcast=True)


@app.route("/spa")
def single_page_app():
    return render_template('spa.html')


@app.route("/window")
def window():
    return render_template("window.html")

@app.route("/api/first")
def first():
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

@app.route("/api/second")
def second():
    return "Pulvinar mattis nunc sed blandit libero volutpat sed cras. Eget egestas purus viverra accumsan in nisl nisi. Nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit. Ullamcorper a lacus vestibulum sed arcu non odio. Id semper risus in hendrerit gravida rutrum quisque non. Volutpat est velit egestas dui id ornare arcu odio. Donec enim diam vulputate ut pharetra sit amet aliquam id. Volutpat ac tincidunt vitae semper. Feugiat pretium nibh ipsum consequat. Lectus sit amet est placerat in egestas. Faucibus nisl tincidunt eget nullam. Cras pulvinar mattis nunc sed blandit libero volutpat sed. In hac habitasse platea dictumst vestibulum rhoncus. Justo laoreet sit amet cursus sit amet dictum sit amet. Imperdiet proin fermentum leo vel orci porta non pulvinar neque. In eu mi bibendum neque egestas. Pellentesque habitant morbi tristique senectus et netus et malesuada fames."

@app.route("/api/third")
def third():
    return "Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium. Ipsum consequat nisl vel pretium lectus quam id leo in. In hac habitasse platea dictumst quisque sagittis."


@app.route("/posts")
def posts():
    return render_template("post.html")

@app.route("/api/posts")
def api_posts():
    start = int(request.args.get('start') or 0)
    size = int(request.args.get('size') or 10)

    if start < 0:
        start = 0
    
    if size < 0: 
        size = 10
    
    size = min(size, 10)

    data = [];

    for i in range(start, start + size + 1):
        data.append(f"Post #{i}")

    time.sleep(1)

    return jsonify(data)

@app.route("/dice")
def dice(): 
    return render_template("dice0.html")

@app.route("/animate")
def animate():
    return render_template("animate0.html")

if __name__ == '__main__':
    socketio.run(app)