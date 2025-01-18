import flask
import sqlite3
import os

def getdb():
    """Ouvre une connexion à la base de données SQLite si elle n'existe pas déjà dans le contexte Flask."""
    if 'db' not in flask.g:
        try:
            # Construire le chemin absolu vers la base SQLite
            db_path = os.path.join(flask.current_app.root_path, 'Sqlite/base.sqlite')
            print(os.path)
            flask.g.db = sqlite3.connect(
                db_path,
                detect_types=sqlite3.PARSE_DECLTYPES
            )
            # Permet d'utiliser des résultats sous forme de dictionnaires
            flask.g.db.row_factory = sqlite3.Row
        except Exception as e:
            print(f"Erreur de connexion SQLite : {e}")
    return flask.g.db

def query(query_string, fetchall=True, params=None):
    """
    Exécute une requête SQL sur la base SQLite.

    :param query_string: La requête SQL à exécuter.
    :param fetchall: Si True, récupère tous les résultats ; sinon, un seul.
    :param params: Les paramètres pour les requêtes paramétrées (ex. : WHERE).
    :return: Les résultats sous forme de dictionnaire(s).
    """
    params = params or ()
    try:
        cnx = getdb()
        cursor = cnx.execute(query_string, params)
        if fetchall:
            return cursor.fetchall()
        else:
            return cursor.fetchone()
    except Exception as e:
        print(f"Erreur lors de l'exécution de la requête : {e}")
        return None

def close_db(e=None):
    """Ferme la connexion à la base SQLite si elle existe."""
    db = flask.g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    """
    Associe les fonctions de gestion de la base à l'application Flask.

    À appeler lors de l'initialisation de l'application.
    """
    app.teardown_appcontext(close_db)