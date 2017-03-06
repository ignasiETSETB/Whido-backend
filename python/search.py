import yaml,datetime
import urllib,json,pprint,sys, requests, time,os


'''Class implementing methods to gather facebook objects defined in facebook graph api request
    Author :  Pawel Gontarz
    Date  : 16/11/2016
'''
class Events:
    def __init__(self):
        '''
        Loading configuration file
        '''
        # config = self.load_config_file('/home/pawel/AndroidStudioProjects/whido-api/python/config.yaml')
        path = os.getcwd()
        config = self.load_config_file(path +'/config.yaml')

        self.acccess_token = (config['access_token'])
        self.url = config['url']
        self.url_qd = config['url_qd']
        self.url_q = config['url_q']
        self.url_d = config['url_d']
        self.url_ll = config['url_ll']

        self.iter = 0

    pass

    def load_config_file(self, name):
        stream = open(name, 'r')
        return yaml.load(stream)
    pass

    def set_category(self, category):
        self.category = category

    pass

    def getEvents(self, type,query=None,  longtitud = None, latitude = None, distance = None, next = None):
        '''
        Main class method to collect interested data from facebook response
        :param query: parameter which specifies word to be looked for
        :param type: type of category among should be looked
        :param longtitud: geolocalzation parameter
        :param latitude: geolocalzation parameter
        :param distance: radian parameter in meters
        :param next: next url to be requested for
        :return: resulted json object
        '''
        if next is not None:
            print next
            data = urllib.urlopen(next)
            self.json = json.load(data)

            for event in self.json['data']:
                if 'start_time' in event:
                    result = self.isActual(event['start_time'])
                else:
                    result =None #event not actual

                if result is not None:
                    self.jsonProcess(event=event)
                else:
                    continue
            pass

            self.paging(self.json, dic =1)
        else:
            ##all included
            if longtitud is not None and latitude is not None and distance is not None and query is not None:
                url_place=self.url_qd % (str(round(time.time())),query, type, float(longtitud), float(latitude), int(distance),self.acccess_token)
                url_place = str(url_place)

                data = urllib.urlopen(url_place )
            ##without query
            elif longtitud is not None and latitude is not None and distance is not None :
                url_place_qrless=self.url_d % (str(round(time.time())), type, float(longtitud), float(latitude), int(distance),self.acccess_token)
                url_place = str(url_place_qrless)

                data = urllib.urlopen(url_place )
            ##without distance
            elif longtitud is not None and latitude is not None and query is not None:
                url_place=self.url_q % (str(round(time.time())),query, type, float(longtitud), float(latitude),self.acccess_token)
                url_place = str(url_place)
                print url_place
                data = urllib.urlopen(url_place)
            ##without query and distance
            elif longtitud is not None and latitude is not None:
                url_place=self.url_ll % (str(round(time.time())), type, float(longtitud), float(latitude),self.acccess_token)
                url_place = str(url_place)
                print url_place
                data = urllib.urlopen(url_place)
            ##without long,lat,dist
            else:
                url =self.url % (str(round(time.time())),query,type,self.acccess_token)
                url = str(url)
                print url
                data = urllib.urlopen(url)
            pass
            self.json = json.load(data)
            dat = self.json['data']

            if self.json.get('error'):
                print 'Probably your access token is invalid'

            self.deep_in_json(dat)
    pass

    def set_parameters(self,  type, query = None, longitude = None, latitude = None, distance = None):
        self.query = query
        self.type = type
        self.longitude = longitude
        self.latitude = latitude
        self.distance = distance
    pass

    def paging(self, event, dic = None):
        if dic is not None:
            if 'paging' in self.json:
                if 'next' in self.json['paging']:
                    self.next = str(self.json['paging']['next'])
                else:
                    self.next = None
                    return 0
            else:
                self.next = None
                return 0

            while self.next is not None:
                self.getEvents(query=self.query, type=self.type, longtitud=self.longitude, latitude=self.latitude,
                               distance=self.distance, next=self.next)
            pass
        else:
            if 'paging' in event['events']:
                if 'next' in event['events']['paging']:
                    self.next = str(event['events']['paging']['next'])
                else:
                    self.next = None
            else:
                self.next = None

            while self.next is not None:
                self.getEvents(query=self.query,type= self.type, longtitud=self.longitude, latitude=self.latitude,
                               distance=self.distance, next=self.next)
            pass


    pass

    def deep_in_json(self, events, dic = None):
        if dic is None:
            for event in events:
                if 'events' in event:
                    self.deep_in_json(event['events']['data'], 'yes') #'yes' indicates that it's iterational invokation
                    self.paging(event)
        else:
            for event in events: #here give back json's to node.js
                if 'start_time' in event:
                    result = self.isActual(event['start_time'])
                else:
                    result = None  # event actual

                if result is not None:
                    self.jsonProcess(event=event)
                else:
                    continue
        pass
    pass

    def jsonProcess(self, event):
        jsonObj = {}
        if 'place' in event:
            if 'location' in event['place']:
                jsonObj['longitude'] = str(event['place']['location']['longitude'])
                jsonObj['latitude'] = str(event['place']['location']['latitude'])
        else:
            return

        jsonObj['title'] = str(event['name'].encode('ascii', 'ignore').decode('ascii', 'ignore'))
        if 'description' in event:
            jsonObj['description'] = str(event['description'].encode('ascii', 'ignore').decode('ascii', 'ignore'))
        jsonObj['id'] = str(event['id'])
        jsonObj['start_time'] = str(event['start_time'])
        if 'end_time' in event:
            jsonObj['end_time'] = str(event['end_time'])
        else:
            jsonObj['end_time'] = ""

        jsonObj['type'] = str('facebook')
        jsonObj['permissions'] = str(event['type'])
        jsonObj['attending_count'] = str(event['attending_count'])

        if 'picture' in event:
            if 'url' in event['picture']['data']:
                jsonObj['picture'] = str(event['picture']['data']['url'])

        headers = {'Content-type': 'application/json'}

        print  requests.post("http://127.0.0.1:3090/addEvent", json=jsonObj, headers=headers).text
    pass


    def isActual(self, start_time):
        now = datetime.datetime.now()

        if str(start_time) > str(now):
            return 1
        else:
            return None
        pass
    pass


