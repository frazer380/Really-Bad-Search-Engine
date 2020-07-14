import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from bs4 import BeautifulSoup
from requests import get
import sys

cred = credentials.Certificate("search-engine-91525-firebase-adminsdk-n1ea3-4dfc0c98cb.json")

app = firebase_admin.initialize_app(cred)

searchedURLs = []

def pageRank(link):
    linksInThatPage = 0
    if ".gov" in link:
        rank = 10
    else:
        # do the algorithm
        # PageRank(A) = PageRank(B) / Links In Page B 
        response = get(link)
        soup = BeautifulSoup(response.text, "html.parser")
        for a in soup.find_all("a", href=True):
            if a["href"].startswith("#") or a["href"].startswith("."):
                continue
            else:
                linksInThatPage = linksInThatPage + 1
                rank = 1 / linksInThatPage
                rank = rank * 100
    return rank

def scrape(url):
    sys.setrecursionlimit(1000)
    response = get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    try:
        for a in soup.find_all("a", href=True):
            if a["href"].startswith("#") or a["href"].startswith("."):
                continue
            else:
                images = []
                title = soup.title.string
                description = soup.find('meta', attrs={'name':'og:description'}) or soup.find('meta', attrs={'property':'description'}) or soup.find('meta', attrs={'name':'description'})
                keywords = soup.find("meta", attrs={"name": "keywords"})
                for img in soup.find_all("img"):
                    images.append(img["src"])
                if description and keywords:
                    description = description.get("content")
                    keywords = keywords.get("content")
                else:
                    description = ""
                    keywords = ""
                rank = pageRank(url)
                db = firestore.client()
                doc_ref = db.collection("sites")
                if not url in searchedURLs:
                    searchedURLs.append(url)
                    doc_ref.add({
                        "Title": title,
                        "Description": description,
                        "Keywords": keywords,
                        "URL": url,
                        "PageRank": rank,
                        "Images": images
                    })
                else:
                    continue
                scrape(a["href"])
    except:
        pass
scrape("https://microsoft.com")

    