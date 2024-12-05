import flask
import flask_cors

app = flask.Flask(__name__)
app.config["DEBUG"] = True
flask_cors.CORS(app, resources={
    r"/*":
        {
            "origins": ["*"],
            "methods": ["GET", "POST"]
        }
})


@app.route('/')
def home():
    return {"message": "Bonjour Monde !"}, 200

app.run()