if __name__ == '__main__':
    if "place" in sys.argv:
        type = "place"
        if len(sys.argv) ==6:
            longitude = sys.argv[3]
            latitude = sys.argv[4]
            distance = sys.argv[5]
            query = sys.argv[1]
            type = sys.argv[2]

            instance = Events()
            instance.set_parameters(query=query, type=type,longitude=longitude,latitude=latitude,distance=distance)
            instance.getEvents(query, type,longitude, latitude, distance)
        elif len(sys.argv) ==4:
            longitude = sys.argv[2]
            latitude = sys.argv[3]
            type = sys.argv[1]

            instance = Events()
            instance.set_parameters( type=type,longitude=longitude,latitude=latitude)
            instance.getEvents(type='place',longtitud= longitude,latitude= latitude)
        elif len(sys.argv) == 3:
            query = sys.argv[1]
            type = sys.argv[2]

            instance = Events()
            instance.set_parameters(type=type, query=query)
            instance.getEvents(type='place', query=query)
        elif len(sys.argv) ==5 and sys.argv[len(sys.argv)-1].isdigit():
            longitude = sys.argv[2]
            latitude = sys.argv[3]
            type = sys.argv[1]
            distance = sys.argv[4]

            instance = Events()
            instance.set_parameters( type=type,longitude=longitude,latitude=latitude, distance=distance)
            instance.getEvents(type=type, longtitud=longitude,latitude= latitude,distance=distance)
        else:
            longitude = sys.argv[3]
            latitude = sys.argv[4]
            query = sys.argv[1]
            type = sys.argv[2]

            instance = Events()
            instance.set_parameters(query=query, type=type,longitude=longitude,latitude=latitude)
            instance.getEvents(query=query,type='place', longtitud=longitude,latitude= latitude)
    pass
