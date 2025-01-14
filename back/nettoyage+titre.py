import re
import nltk
import csv
from tqdm import tqdm
from collections import defaultdict, Counter
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from sklearn.cluster import KMeans
from gensim.models import Word2Vec
import pandas as pd
import spacy

from nltk.corpus import wordnet as wn
from collections import Counter

#nltk.download('wordnet')

nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

print("Lecture du fichier")
csv_path = "Result_2.csv"
df = pd.read_csv(csv_path, names=["title", "year"], quotechar='"')


def clean_and_lemmatize_text(text):
    try:
        # Vérifier si le texte est une chaîne de caractères
        if not isinstance(text, str) or not text.strip():
            return ""

        # Nettoyage de base : suppression de la ponctuation et mise en minuscules
        text = re.sub(r'[^\w\s]', '', text)
        text = text.lower()

        # Tokenisation et lemmatisation avec SpaCy
        doc = nlp(text)
        lemmatized_tokens = [token.lemma_ for token in doc if token.lemma_ not in ENGLISH_STOP_WORDS and not token.is_punct]

        # Retourner le texte lemmatisé sous forme de chaîne
        return " ".join(lemmatized_tokens)

    except Exception as e:
        print(f"Error processing text: {text}")
        print(e)
        return ""

tqdm.pandas()
print("nettoyage")

df['cleaned_title'] = df['title'].progress_2
apply(clean_and_lemmatize_text)

# Étape 3 : Entraîner un modèle Word2Vec sur les titres nettoyés
print("Entraînement du modèle Word2Vec")
cleaned_titles = df['cleaned_title'].tolist()
model = Word2Vec(sentences=cleaned_titles, vector_size=200, window=7, min_count=1, workers=4)

# Étape 4 : Extraire les mots uniques et leurs vecteurs
print("Extraction des mots uniques")
unique_words = list(model.wv.index_to_key)
word_vectors = model.wv[unique_words]

# Étape 5 : Clustering des mots
print("Clustering")
num_clusters = 10  # Nombre de thèmes souhaités
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
kmeans.fit(word_vectors)

# Associer chaque mot à son cluster
word_clusters = {word: kmeans.labels_[i] for i, word in enumerate(unique_words)}

# Étape 6 : Définir les thèmes à partir d’un dictionnaire de thèmes
# Dictionnaire de thèmes pré-définis (à enrichir selon vos besoins)


# Associer chaque cluster à un thème en utilisant la similarité avec le dictionnaire
def get_hypernyms(word):
    synsets = wn.synsets(word)
    hypernyms = set()

    for syn in synsets:
        for hypernym in syn.hypernyms():
            hypernyms.add(hypernym.lemmas()[0].name())  # Récupérer le premier lemme du synset

    return list(hypernyms)

# Associer chaque cluster à un thème via les hyperonymes WordNet
print("Définition des thèmes avec WordNet")
cluster_themes = {}

for cluster_id in range(num_clusters):
    cluster_words = [word for word, label in word_clusters.items() if label == cluster_id]

    # Récupérer les hyperonymes pour tous les mots du cluster
    all_hypernyms = []
    for word in cluster_words:
        all_hypernyms.extend(get_hypernyms(word))

    # Trouver l’hyperonyme le plus fréquent comme thème dominant
    if all_hypernyms:
        most_common_hypernym = Counter(all_hypernyms).most_common(1)[0][0]
        cluster_themes[cluster_id] = most_common_hypernym
    else:
        cluster_themes[cluster_id] = "Thème inconnu"

    print(f"Cluster {cluster_id + 1} (Thème : {cluster_themes[cluster_id]}): {', '.join(cluster_words)}")


output_path = "clusters_result_wordnet.csv"
print(f"Sauvegarde des résultats dans {output_path}")
with open(output_path, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Cluster ID", "Thème", "Mots"])
    for cluster_id, theme in cluster_themes.items():
        cluster_words = [word for word, label in word_clusters.items() if label == cluster_id]
        writer.writerow([cluster_id + 1, theme, ", ".join(cluster_words)])