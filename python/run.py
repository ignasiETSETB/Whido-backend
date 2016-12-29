import os
from datetime import datetime, timedelta
import time, requests
from geopy.geocoders import Nominatim
import json
from multiprocessing import Process, Pool

def get_users():
    '''Retrieve users from firebase'''
    return requests.get("http://127.0.0.1:3090/getUsers")
pass

def get_coordinates(city):
    '''Compute coordinates by giving name of the city'''
    geolocator = Nominatim()
    location = geolocator.geocode(city)
    if location is not None:
        coordinates = {}
        coordinates['longitude'] = location.longitude
        coordinates['latitude'] = location.latitude
        return coordinates
    else:
        return None
    pass
pass

def run_script(coordinates, city):
    '''Execute python script to gather all available events for given coordinates'''
    print 'Crawler run in ' + city + '..'

    command = "python search.py " + city + " place " + str(coordinates['longitude']) + " " + str(coordinates['latitude'])
    os.system(command)



if __name__ == '__main__':
    users = get_users().content
    json = json.loads(users)
    if json is not None:
        while 1: ## now its endless loop, we can change it by adding some ending condition
            local_cities = list()
            for user in json:
                city = json[user]['city']
                if city in local_cities:
                    pass
                else:
                    local_cities.append(city)

                    coordinates = get_coordinates(city)
                    if coordinates is not None:
                        p = Pool()
                        result = p.apply_async(func=run_script, args=(coordinates, city, ))

            print result.get()
            ##by defining timedelta we decide how often the script should be invoke
            dt = datetime.now() + timedelta(minutes=5)

            while datetime.now() < dt:
              time.sleep(1)





