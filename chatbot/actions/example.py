import requests

def get_pet():
    try:
        url = 'http://localhost:3000/api/pets'
        params = {
            'page': 0,
            'size': 5
        }

        # Print the full API call being made
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        full_url = f"{url}?{query_string}"
        print(f"\nMaking API call to: {full_url}")

        response = requests.get(url, params=params)
        response.raise_for_status()

        data = response.json()
        pets = data.get('content', [])

        print(f"\nThere is a total of {data.get('totalElements', 0)} pets in the database.")
        print("=" * 60)

        for pet in pets:
            print(f"\nPet: {pet.get('name', 'N/A')}")
            print(f"Breed: {pet.get('breed', 'N/A')}")
            print(f"Age: {pet.get('age', 'N/A')} years")
            print(f"Size: {pet.get('size', 'N/A')}")
            print(f"Price Range: {pet.get('priceRange', 'N/A').capitalize()}")
            print(f"Image: {pet.get('imageUrl', 'No image')}")
            print("-" * 50)

    except requests.exceptions.RequestException as ex:
        print(f"\nRequest failed: {ex}")

get_pet()