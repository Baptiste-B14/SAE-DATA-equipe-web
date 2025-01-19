from flask import Flask, request
import flask
import flask_cors
from flask import request

from neo4j_conn import execute_query
import json, csv
from flask_caching import Cache


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


app.config['CACHE_TYPE'] = 'RedisCache'
app.config['CACHE_REDIS_HOST'] = 'localhost'  # Vérifiez si Redis fonctionne localement
app.config['CACHE_REDIS_PORT'] = 6379         # Assurez-vous que le port est correct
app.config['CACHE_DEFAULT_TIMEOUT'] = None
cache = Cache(app)

flask_cors.CORS(app, resources={
    r"/*":
        {
            "origins": ["*"],
            "methods": ["GET", "POST"]
        }
})

@app.route('/top_collab', methods=['GET'])
@cache.cached(query_string=True)
def top_collab():
    period = request.args.get('period', default='all_time', type=str)
    limit = request.args.get('limit', default=50, type=int)
    answer = None
    if period == "all_time":
        answer = execute_query("MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) return a.person_name, count(r2) AS count ORDER BY count DESC LIMIT " + str(limit))
    elif period == "before":
        answer = execute_query(
            "MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) AND p.year > 2015 AND p.year < 2019 return a.person_name, count(r2) AS count ORDER BY count DESC LIMIT " + str(limit))
    elif period == "during":
        answer = execute_query(
            "MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) AND p.year > 2018 AND p.year < 2023 return a.person_name, count(r2) AS count ORDER BY count DESC LIMIT " + str(
                limit))
    elif period == "after":
        answer = execute_query(
            "MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) AND p.year > 2022 return a.person_name, count(r2) AS count ORDER BY count DESC LIMIT " + str(
                limit))
    elif period == "fixed":
        year = request.args.get('year', default=2024, type=int)
        answer =execute_query("MATCH(a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) AND p.year=" + str(year) + " RETURN a.person_name, count(r2) AS count ORDER BY count DESC LIMIT " + str(limit))
    return {"message" : answer}, 200

@app.route('/execute')
@cache.cached(query_string=True)
def execute():
    answer = execute_query(request.args.get('query', default="MATCH(n) RETURN COUNT(n), labels(n)", type=str))
    return {'message' : answer}, 200

@app.route('/graph_collab', methods=['GET'])
@cache.cached(query_string=True)
def graph_collab():
    answer = execute_query("MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) WITH p, a, b, p.year AS annee RETURN a.nom, b.nom, annee")
    nodes = []
    links = []
    for line in answer :
        nodes.append({'id': line['a.nom']})
        links.append({'source': line['a.nom'], 'target': line['b.nom'],})
    return {"nodes" : nodes, "links": links}, 200



@app.route('/analyses/wordcloud/<year>')
@cache.cached(query_string=True)
def get_word_cloud_year(year):
    file = open('tendances_mots_par_annees_top_500.json')
    data = json.load(file)
    limited_words = dict(list(data[year].items())[:20])
    return jsonify(limited_words)



@app.route('/analyses/wordchart', methods=['GET'])
@cache.cached(query_string=True)
def get_word_chart():
    with open('tendances_mots_par_annees_toutes_les_donnees_sans_les_2_occ.json', 'r') as file:
        data = json.load(file)

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
@cache.cached(query_string=True)
def get_collaboration():
    with open('neo4jCollab.txt', 'r') as file:
        data = json.load(file)
        print(data)
        return data


@app.route('/pub_in_time')
@cache.cached(query_string=True)
def get_publi_in_time():
    requete = """
        SELECT
            Year AS annee,
            COUNT(*) AS nombre_publications
        FROM
            Publication
        GROUP BY
            Year
        ORDER BY
            Year ASC;
    """

    data = query(requete)
    if not data:
        return jsonify({"error": "Aucune donnée trouvée"}), 404

    return jsonify([dict(row) for row in data])


