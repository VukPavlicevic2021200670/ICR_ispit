from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests


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

        url = 'http://localhost:3000/api/pets?page=0&size=4&sort=id,desc'
        generate_attachment(url, dispatcher, "Here are some pets you can adopt:")
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

        # Use existing /api/pets endpoint with ?breed=
        url = (
            f'http://localhost:3000/api/pets'
            f'?breed={breed}&page=0&size=4&sort=id,desc'
        )
        generate_attachment(url, dispatcher, f"Here are some {breed}s available:")
        return []

def generate_attachment(url: str, dispatcher: CollectingDispatcher, msg: str):
    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        arr = data.get('content', [])
        if isinstance(arr, list) and len(arr) > 0:
            dispatcher.utter_message(text=msg, attachment=arr)
            return []

        dispatcher.utter_message(text="We couldn't find any pets that match your request.")
    except requests.exceptions.RequestException as ex:
        dispatcher.utter_message(text="An error occurred while retrieving the pet list.")