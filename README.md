# COVID-19 Vaccine Supply Chain

## 1. Goal :

Design and implement a system that solves a known problem of trust in the COVID-19 vaccine supply chain using Blockchain.

## 2. Vaccine Cold Chain:

Manufacturer -> Distributor(global) -> Storage facility(National) -> Distributor(Local) -> Immunizer(Doctors etc) -> Traveller -> Border Agent

## 3. System Actors :

a. Manufacturer:<br />
-> Process raw materials into vaccines.<br /><br />
b. Distributor: <br />
-> transports vaccines between locations.<br /><br />
c. Inspector: <br />
-> performs quality checks on vaccines. <br />
-> performs quality checks on manufacturing plants.<br /><br />
d. Storage Facility: <br />
-> store vaccines in cold temperatures <br /><br />
e. Immunizer (the doctors, nurses)
-> vaccinates people. <br />
-> provides vaccine passport/certificates.<br /><br />
f. Traveller (the patient):<br />
-> receives vaccine.<br />
-> receives vaccine certificate.<br />
-> presents vaccine certificate at the border of the destination country<br /><br />
g. Border Agent:<br />
verifies the vaccine certificates/passports<br /><br />

## Problems and Solutions:

### Problem: Vaccine passports can be falsified

### Solution: Cryptographically verify using on-chain data

<br /> <br />

### Problem: Key facilities may not meet quality standards

### Solution: Publish inspection results to blockchain and Verify presented inspection results.

<br /> <br />

### Problem: Vaccine passports may not be recognized by destination countries

### Solution: Verify signatures in presented certificates
