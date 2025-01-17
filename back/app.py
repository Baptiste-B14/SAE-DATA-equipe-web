from flask import Flask, request
import flask
import flask_cors
import csv
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
    with open('tendances_mots_par_annees_toutes_les_donnees_sans_les_2_occ.json', 'r') as file:
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


@app.route('/neo4j')
def get_collaboration():
    with open('neo4jCollab.txt', 'r') as file:
        data = json.load(file)
        print(data)
        return data


@app.route('/pub_in_time')
def get_publi_in_time():
    with open('./SqlLocal/Nombre_publications_année_periode.xlsx - Result 1.json') as file:
        data = json.load(file)
        return data


@app.route('/collab_in_time')
def get_collab_in_time():
    with open('./SqlLocal/Nombre_collaborations_année_periode.xlsx - Result 1.json') as file:
        data = json.load(file)
        print(data)
        return data

with open("cities_with_coordinates.json", "r", encoding="utf-8") as json_file:
    cities_data = json.load(json_file)


@app.route('/coordinates', methods=['GET'])
def get_coordinates():
    """
    Récupère la latitude et la longitude d'une ville.
    Exemple : /coordinates?city=Munich&country=Germany
    """
    city = flask.request.args.get('city', '').strip()
    country = flask.request.args.get('country', '').strip()

    if not city or not country:
        return {"error": "Veuillez fournir 'city' et 'country' comme paramètres."}, 400

    # Rechercher dans les données JSON locales
    for record in cities_data:
        if record['City'].lower() == city.lower() and record['Country'].lower() == country.lower():
            return {
                "City": record['City'],
                "Country": record['Country'],
                "Latitude": record['Latitude'],
                "Longitude": record['Longitude']
            }, 200

    # Si aucune correspondance trouvée
    return {"error": f"Coordonnées non trouvées pour {city}, {country}."}, 404




def csv_to_json():

    try:

        with open('./SqlLocal/Nb_collaborations_par_categorie.xlsx - Result 1.csv', mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)

            data = [row for row in csv_reader]

        with open('./SqlLocal/Nb_collaborations_par_categorie.xlsx - Result 1.json', mode='w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=4, ensure_ascii=False)

        print(f"Conversion réussie ! Fichier JSON enregistré")
    except Exception as e:
        print(f"Erreur lors de la conversion : {e}")





