import flask
import mysql.connector

def getdb():
    if 'db' not in flask.g or not flask.g.db.is_connected():
        try:
            flask.g.db = mysql.connector.connect(
            host=flask.current_app.config['DB_HOST'],
            user=flask.current_app.config['DB_USER'],
            password=flask.current_app.config['DB_PASSWORD'],
            database=flask.current_app.config['DB_DATABASE']
        )
            return flask.g.db
        except Exception as e:
            print(e)

def query(query_string, fetchall):
    cnx = None
    try:
        cnx = mysql.connector.connect(user=flask.current_app.config['DB_USER'], host=flask.current_app.config['DB_HOST'], database=flask.current_app.config['DB_DATABASE'], password=flask.current_app.config['DB_PASSWORD'])
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(query_string)
        if fetchall:
            return cursor.fetchall()
        else:
            return cursor.fetchone()
    except Exception as e:
        print(e)
    finally:
        cnx.close()

def close_db(e=None):
    db = flask.g.pop('db', None)

    if db is not None and db.is_connected():
        db.close()

