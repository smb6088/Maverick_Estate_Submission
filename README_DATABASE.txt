Install mongodb server from : https://www.mongodb.com/try/download/community 
Make sure to install compass during the installation process
Open compass, create a new connection called 'maverick'
Copy the connection string and put it in the 'MONGO_URI' variable in .env file. 
    -> The connection string should contain the string 'localhost'. If for some reason your DB connection fails, replace 'localhost' with your ip address.
Install pymongo from terminal : 'pip install pymongo'
Edit the variable called 'json_data_file_path', and change it to the path of the listings json file.
Run script 'populate_db.py' with your connection string as the command line argument (so smth like 'python populate_db.py conn_string')
Creates the db for the listings and populates them by reading from the json.

For populating the respective collection with the data, unzip the 'Mongo_data' zip included in the repo, which contains the json files.
For example the 'Listings.json' is supposed to populate the 'Listings' collection in the database, and so on.
