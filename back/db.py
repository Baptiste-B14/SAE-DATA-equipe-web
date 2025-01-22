import flask
import psycopg2
from psycopg2.extras import RealDictCursor
import os

def getdb():
    """
    Ouvre une connexion à la base de données PostgreSQL si elle n'existe pas déjà dans le contexte Flask.
    """
    if 'db' not in flask.g:
        try:
            # Configuration de la connexion PostgreSQL
            app = flask.current_app
            db_config = {
                'dbname': app.config['DB_DATABASE'],
                'user': app.config['DB_USER'],
                'password': app.config['DB_PASSWORD'],
                'host': app.config['DB_HOST'],
                'port': 5432
            }
            # Connexion à la base PostgreSQL
            flask.g.db = psycopg2.connect(**db_config, cursor_factory=RealDictCursor)
        except Exception as e:
            print(f"Erreur de connexion PostgreSQL : {e}")
    return flask.g.db

def query(query_string, fetchall=True, params=None):
    """
    Exécute une requête SQL sur la base PostgreSQL.

    :param query_string: La requête SQL à exécuter.
    :param fetchall: Si True, récupère tous les résultats ; sinon, un seul.
    :param params: Les paramètres pour les requêtes paramétrées (ex. : WHERE).
    :return: Les résultats sous forme de dictionnaire(s).
    """
    params = params or ()
    try:
        cnx = getdb()
        with cnx.cursor() as cursor:
            cursor.execute(query_string, params)
            if fetchall:
                return cursor.fetchall()  # Liste de dictionnaires
            else:
                return cursor.fetchone()  # Un seul dictionnaire
    except Exception as e:
        print(f"Erreur lors de l'exécution de la requête : {e}")
        return None

def close_db(e=None):
    """
    Ferme la connexion à la base PostgreSQL si elle existe.
    """
    db = flask.g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    """
    Associe les fonctions de gestion de la base à l'application Flask.

    À appeler lors de l'initialisation de l'application.
    """
    app.teardown_appcontext(close_db)