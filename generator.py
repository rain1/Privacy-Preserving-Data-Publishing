#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
from random import randrange

table_xy = "name,last name,age,gender,city,disease\n"
table_disease = "name,last name,age,gender,city,disease\n"
table_job = "name,last name,age,gender,city,job\n"
table_job = "id,age,gender,city,job,salary\n"

genders = ["Male", "Female"]
# http://nameberry.com/popular_names/US
girls = ["Emma", "Olivia", "Sophia", "Ava", "Isabella", "Abigal", "Emily", "Charlotte", "Harper", "Madison", "Amelia",
         "Elizabeth"]
boys = ["Noah", "Laim", "Mason", "Jacob", "Willia", "Ethan", "Daniel", "Alexander", "Michael", "Benjamin", "Elijah",
        "Aiden"]
# http://www.ranker.com/list/list-of-common-diseases-most-common-illnesses/diseases-and-medications-info
# http://www.medicinenet.com/diseases_and_conditions/a
diseases = ["Acne", "Cancer", "Dandruff", "Epilepsy", "Asthma", "Hair Loss"]
# http://www.studentartguide.com/articles/art-careers-list
jobs2 = ["Systems analyst", "Programmer", "System admin", "IT manager", "Designer", "Printmaker", "Sculptor", "Artist",
        "Physician", "Nurse", "Therapist", "Pharmacist", "Dentist", "Technician", "Pathologist", "Psychiatric",
        "Surgeon", "Novelist", "Painter", "Engineer", "Supervisor", "Support", "Architect", "Technical Lead"]

jobs = ["Programmer"]*50
jobs += ["System admin"]*50
jobs += ["Designer"]*50
jobs += ["Printmaker"]*50
jobs += ["Artist"]*50
jobs += ["Physician"]*50
jobs += ["Therapist"]*50
jobs += ["Painter"]*50
jobs += ["Engineer"]*50
jobs += ["Supervisor"]*35
jobs += ["Support"]*15

cities = ["Tallinn", "Rapla", "Vändra", "Türi", "Paide", "Põltsamaa", "Viljandi", "Elva", "Tartu", "Jõgeva", "Viljandi"]

# http://www.infoplease.com/ipa/A0778413.html
last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
              "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez",
              "Robinson"]

table_person = "id,name,last name,age,gender\n"
table_job_rel = "id,job\n"

used_names = []


def generateName(gender):
    global used_names
    while True:
        if (gender == "Male"):
            name = random.choice(boys)
        else:
            name = random.choice(girls)
        last_name = random.choice(last_names)
        if (not (name + last_name in used_names)):
            used_names.append(name + last_name)
            return name, last_name


for i in range(0, 400):
    gender = random.choice(genders)

    #name, last_name = generateName(gender)

    #job = random.choice(jobs)
    job = jobs.pop()
    disease = random.choice(diseases)
    age = randrange(20, 70)
    salary = (randrange(1000, 3000)/100)*100
    num_diseases = randrange(1, 4)
    city = random.choice(cities)
    #for j in range(0, num_diseases):
    #    table_xy += str(name) + "," + str(last_name) + "," + str(age) + "," + gender + "," + city + "," + random.choice(
    #            diseases) + "\n"

    if i < 1500:
        #table_disease += str(name) + "," + str(last_name) + "," + str(
        #        age) + "," + gender + "," + city + "," + disease + "\n"
        #table_job += str(name) + "," + str(last_name) + "," + str(age) + "," + gender + "," + city + "," + job + "\n"
        table_job += str(i) + ","  + str(age) + "," + gender + "," + city + "," + job + "," + str(salary) + "\n"
        #table_job_rel += str(i) + "," + str(job) + "\n"
        #table_person += str(i) + "," + str(name) + "," + str(last_name) + "," + str(age) + "," + gender + "\n"

"""
with open("src/main/resources/schema/disease_xy.csv","w") as f:
    f.write(table_xy)

with open("src/main/resources/schema/disease.csv","w") as f:
    f.write(table_disease)

with open("src/main/resources/schema/job.csv","w") as f:
    f.write(table_job)

with open("src/main/resources/schema/job_rel.csv","w") as f:
    f.write(table_job_rel)

with open("src/main/resources/schema/person_rel.csv","w") as f:
    f.write(table_person)

with open("src/main/resources/schema/disease_xy.csv","w") as f:
    f.write(table_xy)
"""

with open("src/main/resources/schema/Job_Large_Salary.csv", "w") as f:
    f.write(table_job)


    # print(table_xy)
