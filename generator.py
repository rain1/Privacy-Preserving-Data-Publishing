#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
from random import randrange

table_xy = "name,last name,age,gender,city,disease\n"
table_diasese = "name,last name,age,gender,city,diasese\n"
table_job = "name,last name,age,gender,city,job\n"

genders = ["Male", "Female"]
#http://nameberry.com/popular_names/US
girls = ["Emma", "Olivia", "Sophia", "Ava", "Isabella", "Abigal"]
boys =  ["Noah", "Laim", "Mason", "Jacob", "Willia", "Ethan", "Daniel"]
#http://www.ranker.com/list/list-of-common-diseases-most-common-illnesses/diseases-and-medications-info
#http://www.medicinenet.com/diseases_and_conditions/a
diaseses = ["Acne", "Cancer", "Dandruff", "Epilepsy", "Asthma", "Hair Loss"]
#http://www.studentartguide.com/articles/art-careers-list
jobs = ["Systems analyst", "Programmer", "System admin", "IT manager", "Designer", "Printmaker"]

cities = ["Tallinn", "Rapla", "Vändra", "Türi", "Paide", "Põltsamaa", "Viljandi", "Elva", "Tartu", "Jõgeva", "Viljandi"]

#http://www.infoplease.com/ipa/A0778413.html
last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"]

table_person = "id,name,last name,age,gender\n"
table_job_rel = "id,job\n"


for i in range(0,100):
    gender = random.choice(genders)
    if(gender=="Male"):
        name =  random.choice(boys)
    else:
        name = random.choice(girls)
    last_name = random.choice(last_names)
    job = random.choice(jobs)
    diasese = random.choice(diaseses)
    age = num_diaseses = randrange(20,50)
    num_diaseses = randrange(1,4)
    city = random.choice(cities)
    for j in range(0,num_diaseses):
        table_xy += str(name)  + "," + str(last_name) + "," + str(age) + "," + gender + "," + city + "," + random.choice(diaseses) + "\n"

    if i < 20:
        table_diasese +=  str(name) + "," + str(last_name) + "," + str(age) + "," + gender + "," + city + "," + diasese + "\n"
        table_job += str(name) + "," + str(last_name) + "," + str(age) + "," + gender + "," + city + "," + job + "\n"
        table_job_rel += str(i) + "," + str(job) + "\n"
        table_person += str(i)+ "," + str(name)  + "," + str(last_name) + "," + str(age) + "," + gender + "\n"


"""
with open("src/main/resources/schema/diasese_xy.csv","w") as f:
    f.write(table_xy)

with open("src/main/resources/schema/diasese.csv","w") as f:
    f.write(table_diasese)

with open("src/main/resources/schema/job.csv","w") as f:
    f.write(table_job)

with open("src/main/resources/schema/job_rel.csv","w") as f:
    f.write(table_job_rel)

with open("src/main/resources/schema/person_rel.csv","w") as f:
    f.write(table_person)
"""

with open("src/main/resources/schema/diasese_xy.csv","w") as f:
    f.write(table_xy)

#print(table_xy)