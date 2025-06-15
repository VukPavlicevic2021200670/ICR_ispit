import requests

def get_pet():
    try:
        url = 'http://localhost:3000/api/pets?page=0&size=5'  # you can change pagination as needed
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        pets = data.get('content', [])

        print(f"There is a total of {data.get('totalElements', 0)} pets in the database.")
        for pet in pets:
            print(f"Pet: {pet['name']} | Breed: {pet['breed']} | Age: {pet.get('age', 'N/A')}")

    except requests.exceptions.RequestException as ex:
        print(f"Request failed: {ex}")

# Run the function
get_pet()
