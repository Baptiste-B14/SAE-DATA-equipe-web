import flask
import flask_cors
from flask import request
from neo4j_conn import execute_query
import json, csv


from dotenv import dotenv_values
from flask import jsonify

from db import close_db, query


config = dotenv_values('.env')

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# Configuration CORS plus permissive
cors = flask_cors.CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:4200"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.config['FLASK_RUN_HOST'] = '0.0.0.0'
app.config['DB_HOST'] = config['DB_HOST']
app.config['DB_USER'] = config['DB_USER']
app.config['DB_PASSWORD'] = config['DB_PWD']
app.config['DB_DATABASE'] = config['DB_NAME']
app.teardown_appcontext(close_db)


@app.route('/top_collab', methods=['GET'])
def top_collab():
    period = request.args.get('period', default='all_time', type=str)
    limit = request.args.get('limit', default=10, type=int)
    file = ""
    if period == "all_time":
        file = open('SqlLocal/top_collaborateur_all_time.json')

    elif period == "before":
        file = open('SqlLocal/top_collaborateur_before.json')

    elif period == "during":
        file = open('SqlLocal/top_collaborateur_during.json')

    elif period == "after":
        file = open('SqlLocal/top_collaborateur_after.json')

    elif period == "fixed":
        year = request.args.get('year', default=2024, type=int)
        answer =execute_query("MATCH(a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) AND p.year=" + str(year) + " RETURN a.person_name, count(r2) AS count ORDER BY count DESC LIMIT " + str(limit))

    data = json.load(file)
    return {"message" : data}, 270

@app.route('/execute')
def execute():
    answer = execute_query(request.args.get('query', default="MATCH(n) RETURN COUNT(n), labels(n)", type=str))
    return {'message' : answer}, 270

@app.route('/graph_collab', methods=['GET'])
def graph_collab():
    answer = execute_query("MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) WITH p, a, b, p.year AS annee RETURN a.nom, b.nom, annee")
    nodes = []
    links = []
    for line in answer :
        nodes.append({'id': line['a.nom']})
        links.append({'source': line['a.nom'], 'target': line['b.nom'],})
    return {"nodes" : nodes, "links": links}, 270


@app.route('/analyses/wordcloud/<year>')
def get_word_cloud_year(year):
    try:
        file_path = 'SqlLocal/tendances_mots_par_annees_top_500.json'
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                
                # Convertir year en string car les clés JSON sont toujours des strings
                year_str = str(year)
                
                if year_str not in data:
                    return jsonify({"error": f"No data available for year {year}"}), 404
                    
                # Limiter à 50 mots et trier par fréquence
                year_data = data[year_str]
                sorted_words = dict(sorted(year_data.items(), key=lambda x: x[1], reverse=True)[:50])
                
                return jsonify(sorted_words)
                
        except FileNotFoundError:
            return jsonify({"error": f"Data file not found: {file_path}"}), 500
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON format in data file"}), 500
            
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route('/analyses/wordchart', methods=['GET'])
def get_word_chart():
    with open('SqlLocal/tendances_mots_par_annees_toutes_les_donnees_sans_les_2_occ.json', 'r') as file:
        data = json.load(file)

    words_to_plot = request.args.getlist('words')

    if not words_to_plot:
        return jsonify({"error": "No words provided"}), 400

    years = sorted(data.keys())
    results = {
        "years": years,
        "data": {word: [data[year].get(word, 0) for year in years] for word in words_to_plot}
    }
    return jsonify(results)


@app.route('/neo4j')
def get_collaboration():
    with open('neo4jCollab.txt', 'r') as file:
        data = json.load(file)
        return data


@app.route('/pub_in_time', methods=['GET'])
def get_publi_in_time():
    try:
        file = open('SqlLocal/Pub_in_time.json')
        data = json.load(file)
        file.close()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/collab_by_categ', methods=['GET'])
def get_collab_by_categ():

    file = open('SqlLocal/Collab_by_categ.json')
    data = json.load(file)
    return {"message" : data}, 270


@app.route('/collab_in_time', methods=['GET'])
def get_collab_in_time():
    file = open('SqlLocal/Collab_in_time.json')
    data = json.load(file)
    return {"message" : data}, 270


@app.route('/graph_commu', methods=['GET'])
def get_graph_collab():
    nodes = request.args.get('nodes', default='avant', type=str) if request.args.get('nodes') != "undefined" else 'avant'
    period = request.args.get('period', default='avant', type=str) if request.args.get('period') != "undefined" else 'avant'

    nodes_path = None
    links_path = None

    if nodes == "avant":
        nodes_path = 'SqlLocal/commu/nodes-avant.json'
        if period == "avant":
            links_path = 'SqlLocal/commu/avant-avant.json'
        elif period == "pendant":
            links_path = 'SqlLocal/commu/avant-pendant.json'
        elif period == "apres":
            links_path = 'SqlLocal/commu/avant-apres.json'

    elif nodes == "pendant":
        nodes_path = 'SqlLocal/commu/nodes-pendant.json'
        if period == "avant":
            links_path = 'SqlLocal/commu/pendant-avant.json'
        elif period == "pendant":
            links_path = 'SqlLocal/commu/pendant-pendant.json'
        elif period == "apres":
            links_path = 'SqlLocal/commu/pendant-apres.json'

    elif nodes == "apres":
        nodes_path = 'SqlLocal/commu/nodes-apres.json'
        if period == "pendant":
            links_path = 'SqlLocal/commu/apres-pendant.json'
        elif period == "apres":
            links_path = 'SqlLocal/commu/apres-apres.json'


    try:
        with open(nodes_path, 'r') as nf, open(links_path, 'r') as lf:
            nodes_data = json.load(nf)
            links_data = json.load(lf)

            combined_data = {
                "links": links_data.get("links", []),
                "nodes": nodes_data.get("nodes", [])
            }


        return jsonify({"message": combined_data}), 270
    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route('/collab_seules_vs_collab')
