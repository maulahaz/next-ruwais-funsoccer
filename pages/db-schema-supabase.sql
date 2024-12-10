CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    team_alias VARCHAR(50),
    team_code VARCHAR(50),
    captain VARCHAR(100),
    motto VARCHAR(255),
    flag_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    match_datetime TIMESTAMP NOT NULL,
    home_team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    stage_name VARCHAR(100),
    season VARCHAR(100),
    venue VARCHAR(255),
    home_team_goals INT DEFAULT 0,
    away_team_goals INT DEFAULT 0,
    status VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    goals_scored INT DEFAULT 0,
    yellow_card INT DEFAULT 0,
    red_card INT DEFAULT 0,
    match_id INT REFERENCES matches(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);