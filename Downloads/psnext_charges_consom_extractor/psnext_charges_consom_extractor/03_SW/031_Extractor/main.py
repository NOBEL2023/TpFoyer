import sys
import os
import datetime
import pandas as pd
from dotenv import load_dotenv
import re

# Check command line arguments
args = len(sys.argv) - 1
if args != 1:
    print(f'Error in arguments: args number={args}')
    print('Usage: python program_name.py extractor_setting_file_path.properties')
    sys.exit(1)
else:
    extractor_setting_file_path = sys.argv[1]

# Check if the given file path is valid
if not os.path.isfile(extractor_setting_file_path):
    print(f'{extractor_setting_file_path} is not a file')
    sys.exit(1)

# Load environment variables from the specified file
load_dotenv(extractor_setting_file_path)

# Get environment variables
source_excel_path = os.getenv("source_excel_path")
new_excel_path = os.getenv("new_excel_path")
cell_starts_with = os.getenv("cell_starts_with")
final_output_path = os.getenv("final_output_path")
Date_header_csv_file = os.getenv("Date_header_csv_file")
week_number_header_csv_file = os.getenv("week_number_header_csv_file")
Resources_header_csv_file = os.getenv("Resources_header_csv_file")
Tache_header_csv_file = os.getenv("Tache_header_csv_file")
Charge_header_csv_file = os.getenv("Charge_header_csv_file")
Date_format = os.getenv("Date_format")
week_format = os.getenv("week_format")
year_format = os.getenv("year_format")
pattern=os.getenv("pattern")
Date_format_two_digits_from_year=os.getenv("Date_format_two_digits_from_year")

print(source_excel_path)
print(new_excel_path)


"""

extract from original excel file only the users that have the needed data

"""
# Read Excel data
df = pd.read_excel(source_excel_path, skiprows=6, header=None, na_values='')
df = df.dropna(how='all')

E_COLUMN = 4

# Apply condition to filter rows
condition = ~((df.iloc[:, E_COLUMN].astype(str).str.startswith(cell_starts_with))
               & ~(df.iloc[:, E_COLUMN].shift(-1).astype(str).str.isnumeric()))
df_filtered = df[condition]

# Save the filtered DataFrame to a new Excel file
df_filtered.to_excel(new_excel_path, index=False, header=None, na_rep='')

"""

read from intermediate excel file

"""


# Read data from the intermediate file
df = pd.read_excel(new_excel_path, header=None)

# Identify rows with 'S' pattern
s1_rows = df[df[E_COLUMN].astype(str).str.startswith(cell_starts_with, na=False)].index
#print(s1_rows)


# Get the starting year from the first row
year_from_start_date = int(df.iloc[0, 3].strftime(year_format))

year_from_end_date=df.iloc[0, 5].strftime(Date_format)

rapport_start_date = df.iloc[0, 3].strftime(Date_format)

rapport_end_date=df.iloc[0, 5].strftime(Date_format)

rapport_start_date = datetime.datetime.strptime(rapport_start_date, Date_format)
rapport_end_date = datetime.datetime.strptime(rapport_end_date, Date_format)
print(rapport_end_date)

dfs = []
csv_data = []

for row_index in s1_rows:
    row_data = df.iloc[row_index, :]

    for col_index, cell_value in enumerate(row_data):
        if re.search(r'\sS\s', str(cell_value)):
            print(cell_value)

            week_number_match = re.search(r'\sS\s(\d+)\s-\s(\d+)', str(cell_value))
            print(week_number_match)

            if week_number_match:
                week_number = week_number_match.group(1)
                year = int(week_number_match.group(2))
                #print(f"Week number found in row {row_index}, column {col_index}: {week_number}, year {year}")

                if 0 <= year <= 99:
                    year_str = f"{year:02d}"
                    start_date = datetime.datetime.strptime(f"{year_str}-{week_number}-1", Date_format_two_digits_from_year)
                    end_date = start_date + datetime.timedelta(days=4)
                    for i, start_index in enumerate(s1_rows):
                        end_index = s1_rows[i + 1] if i < len(s1_rows) - 1 else df.shape[0]
                        resources_value = df.iloc[start_index, 0]

                        # Iterate through the dates of the week
                        for i in range(5):  
                            current_date = start_date + datetime.timedelta(days=i)
                            if rapport_start_date <= current_date <= rapport_end_date:
                                date_str = current_date.strftime(Date_format)
                                #print(date_str)
                            
                                tache_values = df.iloc[start_index + 2:end_index - 1, 0].tolist()
                                charge_values = df.iloc[start_index + 2:end_index - 1, col_index].tolist()
                                
                                if any(charge != 0 for charge in charge_values):
                                    # Get the number of columns matching week_number_match
                                    num_matching_columns = sum(1 for cell_value in row_data if re.search(r'\sS\s', str(cell_value)))

                                    # Calculate days_count based on the number of matching columns
                                    if num_matching_columns == 1:
                                        days_count = (rapport_end_date - rapport_start_date).days + 1
                                    else:
                                        common_days = len(set(range((current_date - datetime.timedelta(days=4)).weekday(), current_date.weekday() + 1)) & set(range(0, 5)))
                                        days_count = common_days if common_days > 0 else 1  
                                    
                                    # Divide charge by days_count and append data to csv_data
                                    for tache_value, charge_value in zip(tache_values, charge_values):
                                        #print(tache_value)
                                        #print(charge_value)
                                        adjusted_charge = charge_value / days_count
                                        csv_data.append([date_str, resources_value, tache_value, adjusted_charge])

# Create DataFrame from csv_data
df_csv = pd.DataFrame(csv_data, columns=["date", "resource", "task","charge"])

# Drop rows where charge is 0
df_csv.drop(df_csv[df_csv['charge'] == 0].index, inplace=True)





df_csv.to_csv(final_output_path, index=False)


print("---")
print(rapport_start_date)
print(rapport_end_date)