def get_collab_seules_vs_collab():
    file = open('SqlLocal/Nb_collab_seules_vs_nb_collab_coll.json')
    data = json.load(file)
    return {"message": data}, 270


@app.route('/page_in_time')
def get_page_in_time():
    file = open('SqlLocal/Pages_in_time.json')
    data = json.load(file)
    return {"message": data}, 270


@app.route('/first_collab', methods=['GET'])
def get_first_collab():
    period = request.args.get('period', default='none', type=str)
    file = open('SqlLocal/Nb_premiere_collab_in_periode.json')
    data = json.load(file)
    return {"message": data}, 270


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

    return {"error": f"Coordonnées non trouvées pour {city}, {country}."}, 404


#TEST POUR PAGE RECHERCHE
@app.route('/search', methods=['POST'])
def dynamic_query():
    try:
        data = request.json
        filters = data.get('filters', [])
        table_name = filters[0]['table']  # Get table name from request
        print(filters[0]['table'])

        # Validate table exists (PostgreSQL syntax)
        sql_check_table = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name = %s
        """
        table_exists = query(sql_check_table, params=(table_name,))
        # Check if table_exists has any results
        if not table_exists or len(table_exists) == 0:
            return jsonify({
                "error": f"Invalid table name: {table_name}",
                "message": "Table does not exist in the database"
            }), 400

        # Get valid columns for the table (PostgreSQL syntax)
        sql_columns = """
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = %s
            ORDER BY ordinal_position
        """
        columns_result = query(sql_columns, params=(table_name,))
        if not columns_result:
            return jsonify({
                "error": "Failed to fetch columns",
                "message": f"Could not retrieve columns for table {table_name}"
            }), 500

        valid_columns = [dict(row)['column_name'] for row in columns_result]
        if not valid_columns:
            return jsonify({
                "error": "No columns found",
                "message": f"No columns found in table {table_name}"
            }), 500

        # Construction of the dynamic query
        where_clauses = []
        params = []  # Pour les paramètres de la requête

        for f in filters:
            column = f.get('column')
            operator = f.get('operator')
            value = f.get('value')

            # Skip empty filters
            if not column or not operator or value is None or value == '':
                continue

            # Validate column exists in table
            if column not in valid_columns:
                return jsonify({
                    "error": f"Invalid column: {column}",
                    "valid_columns": valid_columns,
                    "message": f"Column does not exist in table {table_name}"
                }), 400

            # Use %s instead of ? for PostgreSQL
            if operator == "EQUALS":
                where_clauses.append(f"\"{column}\" = %s")
                params.append(value)
            elif operator == "LIKE":
                where_clauses.append(f"\"{column}\" ILIKE %s")  # ILIKE for case-insensitive search
                params.append(f"%{value}%")
            elif operator == "GT":
                where_clauses.append(f"\"{column}\" > %s")
                params.append(value)
            elif operator == "LT":
                where_clauses.append(f"\"{column}\" < %s")
                params.append(value)
            elif operator == "GTE":
                where_clauses.append(f"\"{column}\" >= %s")
                params.append(value)
            elif operator == "LTE":
                where_clauses.append(f"\"{column}\" <= %s")
                params.append(value)

        # Construction of the final SQL query
        sql_query = f"SELECT * FROM \"{table_name}\""
        if where_clauses:
            sql_query += f" WHERE {' AND '.join(where_clauses)}"

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
        return jsonify({
            "error": "Search error",
            "message": str(e)
        }), 500

@app.route('/tables', methods=['GET'])
def get_tables():
    try:
        # Query to get all table names from PostgreSQL
        sql = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        """
        results = query(sql)

        if results is None:
            return jsonify({"error": "Failed to fetch tables"}), 500

        tables = [dict(row)['table_name'] for row in results]
        return jsonify(tables)

    except Exception as e:
        print(f"Error fetching tables: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/columns/<table_name>', methods=['GET'])
def get_columns(table_name):
    try:
        # Query to get column names from PostgreSQL
        sql = """
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = %s
        """
        results = query(sql, params=(table_name,))

        if results is None:
            return jsonify({"error": "Failed to fetch columns"}), 500

        columns = [dict(row)['column_name'] for row in results]
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
    app.run(host='0.0.0.0', port=5001, debug=True)