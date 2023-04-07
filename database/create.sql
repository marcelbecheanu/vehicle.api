DROP DATABASE bid WITH (FORCE);
CREATE DATABASE bid;


-- Create Tables --
CREATE TABLE IF NOT EXISTS "Country" (
    "CountryID" SERIAL PRIMARY KEY,
    "CountryName" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "District" (
    "DistrictID" SERIAL PRIMARY KEY,
    "CountryID" INT NOT NULL,
    "DistrictName" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Locality" (
    "LocalityID" SERIAL PRIMARY KEY,
    "DistrictID" INT NOT NULL,
    "LocalityName" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Address" (
    "AddressID" SERIAL PRIMARY KEY,
    "LocalityID" INT NOT NULL,
    "AddressName" VARCHAR(120) UNIQUE NOT NULL,
    "AddressPostalCode" VARCHAR(25) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserAddress" (
    "UserID" INT NOT NULL,
    "AddressID" INT NOT NULL,
    "AddressName" VARCHAR(60) NOT NULL,
    "AddressIsPrimary" BIT DEFAULT '0' NOT NULL
);

CREATE TABLE IF NOT EXISTS "Rule" (
    "RuleID" SERIAL PRIMARY KEY,
    "RuleName" VARCHAR(60) UNIQUE NOT NULL,
    "RuleDescription" VARCHAR(120) NOT NULL,
    "RuleCode" VARCHAR(60) UNIQUE NOT NULL,
    "RuleCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "RuleModifiedAt" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Group" (
    "GroupID" SERIAL PRIMARY KEY,
    "GroupName" VARCHAR(60) UNIQUE NOT NULL,
    "GroupDescription" VARCHAR(120) NOT NULL,
    "GroupCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "GroupModifiedAt" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RuleGroup" (
    "RuleID" INT,
    "GroupID" INT,
    "RuleGroupCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "RuleGroupModifiedAt" TIMESTAMP,
    PRIMARY KEY ("RuleID", "GroupID")
);

CREATE TABLE IF NOT EXISTS "UserGroup" (
    "UserID" INT,
    "GroupID" INT,
    "UserGroupCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UserGroupModifiedAt" TIMESTAMP,
    PRIMARY KEY ("UserID", "GroupID")
);

CREATE TABLE IF NOT EXISTS "ContactType" (
    "ContactTypeID" SERIAL PRIMARY KEY,
    "ContactTypeName" VARCHAR(60) UNIQUE NOT NULL,
    "ContactRegex" VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Contact" (
    "UserID" INT NOT NULL,
    "ContactTypeID" INT NOT NULL,
    "ContactName" VARCHAR(60) NOT NULL,
    "Contact" VARCHAR(256) NOT NULL,
    "ContactIsPrimary" BIT DEFAULT '0' NOT NULL
);

CREATE TABLE IF NOT EXISTS "Authenticator" (
    "AuthenticatorID" SERIAL PRIMARY KEY,
    "AuthenticatorName" VARCHAR(60) UNIQUE NOT NULL,
    "AuthenticatorCode" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserAuthenticator" (
    "UserID" INT,
    "AuthenticatorID" INT,
    "UserAuthenticatorSecret" VARCHAR(256) UNIQUE NOT NULL,
    "UserAuthenticatorCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UserAuthenticatorModifiedAt" TIMESTAMP,
    PRIMARY KEY ("UserID", "AuthenticatorID")
);

CREATE TABLE IF NOT EXISTS "User" (
    "UserID" SERIAL PRIMARY KEY,
    "GenderID" INT,
    "UserEmail" VARCHAR(256) UNIQUE NOT NULL,
    "UserFullName" VARCHAR(120) NOT NULL,
    "UserPassword" VARCHAR(128) NOT NULL,
    "UserBirthdate" DATE NOT NULL,
    "UserIsActive" BIT DEFAULT '0',
    "UserCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UserModifiedAt" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Gender" (
    "GenderID" SERIAL PRIMARY KEY,
    "GenderName" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "LoginActivity" (
  "LoginActivityID" SERIAL PRIMARY KEY,
  "UserID" INT NOT NULL,
  "LoginActivityIP" VARCHAR(60),
  "LoginActivityGeoLoc" VARCHAR(60),
  "LoginActivityDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE IF NOT EXISTS "Company" (
  "CompanyID" SERIAL PRIMARY KEY,
  "AddressID" INT NOT NULL,
  "UserID" INT NOT NULL,
  "CompanyNIF" BIGINT UNIQUE NOT NULL,
  "CompanyName" VARCHAR(60) UNIQUE NOT NULL,
  "CompanyDescription" VARCHAR(120) UNIQUE NOT NULL,
  "CompanyVerified" BIT DEFAULT '0' NOT NULL,
  "CompanyCreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "CompanyModifiedAt" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CompanyEmployee" (
  "CompanyID" INT,
  "UserID" INT,
  PRIMARY KEY ("CompanyID", "UserID")
);

CREATE TABLE IF NOT EXISTS "VehicleType" (
  "VehicleTypeID" SERIAL PRIMARY KEY,
  "VehicleTypeName" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "VehicleModel" (
  "VehicleModelID" SERIAL PRIMARY KEY,
  "VehicleBrandID" INT NOT NULL,
  "VehicleTypeID" INT NOT NULL,
  "VehicleModelName" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "VehicleBrand" (
  "VehicleBrandID" SERIAL PRIMARY KEY,
  "VehicleBrandName" VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "VehicleFuelType" (
  "VehicleFuelTypeID" SERIAL PRIMARY KEY,
  "VehicleTypeID" INT NOT NULL,
  "VehicleFuelType" VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS "VehicleTransmission" (
  "VehicleTransmissionID" SERIAL PRIMARY KEY,
  "VehicleTransmissionName" VARCHAR(60) UNIQUE NOT NULL,
  "VehicleTransmissionDescription" VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Vehicle" (
  "VehicleID" SERIAL PRIMARY KEY,
  "AddressID" INT NOT NULL,
  "UserID" INT NOT NULL,
  "CompanyID" INT,
  "VehicleModelID" INT NOT NULL,
  "VehicleFuelTypeID" INT NOT NULL,
  "VehicleTransmissionID" INT NOT NULL,
  "VehicleTitle" VARCHAR(120) NOT NULL,
  "VehicleDescription" VARCHAR(512) NOT NULL,
  "VehicleYear" INT NOT NULL,
  "VehicleMileage" INT NOT NULL,
  "VehicleNumberOfPorts" INT,
  "VehicleEnginePower" INT,
  "VehicleMaximumSpeed" INT,
  "VehicleTorque" INT,
  "VehicleDisplacement" INT,
  "VehicleCylinders" INT,
  "VehicleViews" INT NOT NULL DEFAULT (0),
  "VehicleCreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "VehicleModifiedAt" TIMESTAMP
);


CREATE TABLE IF NOT EXISTS "VehicleAdditionalCategory" (
  "VehicleAdditionalCategoryID" SERIAL PRIMARY KEY,
  "VehicleAdditionalCategoryName" VARCHAR(60) UNIQUE NOT NULL,
  "VehicleAdditionalCategoryDescription" VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "VehicleAdditional" (
  "VehicleAdditionalID" SERIAL PRIMARY KEY,
  "VehicleTypeID" INT NOT NULL,
  "VehicleAdditionalCategoryID" INT NOT NULL,
  "VehicleAdditionalName" VARCHAR(60) UNIQUE NOT NULL,
  "VehicleAdditionalDescription" VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "VehicleVehicleAdditional" (
  "VehicleID" INT,
  "VehicleAdditionalID" INT,
  PRIMARY KEY ("VehicleID", "VehicleAdditionalID")
);

CREATE TABLE IF NOT EXISTS "UserSavedProfile" (
  "UserSavedProfileID" SERIAL,
  "VehicleID" INT NOT NULL,
  "UserID" INT NOT NULL,
  "UserSavedProfileCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("UserSavedProfileID", "VehicleID", "UserID")
);

-- FOREIGN KEYS --

ALTER TABLE "District" ADD CONSTRAINT "FK_District_Country" FOREIGN KEY ("CountryID") REFERENCES "Country" ("CountryID");
ALTER TABLE "Locality" ADD CONSTRAINT "FK_Locality_District" FOREIGN KEY ("DistrictID") REFERENCES "District" ("DistrictID");
ALTER TABLE "Address" ADD CONSTRAINT "FK_Address_Locality" FOREIGN KEY ("LocalityID") REFERENCES "Locality" ("LocalityID");

ALTER TABLE "RuleGroup" ADD CONSTRAINT "FK_RuleGroup_Rule" FOREIGN KEY ("RuleID") REFERENCES "Rule" ("RuleID");
ALTER TABLE "RuleGroup" ADD CONSTRAINT "FK_RuleGroup_Group" FOREIGN KEY ("GroupID") REFERENCES "Group" ("GroupID");

ALTER TABLE "UserAddress" ADD CONSTRAINT "FK_UserAddress_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");
ALTER TABLE "UserAddress" ADD CONSTRAINT "FK_UserAddress_Address" FOREIGN KEY ("AddressID") REFERENCES "Address" ("AddressID");
ALTER TABLE "UserGroup" ADD CONSTRAINT "FK_UserGroup_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");
ALTER TABLE "UserGroup" ADD CONSTRAINT "FK_UserGroup_Group" FOREIGN KEY ("GroupID") REFERENCES "Address" ("AddressID");

ALTER TABLE "Contact" ADD CONSTRAINT "FK_Contact_ContactType" FOREIGN KEY ("ContactTypeID") REFERENCES "ContactType" ("ContactTypeID");
ALTER TABLE "Contact" ADD CONSTRAINT "FK_Contact_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");

ALTER TABLE "UserAuthenticator" ADD CONSTRAINT "FK_UserAuthenticator_Authenticator" FOREIGN KEY ("AuthenticatorID") REFERENCES "Authenticator" ("AuthenticatorID");
ALTER TABLE "UserAuthenticator" ADD CONSTRAINT "FK_UserAuthenticator_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");

ALTER TABLE "User" ADD CONSTRAINT "FK_User_Gender" FOREIGN KEY ("GenderID") REFERENCES "Gender" ("GenderID");

ALTER TABLE "LoginActivity" ADD CONSTRAINT "FK_LoginActivity_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");

ALTER TABLE "CompanyEmployee" ADD CONSTRAINT "FK_CompanyEmployee_Company" FOREIGN KEY ("CompanyID") REFERENCES "Company" ("CompanyID");
ALTER TABLE "CompanyEmployee" ADD CONSTRAINT "FK_CompanyEmployee_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");

ALTER TABLE "Company" ADD CONSTRAINT "FK_Company_Address" FOREIGN KEY ("AddressID") REFERENCES "Address" ("AddressID");
ALTER TABLE "Company" ADD CONSTRAINT "FK_Company_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");

ALTER TABLE "UserSavedProfile" ADD CONSTRAINT "FK_UserSavedProfile_Vehicle" FOREIGN KEY ("VehicleID") REFERENCES "Vehicle" ("VehicleID");
ALTER TABLE "UserSavedProfile" ADD CONSTRAINT "FK_UserSavedProfile_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");

ALTER TABLE "VehicleAdditional" ADD CONSTRAINT "FK_VehicleAdditional_VehiclyType" FOREIGN KEY ("VehicleTypeID") REFERENCES "VehicleType" ("VehicleTypeID");
ALTER TABLE "VehicleAdditional" ADD CONSTRAINT "FK_VehicleAdditional_VehicleAdditionalCategory" FOREIGN KEY ("VehicleAdditionalCategoryID") REFERENCES "VehicleAdditionalCategory" ("VehicleAdditionalCategoryID");

ALTER TABLE "VehicleVehicleAdditional" ADD CONSTRAINT "FK_VehicleVehicleAdditional_Vehicle" FOREIGN KEY ("VehicleID") REFERENCES "Vehicle" ("VehicleID");
ALTER TABLE "VehicleVehicleAdditional" ADD CONSTRAINT "FK_VehicleVehicleAdditional_VehicleAdditional" FOREIGN KEY ("VehicleAdditionalID") REFERENCES "VehicleAdditional" ("VehicleAdditionalID");

ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Vehicle_Address" FOREIGN KEY ("AddressID") REFERENCES "Address" ("AddressID");
ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Vehicle_User" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID");
ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Vehicle_Company" FOREIGN KEY ("CompanyID") REFERENCES "Company" ("CompanyID");
ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Vehicle_VehicleTransmission" FOREIGN KEY ("VehicleTransmissionID") REFERENCES "VehicleTransmission" ("VehicleTransmissionID");
ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Vehicle_VehicleFuelType" FOREIGN KEY ("VehicleFuelTypeID") REFERENCES "VehicleFuelType" ("VehicleFuelTypeID");
ALTER TABLE "Vehicle" ADD CONSTRAINT "FK_Vehicle_VehicleModel" FOREIGN KEY ("VehicleModelID") REFERENCES "VehicleModel" ("VehicleModelID");

ALTER TABLE "VehicleFuelType" ADD CONSTRAINT "FK_VehicleFuelType_VehicleType" FOREIGN KEY ("VehicleTypeID") REFERENCES "VehicleType" ("VehicleTypeID");

ALTER TABLE "VehicleModel" ADD CONSTRAINT "FK_VehicleModel_VehicleType" FOREIGN KEY ("VehicleTypeID") REFERENCES "VehicleType" ("VehicleTypeID");
ALTER TABLE "VehicleModel" ADD CONSTRAINT "FK_VehicleModel_VehicleBrand" FOREIGN KEY ("VehicleBrandID") REFERENCES "VehicleBrand" ("VehicleBrandID");