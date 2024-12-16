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
    attendance INT DEFAULT 0,
    status VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    origin VARCHAR(100),
    photo VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    prev_club VARCHAR(100),
    jersey_num VARCHAR(100),
    goals_scored INT DEFAULT 0,
    yellow_card INT DEFAULT 0,
    red_card INT DEFAULT 0,
    match_id INT REFERENCES matches(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE match_logs (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE SET NULL,
    log_name VARCHAR(100),  --[Goal, Yellow Card, Red Card, Penalty]
    log_datetime TIMESTAMP NOT NULL,  --[Datetime during log]
    player_id INT REFERENCES players(id) ON DELETE SET NULL,  --[Player during log]
);

CREATE TABLE match_files (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),  --Title of file
    file_url VARCHAR(255),  --File can be image or video
    file_type VARCHAR(50),  -- 'image' or 'video'
    match_id INT REFERENCES matches(id) ON DELETE SET NULL,
    player_id INT REFERENCES players(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--Sample data players:
INSERT INTO players (id,name, alias, origin, photo, phone, address, team_id, prev_club, jersey_num, goals_scored, yellow_card, red_card, match_id)
VALUES
    (11,'Andi', 'CR7', 'Portugal', 'https://example.com/CR7.jpg', '1234567890', 'Rua da Liberdade, Lisbon', 1, 'Manchester United', '7', 0, 0, 0, 1),
    (12,'Trias', 'La Pulga', 'Argentina', 'https://example.com/LM10.jpg', '0987654321', 'Avenida de Mayo, Buenos Aires', 5, 'Barcelona', '10', 0, 0, 0, 1),
    (13,'Ari', 'KM', 'France', 'https://example.com/KM.jpg', '5551234567', 'Champs-Élysées, Paris', 5, 'Paris Saint-Germain', '10', 0, 0, 0, 1),
    (14,'Ade Yudis', 'Lewa', 'Poland', 'https://example.com/Lewa.jpg', '9876543210', 'Krakowska, Krakow', 5, 'Bayern Munich', '9', 0, 0, 0, 1),
    (15,'Ditri', 'Mo Salah', 'Egypt', 'https://example.com/MS.jpg', '1112223333', 'Cairo Street, Cairo', 5, 'Liverpool', '11', 0, 0, 0, 1),
    (16,'Deni', 'Neymar', 'Brazil', 'https://example.com/Neymar.jpg', '2223334444', 'Avenida Paulista, São Paulo', 5, 'Paris Saint-Germain', '10', 0, 0, 0, 1),
    (17,'Zamroni', 'HK', 'England', 'https://example.com/HK.jpg', '3334445555', 'Whitechapel Road, London', 5, 'Tottenham Hotspur', '9', 0, 0, 0, 1),
    (18,'Ruli', 'KDB', 'Belgium', 'https://example.com/KDB.jpg', '4445556666', 'Brussels Street, Brussels', 5, 'Manchester City', '17', 0, 0, 0, 1),
    (19,'Satiri', 'Ncing', 'Belgium', 'https://example.com/EH.jpg', '5556667777', 'Antwerp Street, Antwerp', 5, 'Real Madrid', '10', 0, 0, 0, 1),
    (20,'Purnomo', 'EH', 'Belgium', 'https://example.com/EH.jpg', '5556667777', 'Antwerp Street, Antwerp', 5, 'Real Madrid', '10', 0, 0, 0, 1),
    (21,'Namir', 'EH', 'Belgium', 'https://example.com/EH.jpg', '5556667777', 'Antwerp Street, Antwerp', 5, 'Real Madrid', '10', 0, 0, 0, 1),
    (22,'Gunawan', 'Abu Fadil', 'Netherlands', 'https://example.com/VVD.jpg', '6667778888', 'Amsterdam Street, Amsterdam', 5, 'Liverpool', '4', 0, 0, 0, 1); 

INSERT INTO players (id, name, alias, origin, photo, phone, address, team_id, prev_club, jersey_num, goals_scored, yellow_card, red_card, match_id)
VALUES
    (23, 'Budi H', 'Budi H', 'Ruwais', 'https://example.com/CR7.jpg', '5551234567', 'Ruwais', 1, 'Manchester United', 7, 0, 0, 0, 3),
    (24, 'Andanawa', 'Andanawa', 'Ruwais', 'https://example.com/LM10.jpg', '5551234567', 'Ruwais', 5, 'Barcelona', 10, 0, 0, 0, 3),
    (25, 'Hermawan', 'Hermawan', 'Ruwais', 'https://example.com/KM.jpg', '5551234567', 'Ruwais', 5, 'Paris Saint-Germain', 10, 0, 0, 0, 3),
    (26, 'Wisnu', 'Wisnu', 'Ruwais', 'https://example.com/Lewa.jpg', '5551234567', 'Ruwais', 5, 'Bayern Munich', 9, 0, 0, 0, 3),
    (27, 'Iip', 'Pojok kanan', 'Ruwais', 'https://example.com/MS.jpg', '5551234567', 'Karang Bolong', 5, 'Liverpool', 11, 0, 0, 0, 3),
    (28, 'Dilianto', 'Dilianto', 'Ruwais', 'https://example.com/Neymar.jpg', '5551234567', 'Ruwais', 5, 'Paris Saint-Germain', 10, 0, 0, 0, 3),
    (29, 'Subekti', 'Subekti', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Tottenham Hotspur', 9, 0, 0, 0, 3),
    (30, 'Eka', 'Eka', 'Ruwais', 'https://example.com/KDB.jpg', '5551234567', 'Cilgon', 5, 'Manchester City', 17, 0, 0, 0, 3),
    (31, 'Ferdi', 'Ferdi', 'Ruwais', 'https://example.com/EH.jpg', '5551234567', 'Ruwais', 5, 'Real Madrid', 10, 0, 0, 0, 3),
    (32, 'Khaidir', 'Khaidir', 'Ruwais', 'https://example.com/CR7.jpg', '5551234567', 'Ruwais', 5, 'Real Madrid', 10, 0, 0, 0, 3),
    (33, 'Zain', 'Zain Basamo', 'Ruwais', 'https://example.com/LM10.jpg', '5551234567', 'Ruwais', 5, 'Real Madrid', 10, 0, 0, 0, 3),
    (34, 'Firman', 'Firman', 'Ruwais', 'https://example.com/KM.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (35, 'Herman', 'Herman', 'Ruwais', 'https://example.com/Lewa.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (36, 'Eben', 'Eben', 'Ruwais', 'https://example.com/MS.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (37, 'Budi S', 'Budi S', 'Ruwais', 'https://example.com/Neymar.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (38, 'Karjono', 'Karjono', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (39, 'Asep Nanang', 'Nanang', 'Ruwais', 'https://example.com/KDB.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (40, 'Waluyo', 'Waluyo', 'Ruwais', 'https://example.com/EH.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (41, 'Ivan', 'Ivan', 'Ruwais', 'https://example.com/CR7.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (42, 'Wardaya', 'Wardaya', 'Ruwais', 'https://example.com/LM10.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (43, 'Hasan', 'Hasan', 'Ruwais', 'https://example.com/KM.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (44, 'Mario', 'Mario', 'Ruwais', 'https://example.com/Lewa.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (45, 'Nuraflish', 'Nuraflish', 'Ruwais', 'https://example.com/MS.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (46, 'Ricky G', 'Ricky G', 'Ruwais', 'https://example.com/Neymar.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (47, 'Fauzar', 'Fauzar', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 3),
    (48, 'Namiri', 'Namiri', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 4),
    (49, 'Sabar', 'Sabar', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 4),
    (50, 'Zulkifli', 'Zulkifli', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 4),
    (51, 'Made', 'Made', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 4),
    (52, 'Asgari', 'Asgari', 'Ruwais', 'https://example.com/HK.jpg', '5551234567', 'Ruwais', 5, 'Liverpool', 4, 0, 0, 0, 4);   

INSERT INTO players (name, alias, team_id, jersey_num, position, photo, phone, address, origin, prev_club)
VALUES
    ('Ricky', 'R. Zanetti', 3, 5, 'CB, MF', '64','0512345678', 'Ruwais', '', ''),
    ('Agus', 'AGS', 3, 10, 'MF', '','0512345678', 'Ruwais', '', ''),
    ('Edi Suwarno', 'Edi', 3, 7, 'LM, RM', '','0512345678', 'Ruwais', '', ''),
    ('Ust. Forqun', 'FRQ', 3, 10, 'ST', '','0512345678', 'Ruwais', '', ''),
    ('Pangki', 'PGQ', 3, 10, 'ST', '','0512345678', 'Ruwais', '', ''),
    ('Joel Yahya', 'Joel', 3, 5, 'MF', '','0512345678', 'Ruwais', '', ''),
    ('Hasili', 'HSL', 3, 5, 'MF', '','0512345678', 'Ruwais', '', ''),
    ('Aminudin', 'Amin', 3, 7, 'LM, RM', '','0512345678', 'Ruwais', '', ''),
    ('Emil', 'Kang Emil', 3, 7, 'LM, RM', '','0512345678', 'Ruwais', '', ''),
    ('Sandi', 'SND', 3, 5, 'MF', '','0512345678', 'Ruwais', '', ''),
    ('Budiman', 'BDM', 3, 5, 'MF', '','0512345678', 'Ruwais', '', ''),
    ('Edi Kris', 'Edi', 3, 9, 'ST', '','0512345678', 'Ruwais', '', ''),
    ('Pabeda', 'PBD', 3, 5, 'DF, CB', '','0512345678', 'Ruwais', '', '')
    ;


INSERT INTO match_logs (id, match_id, log_name, log_datetime, player_id)
VALUES
    (2, 1, 'Foul', '2024-11-29 21:30:01', 7),
    (3, 1, 'Goal', '2024-11-29 21:30:02', 12),
    (4, 1, 'Foul', '2024-11-29 21:30:03', 12),
    (5, 1, 'Goal', '2024-11-29 21:30:04', 13),
    (6, 1, 'Foul', '2024-11-29 21:30:05', 13),
    (7, 1, 'Foul', '2024-11-29 21:30:06', 14),
    (8, 1, 'Foul', '2024-11-29 21:30:07', 16),
    (9, 1, 'Foul', '2024-11-29 21:30:07', 22)
    ;    

--Make Function to Fetch Data for Top 10 Players with Most Goals:
CREATE OR REPLACE FUNCTION top_scorer(limit_num integer)
RETURNS TABLE (name text, team text, goals bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT p.name::text, t.team_alias::text, COUNT(ml.id) as goals
  FROM players p
  JOIN match_logs ml ON p.id = ml.player_id
  JOIN teams t ON t.id = p.team_id
  WHERE ml.log_name = 'Goal'
  GROUP BY p.id, p.name, t.team_alias
  ORDER BY goals DESC
  LIMIT limit_num;
END;
$$ LANGUAGE plpgsql;

--Make Function to Get Match Statistic:
CREATE OR REPLACE FUNCTION get_team_stats()
RETURNS TABLE (team_alias text, total_fouls bigint, total_yellow_cards bigint, total_red_cards bigint, total_own_goals bigint, total_penalties bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.team_alias::text,
    COUNT(CASE WHEN ml.log_name = 'Foul' THEN 1 END) as total_fouls,
    COUNT(CASE WHEN ml.log_name = 'Yellow Card' THEN 1 END) as total_yellow_cards,
    COUNT(CASE WHEN ml.log_name = 'Red Card' THEN 1 END) as total_red_cards,
    COUNT(CASE WHEN ml.log_name = 'Own Goal' THEN 1 END) as total_own_goals,
    COUNT(CASE WHEN ml.log_name = 'Penalty' THEN 1 END) as total_penalties
  FROM teams t
  LEFT JOIN players p ON t.id = p.team_id
  LEFT JOIN match_logs ml ON p.id = ml.player_id
  GROUP BY t.id, t.team_alias
  ORDER BY t.team_alias;
END;
$$ LANGUAGE plpgsql;    

-- SELECT p.name, COUNT(ml.id) as goals
-- FROM players p
-- JOIN match_logs ml ON p.id = ml.player_id
-- WHERE ml.log_name = 'Goal'
-- GROUP BY p.id, p.name
-- ORDER BY goals DESC

SELECT  t.team_alias,
COUNT(CASE WHEN ml.log_name = 'Foul' THEN 1 END) as total_fouls,
COUNT(CASE WHEN ml.log_name = 'Yellow Card' THEN 1 END) as total_yellow_cards,
COUNT(CASE WHEN ml.log_name = 'Red Card' THEN 1 END) as total_red_cards,
COUNT(CASE WHEN ml.log_name = 'Penalty' THEN 1 END) as total_penalties
FROM teams t
LEFT JOIN players p ON t.id = p.team_id
LEFT JOIN match_logs ml ON p.id = ml.player_id
GROUP BY t.id, t.team_alias
ORDER BY t.id;

ALTER SEQUENCE blog_id_seq RESTART WITH 1000;