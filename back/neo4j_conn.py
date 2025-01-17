from neo4j import GraphDatabase
import re
from flask import jsonify

# Remplacez ces valeurs par vos informations de connexion
URI = "bolt://api.lliger.fr"  # Adresse de votre instance Neo4j
USERNAME = "neo4j"             # Nom d'utilisateur
PASSWORD = "motdepasse"          # Mot de passe

# Initialiser la connexion au driver Neo4j
driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD), database="neo4j")

# Fonction pour exécuter une requête
def execute_query(query, parameters=None):
    with driver.session() as session:
        result = session.run(query, parameters)
        return [record.data() for record in result]
