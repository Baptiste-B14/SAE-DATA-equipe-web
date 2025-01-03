from neo4j import GraphDatabase
from flask import jsonify

# Remplacez ces valeurs par vos informations de connexion
URI = "bolt://192.168.1.5:7687"  # Adresse de votre instance Neo4j
USERNAME = "pantone44c"             # Nom d'utilisateur
PASSWORD = "motdepasse2"          # Mot de passe

# Initialiser la connexion au driver Neo4j
driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))

# Fonction pour exécuter une requête
def execute_query(query, parameters=None):
    with driver.session() as session:
        result = session.run(query, parameters)
        return [record.data() for record in result]
