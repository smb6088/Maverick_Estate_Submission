import sys
import json
from pymongo import MongoClient

if len(sys.argv) < 2:
    print("No connection string provided")
    

client = MongoClient(sys.argv[1])

mdb = client["maverick_db"]
listings_c = mdb["Listings"]

json_data_file_path = "/home/aven/mongodb_DATA/cleaned_zillow.json"

json_file_handler = open(json_data_file_path, "r")
#with open(json_data_file_path, 'r') as json_file_handler:
#    listings = json.load(json_file_handler)

listings = json.load(json_file_handler)
print("Documents in collection:", listings_c.count_documents({}))
listings_c.insert_many(listings)
print("Documents in collection:", listings_c.count_documents({}))
#rint(listings)