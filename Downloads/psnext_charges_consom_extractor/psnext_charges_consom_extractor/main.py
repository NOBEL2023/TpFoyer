from isoweek import Week


# w = Week(2011, 20)
# print ("Week %s starts on %s" % (w, w.monday()))

# print ("Current week number is", Week.thisweek().week)
# print ("Next week is", Week.thisweek() + 1)

# import openpyxl

# # Define variable to load the dataframe
# dataframe = openpyxl.load_workbook("D:/AES/Workspace/Projets/psnext_charges_consom_extractor/inputs/exemple_1_an.xlsx")

# # Define variable to read sheet
# dataframe1 = dataframe.active

# # Iterate the loop to read the cell values
# for row in range(0, dataframe1.max_row):
# 	for col in dataframe1.iter_cols(1, dataframe1.max_column):
# 		print(col[row].value)



# file_name =  "D:/AES/Workspace/Projets/psnext_charges_consom_extractor/inputs/exemple_1_an.xlsx"
# sheet =  "Sciforma"

# import pandas as pd
# df = pd.read_excel(io=file_name, sheet_name=sheet)
# #print(df.head(1751))  # print first 5 rows of the dataframe
# print(df.loc[[1736, 1751]])


import pandas as pd

# Read data from the existing Excel file
df = pd.read_excel('C:/Users/Nour Belhedi/Downloads/psnext_charges_consom_extractor/psnext_charges_consom_extractor/inputs')

# Write the data to a new Excel file
df.to_excel('C:/Users/Nour Belhedi/Downloads/psnext_charges_consom_extractor/psnext_charges_consom_extractor/output.xlsx', index=False , header=None , na_rep='')




