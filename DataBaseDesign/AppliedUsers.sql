CREATE TABLE AppliedUsers (
ApplyID MEDIUMINT NOT NULL AUTO_INCREMENT ,
MailAddress text NOT NULL,
SurName text NOT NULL,
GivingName text NOT NULL,
TelNumber text,
PostCode text,
Address1 text,
Address2 text,
Gender int NOT NULL,
Context int NOT NULL,
ContextDetail text,
RegistrationDate datetime,
UpDateDate datetime,
PRIMARY KEY(ApplyID)
)

