import csv
import json
import os
from pymongo import MongoClient

# Directory containing the CSV files
csv_directory = 'data'
# Directory to save the JSON files
json_directory = 'mock_data'

# Ensure the JSON directory exists
os.makedirs(json_directory, exist_ok=True)

# Connect to the local MongoDB instance
client = MongoClient('mongodb://localhost:27017/')
# Create or connect to the database
mongo_db = client['mock_data_db']

# List of CSV files to convert
csv_files = ['Actions.csv', 'Steps.csv', 'Sessions.csv', 'Workflows.csv', 'Tasks.csv']

for csv_file in csv_files:
    csv_path = os.path.join(csv_directory, csv_file)
    collection_name = csv_file.replace('.csv', '')
    collection = mongo_db[collection_name]
    
    # Read the CSV file
    with open(csv_path, mode='r', newline='', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        # Convert to a list of dictionaries
        data = list(csv_reader)
        
    # Insert data into MongoDB collection
    if data:
        collection.insert_many(data)

print('CSV data inserted into MongoDB collections.') 