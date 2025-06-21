from typing import Any, Text, Dict, List
import inspect
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

def debug_api_call(function_name: str, url: str, params: dict = None):
    """Helper function to standardize API call debugging"""
    query_string = '&'.join([f"{k}={v}" for k, v in (params or {}).items()])
    full_url = f"{url}?{query_string}" if query_string else url
    print(f"\n[DEBUG] Function '{function_name}' is making API call to: {full_url}")

class ActionHelloWorld(Action):
    def name(self) -> Text:
        return "action_hello_world"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Hello World!")
        return []

class ActionPetList(Action):
    def name(self) -> Text:
        return "action_pet_list"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        params = {
            'page': 0,
            'size': 4,
            'sort': 'id,desc'
        }
        debug_api_call(self.name(), 'http://localhost:3000/api/pets', params)
        generate_attachment('http://localhost:3000/api/pets', dispatcher,
                          "Here are some pets you can adopt:", params)
        return []

class ActionPetListByBreed(Action):
    def name(self) -> Text:
        return "action_pet_list_by_breed"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        breed = tracker.get_slot("breed")
        if not breed:
            dispatcher.utter_message(text="You haven't provided the breed.")
            return []

        params = {
            'breed': breed,
            'page': 0,
            'size': 4
        }
        debug_api_call(self.name(), 'http://localhost:3000/api/pets', params)
        generate_attachment('http://localhost:3000/api/pets', dispatcher,
                          f"Here are some {breed}s available:", params)
        return []

class ActionPetListBySize(Action):
    def name(self) -> Text:
        return "action_pet_list_by_size"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        size = tracker.get_slot("size")
        if not size:
            dispatcher.utter_message(text="You haven't specified the size.")
            return []

        params = {
            'petSize': size,
            'page': 0,
            'size': 4
        }
        debug_api_call(self.name(), 'http://localhost:3000/api/pets', params)
        generate_attachment('http://localhost:3000/api/pets', dispatcher,
                          f"Here are some {size} pets available:", params)
        return []

class ActionPetListByAge(Action):
    def name(self) -> Text:
        return "action_pet_list_by_age"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        age = tracker.get_slot("age")
        if not age:
            dispatcher.utter_message(text="You haven't specified the age.")
            return []

        age_map = {
            'baby': '0-1',
            'young': '1-3',
            'adult': '3-7',
            'senior': '7+',
            'puppy': '0-1',
            'kitten': '0-1'
        }
        age_range = age_map.get(age.lower(), '0-100')

        params = {
            'age': age_range,
            'page': 0,
            'size': 4
        }
        debug_api_call(self.name(), 'http://localhost:3000/api/pets', params)
        generate_attachment('http://localhost:3000/api/pets', dispatcher,
                          f"Here are some {age} pets available:", params)
        return []

class ActionPetListByPrice(Action):
    def name(self) -> Text:
        return "action_pet_list_by_price"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        price = tracker.get_slot("price")
        if not price:
            dispatcher.utter_message(text="You haven't specified the price range.")
            return []

        params = {
            'priceRange': price.lower(),
            'page': 0,
            'size': 4
        }
        debug_api_call(self.name(), 'http://localhost:3000/api/pets', params)
        generate_attachment('http://localhost:3000/api/pets', dispatcher,
                          f"Here are some {price} pets:", params)
        return []

class ActionPetListByMultiple(Action):
    def name(self) -> Text:
        return "action_pet_list_by_multiple"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        breed = next(tracker.get_latest_entity_values("breed"), None)
        size = next(tracker.get_latest_entity_values("size"), None)
        age = next(tracker.get_latest_entity_values("age"), None)
        price = next(tracker.get_latest_entity_values("price"), None)

        params = {
            'page': 0,
            'size': 4
        }

        if breed:
            params['breed'] = breed
        if size:
            params['petSize'] = size
        if age:
            age_map = {
                'baby': '0-1',
                'young': '1-3',
                'adult': '3-7',
                'senior': '7+',
                'puppy': '0-1',
                'kitten': '0-1'
            }
            params['age'] = age_map.get(age.lower(), '0-100')
        if price:
            price_map = {
                'cheap': 'cheap',
                'affordable': 'affordable',
                'expensive': 'expensive',
                'luxury': 'luxury'
            }
            params['priceRange'] = price_map.get(price.lower(), 'affordable')

        filter_descriptions = []
        if breed:
            filter_descriptions.append(f"breed: {breed}")
        if size:
            filter_descriptions.append(f"size: {size}")
        if age:
            filter_descriptions.append(f"age: {age}")
        if price:
            filter_descriptions.append(f"price: {price}")

        if not filter_descriptions:
            dispatcher.utter_message(text="You haven't specified any search criteria.")
            return []

        message = "Here are pets matching: " + ", ".join(filter_descriptions)
        debug_api_call(self.name(), 'http://localhost:3000/api/pets', params)
        generate_attachment('http://localhost:3000/api/pets', dispatcher, message, params)
        return []

def generate_attachment(url: str, dispatcher: CollectingDispatcher, msg: str, params: dict = None):
    try:
        caller = inspect.currentframe().f_back.f_code.co_name
        debug_api_call(f"generate_attachment (called by {caller})", url, params)

        response = requests.get(url, params=params)
        response.raise_for_status()

        data = response.json()
        arr = data.get('content', [])
        if isinstance(arr, list) and len(arr) > 0:
            dispatcher.utter_message(text=msg, attachment=arr)
            return []

        dispatcher.utter_message(text="We couldn't find any pets that match your request.")
    except requests.exceptions.RequestException as ex:
        print(f"\n[ERROR] In function 'generate_attachment': {ex}")
        dispatcher.utter_message(text="An error occurred while retrieving the pet list.")
    except Exception as ex:
        print(f"\n[UNEXPECTED ERROR] In function 'generate_attachment': {ex}")
        dispatcher.utter_message(text="An unexpected error occurred.")