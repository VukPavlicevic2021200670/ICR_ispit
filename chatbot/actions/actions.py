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

class ActionFlghtList(Action):

    def name(self) -> Text:
        return "action_flight_list"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://flight.pequla.com/api/flight?type=departure&page=0&size=4&sort=id,desc'
        generate_attachment(url, dispatcher, "Here are some flights")
        return []

class ActionFlghtListByDestination(Action):

    def name(self) -> Text:
        return "action_flight_list_by_destination"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Extract the destination from the action
        destination = tracker.get_slot("destination")
        if not destination:
            dispatcher.utter_message(text="You haven't provided the destination in the message")
            return []

        # Generate a response using the HTTP Request
        url = f'https://flight.pequla.com/api/flight/destination/{destination}?type=departure&page=0&size=4&sort=id,desc'
        generate_attachment(url, dispatcher, f"Here are flights to {destination}")
        return []

# Function that does the actual HTTP Request and sends it back as an attachement
def generate_attachment(url: str, dispatcher: CollectingDispatcher, msg: str ):
    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        arr = data['content']
        if (isinstance(arr, list) and len(arr)>0):
            dispatcher.utter_message(text=msg, attachment=arr)
            return[]

        dispatcher.utter_message(text="We failed to find any flights!")
    except requests.exceptions.RequestException as ex:
        dispatcher.utter_message(text="An error occured!")
