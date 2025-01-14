from flask import Flask, request
import flask
import flask_cors
#from neo4j_conn import execute_query
import json



from dotenv import dotenv_values
from flask import jsonify

from db import getdb, close_db, query

config = dotenv_values('.env')

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['FLASK_RUN_HOST'] = '0.0.0.0'
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

'''
@app.route('/neo4j', methods=['GET'])
def get_all():
    answer = execute_query("MATCH (n) RETURN n")
    return {"message": "Réponse de neo4j", "test": answer}, 200
'''

@app.route('/')
def home():
    answer = query("SELECT type, count(type) FROM records WHERE type='book' GROUP BY type;", False)
    return {"message": "Bonjour Monde !", "test": answer}, 200

if __name__ =='__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


@app.route('/analyses/wordcloud/<year>')
def get_word_cloud_year(year):
    file = open('tendances_mots_par_annees_top_500.json')
    data = json.load(file)
    limited_words = dict(list(data[year].items())[:20])
    return jsonify(limited_words)



@app.route('/analyses/wordchart', methods=['GET'])
def get_word_chart():
    # Charger les données depuis le fichier JSON
    with open('tendances_mots_par_annees_sans_2_occ.json', 'r') as file:
        data = json.load(file)

    # Récupérer les mots à tracer depuis les paramètres de la requête
    words_to_plot = request.args.getlist('words')

    if not words_to_plot:
        return jsonify({"error": "No words provided"}), 400

    years = sorted(data.keys())
    results = {
        "years": years,
        "data": {word: [data[year].get(word, 0) for year in years] for word in words_to_plot}
    }
    print(results)
    return jsonify(results)


