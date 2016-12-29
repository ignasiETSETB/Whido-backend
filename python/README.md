#Public event crawler
Objective of this script is to collect events from certain area described by geolocalization parameters: longitude, latitude.
There are different ways of searching:
- by specifing the query parameter and localization (example: Barcelona place 41.3 2.17)
- by specifing the query parameter, localization, distance to look for (example: Barcelona place 41.3 2.17 100000)
- without specifing query, only localization and (optionally) distance


In order to invoke explained script it is only necessary to type:
python run.py

In run.py script event crawler is invoked for every location found in firebase parallelaly.
