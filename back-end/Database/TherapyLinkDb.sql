create database TherapyLink
use TherapyLink
use AppointEase
CREATE TABLE AspNetRoles (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    Name NVARCHAR(256) NULL,
    NormalizedName NVARCHAR(256) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL
);

CREATE TABLE AspNetUsers (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    Surname NVARCHAR(MAX) NULL,
    Role NVARCHAR(MAX) NOT NULL,
    Address NVARCHAR(MAX) NOT NULL,
    PhotoData NVARCHAR(MAX) NULL,
    PhotoFormat NVARCHAR(MAX) NULL,
    UserName NVARCHAR(256) NULL,
    NormalizedUserName NVARCHAR(256) NULL,
    Email NVARCHAR(256) NULL,
    NormalizedEmail NVARCHAR(256) NULL,
    EmailConfirmed BIT NOT NULL,
    PasswordHash NVARCHAR(MAX) NULL,
    SecurityStamp NVARCHAR(MAX) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL,
    PhoneNumber NVARCHAR(MAX) NULL,
    PhoneNumberConfirmed BIT NOT NULL,
    TwoFactorEnabled BIT NOT NULL,
    LockoutEnd DATETIMEOFFSET NULL,
    LockoutEnabled BIT NOT NULL,
    AccessFailedCount INT NOT NULL
);

CREATE TABLE Messages (
    MessageId NVARCHAR(450) NOT NULL PRIMARY KEY,
    SenderId NVARCHAR(MAX) NOT NULL,
    ReceiverId NVARCHAR(MAX) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Timestamp DATETIME2 NOT NULL
);

CREATE TABLE AspNetRoleClaims (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    RoleId NVARCHAR(450) NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    FOREIGN KEY (RoleId) REFERENCES AspNetRoles(Id) ON DELETE CASCADE
);

