import flask
import flask_cors
from neo4j_conn import execute_query


from dotenv import dotenv_values
from db import getdb, close_db, query

config = dotenv_values('.env')

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['DB_HOST'] = config['DB_HOST']
app.config['DB_USER'] = config['DB_USER']
app.config['DB_PASSWORD'] = config['DB_PWD']
app.config['DB_DATABASE'] = config['DB_NAME']
app.teardown_appcontext(close_db)

flask_cors.CORS(app, resources={
    r"/*":
        {
            "origins": ["*"],
            "methods": ["GET", "POST"]
        }
})


@app.route('/neo4j', methods=['GET'])
def get_all():
    answer = execute_query("MATCH (n) RETURN n")
    return {"message": "Réponse de neo4j", "test": answer}, 200


@app.route('/')
def home():
    answer = query("SELECT type, count(type) FROM records WHERE type='book' GROUP BY type;", False)
    return {"message": "Bonjour Monde !", "test": answer}, 200


app.run()
