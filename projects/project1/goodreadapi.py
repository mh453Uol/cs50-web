import os
import requests

def main():
    if not os.getenv("GOODREAD_API_KEY"):
        raise RuntimeError("GOODREAD_API_KEY is not set")
    
    api_key = os.getenv("GOODREAD_API_KEY")

    endpoint = "https://www.goodreads.com/book/review_counts.json"
    params = {"key": api_key, "isbns": "9781632168146"}

    result = requests.get(endpoint,params=params)

    print(result.json())

if __name__ == "__main__":
    main()
