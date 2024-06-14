from flask import Flask, render_template, request, jsonify
import json
import random

app = Flask(__name__)

with open('static/responses.json') as f:
    responses = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')
    response, suggestion_list = chatbot_response(user_input)
    return jsonify(response=response, suggestions=suggestion_list)

def chatbot_response(user_input):
    response = responses.get(user_input.lower())
    if response:
        return response, []
    else:
        suggestions = random.sample(list(responses.keys()), 5)
        return "I'm not sure how to respond to that. Here are some things you can ask me:", suggestions

if __name__ == '__main__':
    app.run(debug=True)
