CREATE TABLE Teams (
    country CHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    goals INT DEFAULT 0,
    penalties INT DEFAULT 0
);

CREATE TABLE Matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venue VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    attendance INT,
    stage_name VARCHAR(50),
    home_team_country CHAR(3),
    away_team_country CHAR(3),
    datetime DATETIME,
    winner VARCHAR(50),
    winner_code CHAR(3),
    last_checked_at DATETIME,
    last_changed_at DATETIME,
    FOREIGN KEY (home_team_country) REFERENCES Teams(country),
    FOREIGN KEY (away_team_country) REFERENCES Teams(country)
);

--JS Model
model Team {
  country  String  @id @default(cuid()) @db.Char(3) // Primary Key
  name     String
  goals    Int     @default(0)
  penalties Int     @default(0)
  matchesHome Match[] @relation("HomeTeam")
  matchesAway Match[] @relation("AwayTeam")
}

model Match {
  id                Int      @id @default(autoincrement()) // Auto increment ID
  venue             String
  location          String
  status            String
  attendance        Int?
  stage_name        String?
  home_team_country String?  @db.Char(3)
  away_team_country String?  @db.Char(3)
  datetime          DateTime
  winner            String?
  winner_code       String?  @db.Char(3)
  last_checked_at   DateTime?
  last_changed_at   DateTime?
  
  homeTeam         Team?   @relation("HomeTeam", fields: [home_team_country], references: [country])
  awayTeam         Team?   @relation("AwayTeam", fields: [away_team_country], references: [country])
}

-- https://worldcupjson.net/matches/?by_date=ASC
[
  {
    "id": 1,
    "venue": "Al Bayt Stadium",
    "location": "Al Khor",
    "status": "completed",
    "attendance": "67372",
    "stage_name": "First stage",
    "home_team_country": "QAT",
    "away_team_country": "ECU",
    "datetime": "2022-11-20T16:00:00Z",
    "winner": "Ecuador",
    "winner_code": "ECU",
    "home_team": {
      "country": "QAT",
      "name": "Qatar",
      "goals": 0,
      "penalties": 0
    },
    "away_team": {
      "country": "ECU",
      "name": "Ecuador",
      "goals": 2,
      "penalties": 0
    },
    "last_checked_at": "2023-01-01T10:16:03Z",
    "last_changed_at": "2023-01-01T10:16:03Z"
  },
  {
    "id": 63,
    "venue": "Khalifa International Stadium",
    "location": "Ar-Rayyan",
    "status": "completed",
    "attendance": "44137",
    "stage_name": "Play-off for third place",
    "home_team_country": "CRO",
    "away_team_country": "MAR",
    "datetime": "2022-12-17T15:00:00Z",
    "winner": "Croatia",
    "winner_code": "CRO",
    "home_team": {
      "country": "CRO",
      "name": "Croatia",
      "goals": 2,
      "penalties": 0
    },
    "away_team": {
      "country": "MAR",
      "name": "Morocco",
      "goals": 1,
      "penalties": 0
    },
    "last_checked_at": "2023-01-01T10:29:00Z",
    "last_changed_at": "2023-01-01T10:29:00Z"
  },
  {
    "id": 64,
    "venue": "Lusail Stadium",
    "location": "Al Daayen",
    "status": "completed",
    "attendance": "88966",
    "stage_name": "Final",
    "home_team_country": "ARG",
    "away_team_country": "FRA",
    "datetime": "2022-12-18T15:00:00Z",
    "winner": "Argentina",
    "winner_code": "ARG",
    "home_team": {
      "country": "ARG",
      "name": "Argentina",
      "goals": 3,
      "penalties": 4
    },
    "away_team": {
      "country": "FRA",
      "name": "France",
      "goals": 3,
      "penalties": 2
    },
    "last_checked_at": "2023-01-01T09:29:00Z",
    "last_changed_at": "2023-01-01T09:29:00Z"
  }
]