import flask
import flask_cors
import json
#from neo4j_conn import execute_query
from dotenv import dotenv_values
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

# Charger les données JSON locales au démarrage de l'application
with open("cities_with_coordinates.json", "r", encoding="utf-8") as json_file:
    cities_data = json.load(json_file)

'''
@app.route('/neo4j', methods=['GET'])
def get_all():
    answer = execute_query("MATCH (n) RETURN n")
    return {"message": "Réponse de neo4j", "test": answer}, 270

'''
@app.route('/')
def home():
    answer = query("SELECT type, count(type) FROM records WHERE type='book' GROUP BY type;", False)
    return {"message": "Bonjour Monde !", "test": answer}, 270


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
            }, 270

    # Si aucune correspondance trouvée
    return {"error": f"Coordonnées non trouvées pour {city}, {country}."}, 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