#temps execution : 3min environ
@app.route('/collab_by_categ')
@cache.cached(query_string=True)
def get_collab_by_categ():

    requete = """
        SELECT 
            category_name AS Categorie, COUNT(*) AS nb_collaborations 
        FROM 
            Collaboration collab INNER JOIN Publication pub ON collab.publication_id = pub.key INNER JOIN Category cate ON pub.category_id = cate.category_id
        GROUP BY 
            category_name
    """
    data = query(requete)


    if not data:
        return jsonify({"error": "Aucune donnée trouvée"}), 404

    return jsonify([dict(row) for row in data])


#temps execution : 3min environ
@app.route('/collab_in_time')
@cache.cached(query_string=True)
def get_collab_in_time():
    requete = """
        SELECT COUNT(*) AS nb_collaborations, pu.year AS annee, pe.label AS periode
FROM Collaboration c
INNER JOIN Publication pu ON c.publication_id = pu.key
INNER JOIN period pe on pe.period_id = pu.period_id
GROUP BY pu.year, pe.label
    """
    data = query(requete)

    if not data:
        return jsonify({"error": "Aucune donnée trouvée"}), 404

    return jsonify([dict(row) for row in data])


with open("cities_with_coordinates.json", "r", encoding="utf-8") as json_file:
    cities_data = json.load(json_file)


@app.route('/coordinates', methods=['GET'])
@cache.cached(query_string=True)
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

    return {"error": f"Coordonnées non trouvées pour {city}, {country}."}, 404


#TEST POUR PAGE RECHERCHE
@app.route('/search', methods=['POST'])
def dynamic_query():
    try:
        filters = request.json.get('filters', [])

        # Construction dynamique de la requête SQL
        where_clauses = []
        params = []  # Pour les paramètres de la requête

        for f in filters:
            column = f.get('column')
            operator = f.get('operator')
            value = f.get('value')

            # Protection contre l'injection SQL
            if column and operator and value is not None:
                if operator == "EQUALS":
                    where_clauses.append(f"{column} = ?")
                    params.append(value)
                elif operator == "LIKE":
                    where_clauses.append(f"{column} LIKE ?")
                    params.append(f"%{value}%")
                elif operator == "GT":
                    where_clauses.append(f"{column} > ?")
                    params.append(value)
                elif operator == "LT":
                    where_clauses.append(f"{column} < ?")
                    params.append(value)
                elif operator == "GTE":
                    where_clauses.append(f"{column} >= ?")
                    params.append(value)
                elif operator == "LTE":
                    where_clauses.append(f"{column} <= ?")
                    params.append(value)

        # Construction de la requête SQL finale
        where_clause = " AND ".join(where_clauses)
        sql_query = f"SELECT * FROM Publication WHERE {where_clause}" if where_clauses else "SELECT * FROM Publication"

        # Utilisation de votre fonction query pour exécuter la requête
        results = query(sql_query, params=tuple(params))

        if results is None:
            return jsonify({"error": "Database query failed"}), 500

        # Conversion des résultats en liste de dictionnaires
        data = []
        for row in results:
            data.append(dict(row))

        return jsonify(data)

    except Exception as e:
        print(f"Error in dynamic_query: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/tables', methods=['GET'])
def get_tables():
    try:
        # Query to get all table names from SQLite
        sql = """
            SELECT name 
            FROM sqlite_master 
            WHERE type='table' 
            AND name NOT LIKE 'sqlite_%'
        """
        results = query(sql)

        if results is None:
            return jsonify({"error": "Failed to fetch tables"}), 500

        tables = [dict(row)['name'] for row in results]
        return jsonify(tables)

    except Exception as e:
        print(f"Error fetching tables: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/columns/<table_name>', methods=['GET'])
def get_columns(table_name):
    try:
        # Query to get column names from the specified table
        sql = f"PRAGMA table_info({table_name})"
        results = query(sql)

        if results is None:
            return jsonify({"error": "Failed to fetch columns"}), 500

        # Extract column names from the PRAGMA results
        columns = [dict(row)['name'] for row in results]
        return jsonify(columns)

    except Exception as e:
        print(f"Error fetching columns: {e}")
        return jsonify({"error": str(e)}), 500


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



if __name__ =='__main__':

    app.run(host='0.0.0.0', port=5000, debug=True)