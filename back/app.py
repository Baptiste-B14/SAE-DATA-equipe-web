import flask
import flask_cors
from flask import request

from neo4j_conn import execute_query


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

@app.route('/top_collab', methods=['GET'])
def top_collab() :
    period = request.args.get('period', default='all_time', type=str)
    limit = request.args.get('limit', default=50, type=int)
    answer = None
    if period == "all_time":
        answer = execute_query("MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) return a.person_name, count(r2) AS count ORDER BY count DESC LIMIT" + str(limit))
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

    return {"message" : answer}, 200

@app.route('/execute')
def execute():
    answer = execute_query(request.args.get('query', default="MATCH(n) RETURN COUNT(n), labels(n)", type=str))
    return {'message' : answer}, 200

@app.route('/graph_collab', methods=['GET'])
def graph_collab():
    answer = execute_query("MATCH (a:Person)-[r]->(p:Publication)<-[r2]-(b:Person) WHERE a <> b AND id(a) < id(b) WITH p, a, b, p.year AS annee RETURN a.nom, b.nom, annee")
    nodes = []
    links = []
    for line in answer :
        nodes.append({'id': line['a.nom']})
        links.append({'source': line['a.nom'], 'target': line['b.nom'],})
    return {"nodes" : nodes, "links": links}, 200


if __name__ =='__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
