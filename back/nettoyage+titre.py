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
        if not isinstance(text, str) or not text.strip():
            return ""

        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = text.lower()

        doc = nlp(text)
        lemmatized_tokens = [token.lemma_ for token in doc if token.lemma_ not in ENGLISH_STOP_WORDS and not token.is_punct]

        return " ".join(lemmatized_tokens)

    except Exception as e:
        print(f"Error processing text: {text}")
        print(e)
        return ""



def clean_text(text):
    if not isinstance(text, str) or not text.strip():
        return ""

    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()

    doc = nlp(text)
    lemmatized_tokens = [token.lemma_ for token in doc if token.lemma_ not in ENGLISH_STOP_WORDS]

    return lemmatized_tokens



tqdm.pandas()
print("nettoyage")


df['cleaned_title'] = df['title'].progress_apply(clean_text)

print("Entraînement du modèle Word2Vec")
cleaned_titles = df['cleaned_title'].tolist()
print(cleaned_titles)
model = Word2Vec(sentences=cleaned_titles, vector_size=100, window=7, min_count=1, workers=4)

print("Extraction des mots uniques")

unique_words = list(model.wv.index_to_key)
print(unique_words)
word_vectors = model.wv[unique_words]

print("Clustering")
num_clusters = 30
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
kmeans.fit(word_vectors)

word_clusters = {word: kmeans.labels_[i] for i, word in enumerate(unique_words)}

print(word_clusters)
'''
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
'''


def get_hypernyms(word):

    synsets = wn.synsets(word)
    hypernyms = set()

    for syn in synsets:
        for hypernym in syn.hypernyms():
            hypernyms.add(hypernym.lemmas()[0].name())

    return hypernyms


print("Définition des thèmes avec WordNet (pondération uniforme)")
cluster_themes = {}
top_n_hypernyms = 20

for cluster_id in range(num_clusters):
    cluster_words = [word for word, label in word_clusters.items() if label == cluster_id]


    hypernym_counter = Counter()
    for word in cluster_words:
        hypernyms = get_hypernyms(word)
        hypernym_counter.update(hypernyms)


    most_common_hypernyms = [hypernym for hypernym, _ in hypernym_counter.most_common(top_n_hypernyms)]


    if most_common_hypernyms:
        cluster_themes[cluster_id] = ", ".join(most_common_hypernyms)
    else:
        cluster_themes[cluster_id] = "Thème inconnu"

    print(f"Cluster {cluster_id + 1} (Thèmes : {cluster_themes[cluster_id]}): {', '.join(cluster_words)}")

output_path = "clusters_result_wordnet3.csv"
print(f"Sauvegarde des résultats dans {output_path}")
with open(output_path, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Cluster ID", "Thème", "Mots"])
    for cluster_id, theme in cluster_themes.items():
        cluster_words = [word for word, label in word_clusters.items() if label == cluster_id]
        writer.writerow([cluster_id + 1, theme, ", ".join(cluster_words)])