CREATE TABLE Admin (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    PersonalNumber INT NOT NULL,
    DateOfBirth DATE NOT NULL,
    FOREIGN KEY (Id) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE AspNetUserClaims (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE AspNetUserLogins (
    LoginProvider NVARCHAR(450) NOT NULL,
    ProviderKey NVARCHAR(450) NOT NULL,
    ProviderDisplayName NVARCHAR(MAX) NULL,
    UserId NVARCHAR(450) NOT NULL,
    PRIMARY KEY (LoginProvider, ProviderKey),
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE AspNetUserRoles (
    UserId NVARCHAR(450) NOT NULL,
    RoleId NVARCHAR(450) NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (RoleId) REFERENCES AspNetRoles(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE AspNetUserTokens (
    UserId NVARCHAR(450) NOT NULL,
    LoginProvider NVARCHAR(450) NOT NULL,
    Name NVARCHAR(450) NOT NULL,
    Value NVARCHAR(MAX) NULL,
    PRIMARY KEY (UserId, LoginProvider, Name),
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE Clinic (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    Location NVARCHAR(MAX) NULL,
    CreatedDate DATE NULL,
    OtherDetails NVARCHAR(MAX) NULL,
    FOREIGN KEY (Id) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE ConnectionRequests (
    RequestId NVARCHAR(450) NOT NULL PRIMARY KEY,
    FromId NVARCHAR(450) NOT NULL,
    ToId NVARCHAR(450) NOT NULL,
    dateTimestamp DATETIME2 NOT NULL,
    FOREIGN KEY (FromId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE,
    FOREIGN KEY (ToId) REFERENCES AspNetUsers(Id)
);

CREATE TABLE Connections (
    ConnectionId NVARCHAR(450) NOT NULL PRIMARY KEY,
    FromId NVARCHAR(450) NOT NULL,
    ToId NVARCHAR(450) NOT NULL,
    dateTimestamp DATETIME2 NOT NULL,
    FOREIGN KEY (FromId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE,
    FOREIGN KEY (ToId) REFERENCES AspNetUsers(Id)
);

CREATE TABLE Patient (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    PersonalNumber INT NOT NULL,
    Gender NVARCHAR(MAX) NOT NULL,
    DateOfBirth DATE NOT NULL,
    FOREIGN KEY (Id) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE Doctor (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    PersonalNumber INT NOT NULL,
    Specialisation NVARCHAR(MAX) NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    ClinicId NVARCHAR(450) NOT NULL,
    FOREIGN KEY (Id) REFERENCES AspNetUsers(Id) ON DELETE CASCADE,
    FOREIGN KEY (ClinicId) REFERENCES Clinic(Id)
);

CREATE TABLE AppointmentSlot (
    AppointmentSlotId NVARCHAR(450) NOT NULL PRIMARY KEY,
    DoctorId NVARCHAR(450) NOT NULL,
    ClinicId NVARCHAR(450) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsBooked BIT NOT NULL,
    Date DATE NOT NULL,
    FOREIGN KEY (DoctorId) REFERENCES Doctor(Id),
    FOREIGN KEY (ClinicId) REFERENCES Clinic(Id) ON DELETE CASCADE
);

CREATE TABLE BookAppointment (
    BookAppointmentId NVARCHAR(450) NOT NULL PRIMARY KEY,
    AppointmentSlotId NVARCHAR(450) NOT NULL,
    PatientId NVARCHAR(450) NOT NULL,
    MeetingReason NVARCHAR(MAX) NOT NULL,
    MeetingRequestDescription NVARCHAR(MAX) NOT NULL,
    BookAppointmentStatus NVARCHAR(MAX) NOT NULL,
    ResponseDateTime DATETIME2 NULL,
    FOREIGN KEY (AppointmentSlotId) REFERENCES AppointmentSlot(AppointmentSlotId) ON DELETE CASCADE,
    FOREIGN KEY (PatientId) REFERENCES Patient(Id)
);

CREATE TABLE Appointments (
    AppointmentId NVARCHAR(450) NOT NULL PRIMARY KEY,
    BookAppointmentId NVARCHAR(450) NOT NULL,
    Status NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (BookAppointmentId) REFERENCES BookAppointment(BookAppointmentId) ON DELETE CASCADE
);

-- Insert data into AspNetRoles table
INSERT INTO AspNetRoles (Id, ConcurrencyStamp, Name, NormalizedName)
VALUES 
    ('1b6b7816-6e48-4d7f-977c-7231e8a8e497', '1', 'Admin', 'Admin'),
    ('47d56bcb-b3d5-4d57-921c-aab7188a6da5', '4', 'Patient', 'Patient'),
    ('ab629d97-eb6a-4ec7-a12d-f50dee0e4c55', '2', 'Clinic', 'Clinic'),
    ('e3bbab11-e019-4221-98fb-c4bd049c8438', '3', 'Doctor', 'Doctor');

-- Create indexes
CREATE INDEX IX_Appointments_BookAppointmentId ON Appointments(BookAppointmentId);
CREATE INDEX IX_AppointmentSlot_ClinicId ON AppointmentSlot(ClinicId);
CREATE INDEX IX_AppointmentSlot_DoctorId ON AppointmentSlot(DoctorId);
CREATE INDEX IX_AspNetRoleClaims_RoleId ON AspNetRoleClaims(RoleId);
CREATE UNIQUE INDEX RoleNameIndex ON AspNetRoles(NormalizedName) WHERE NormalizedName IS NOT NULL;
CREATE INDEX IX_AspNetUserClaims_UserId ON AspNetUserClaims(UserId);
CREATE INDEX IX_AspNetUserLogins_UserId ON AspNetUserLogins(UserId);
CREATE INDEX IX_AspNetUserRoles_RoleId ON AspNetUserRoles(RoleId);
CREATE INDEX EmailIndex ON AspNetUsers(NormalizedEmail);
CREATE UNIQUE INDEX UserNameIndex ON AspNetUsers(NormalizedUserName) WHERE NormalizedUserName IS NOT NULL;
CREATE INDEX IX_BookAppointment_AppointmentSlotId ON BookAppointment(AppointmentSlotId);
CREATE INDEX IX_BookAppointment_PatientId ON BookAppointment(PatientId);
CREATE INDEX IX_ConnectionRequests_FromId ON ConnectionRequests(FromId);
CREATE INDEX IX_ConnectionRequests_ToId ON ConnectionRequests(ToId);
CREATE INDEX IX_Connections_FromId ON Connections(FromId);
CREATE INDEX IX_Connections_ToId ON Connections(ToId);
CREATE INDEX IX_Doctor_ClinicId ON Doctor(ClinicId);
