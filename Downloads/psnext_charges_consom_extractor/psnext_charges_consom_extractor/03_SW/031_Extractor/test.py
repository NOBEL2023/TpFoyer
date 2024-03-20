
#--------------------------------------------------------------

# import pendulum
# dt = pendulum.parse('2023-12-30')
# print(dt.week_of_month)

# print(dt.add(days=2).strftime("%m/%d/%Y"))

#--------------------------------------------------------------
# from datetime import datetime, timedelta
# import calendar

# def worked_days_per_week(year, month):
#     cal = calendar.monthcalendar(year, month)
#     weeks = len(cal)
#     worked_days = 0

#     for week in cal:
#         for day in week:
#             if day != 0 and calendar.weekday(year, month, day) < 5:
#                 worked_days += 1

#     return weeks, worked_days

# def get_week_number_for_december(year):
#     date_object = datetime(year, 12, 1)
#     week_number = date_object.isocalendar()[1]
#     return week_number

# # Example for December 2023
# year = 2023
# month = 12

# weeks_december, worked_days_per_week_december = worked_days_per_week(year, month)
# week_number_december = get_week_number_for_december(year)

# print(f"Week number for month {month} in {year}: {week_number_december}")
# print(f"Worked days per week in December: {worked_days_per_week_december // weeks_december}")



#--------------------------------------------------------------

from datetime import datetime, timedelta
import calendar

def get_week_number(year, month, day):
    date = datetime(year, month, day)
    week_number = date.strftime("%U")
    return int(week_number) + 1  # Adjust to start from 1

def count_work_days_in_month(year, month):
    # Get the first day of the month
    first_day = datetime(year, month, 1)

    # Initialize counters
    work_days_per_week = {week: {"count": 0, "months": set()} for week in range(1, 54)}  # Adjust the range

    # Loop through each day in the month
    for day in range(1, calendar.monthrange(year, month)[1] + 1):
        current_day = datetime(year, month, day)
        
        # Check if the day is a weekday (Monday to Friday)
        if current_day.weekday() < 5:
            week_number = get_week_number(year, month, day)
            work_days_per_week[week_number]["count"] += 1
            work_days_per_week[week_number]["months"].add(month)

    return work_days_per_week

year = 2024

# Initialize counters
total_work_days_per_week = {week: {"count": 0, "months": set()} for week in range(1, 54)}  

for month in range(1, 13):
    work_days_per_week = count_work_days_in_month(year, month)

    # Accumulate the counts and track the months for each week across all months
    for week, data in work_days_per_week.items():
        total_work_days_per_week[week]["count"] += data["count"]
        total_work_days_per_week[week]["months"].update(data["months"])

# Print the results
print("Work days per week for the year 2024:")
for week, data in total_work_days_per_week.items():
    months = data["months"]
    if len(months) > 1:
        month_counts = {month: 0 for month in months}
        for month in data["months"]:
            month_counts[month] = count_work_days_in_month(year, month)[week]["count"]
        print(f"Week {week}: {', '.join(f'{calendar.month_name[month]}: {count} days' for month, count in month_counts.items())}")
    else:
        print(f"Week {week}: {data['count']} days")

    
