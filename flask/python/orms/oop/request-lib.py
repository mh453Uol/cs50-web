import requests

def main():
    BASE_URL = "https://jsonplaceholder.typicode.com"

    response = requests.get(f"{BASE_URL}/todos")

    if response.status_code != 200:
        raise Exception(f"ERROR: API request unsuccessful - {response.__dict__}")

    data = response.json()

    print(f"**********************")
    print(f"*       TODOS        *")
    print(f"**********************")
    for todo in data:
        print(f"Title: {todo['title']}")

    #print(data)


if __name__ == "__main__":
    main()