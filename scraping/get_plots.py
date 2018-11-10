import requests
from bs4 import BeautifulSoup

url = "https://www.imdb.com/title/tt0098924/episodes"


def get_page():
    response = requests.get(url)
    html = response.text
    soup = BeautifulSoup(html,"html.parser")
#    links = soup.select('.item_description')
    descriptions = soup.select('.item_description')
    f = open("plotsummaries.txt","w+")
    for description in descriptions:
        textdescript = description.string.strip()
        print(textdescript)
        f.write(textdescript + "\n")
    f.close()
#for link in links:
#    print link.string
#    print link.get("href")
get_page()