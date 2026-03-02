import pandas as pd
import os

security_path = r"C:\Users\Gautham\.cache\kagglehub\datasets\mikrokosmos1\securityincident\versions\1\security_incident_classification.csv"
crime_path = r"C:\Users\Gautham\.cache\kagglehub\datasets\mikrokosmos1\crimedata\versions\1\hyderabad_crime_data_enhanced (1).csv"

def analyze():
    print("--- Security Incident Mapping ---")
    if os.path.exists(security_path):
        df_sec = pd.read_csv(security_path)
        print("Locations:", df_sec['Location_Type'].unique())
        print("Severities:", df_sec['Severity_Level'].unique())
        print("Time of Day:", df_sec['Time_of_Day'].unique())
    else:
        print("Security data missing")

    print("\n--- Crime Data Mapping ---")
    if os.path.exists(crime_path):
        df_crime = pd.read_csv(crime_path)
        print("Areas:", df_crime['Area'].unique())
        print("Severities:", df_crime['Severity'].unique())
        print("Crime Types:", df_crime['Crime_Type'].unique())
    else:
        print("Crime data missing")

if __name__ == "__main__":
    analyze()
