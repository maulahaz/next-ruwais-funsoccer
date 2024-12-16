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

CREATE TABLE match_logs (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE SET NULL,
    log_name VARCHAR(100),  --[Goal, Yellow Card, Red Card, Penalty]
    log_datetime TIMESTAMP NOT NULL,  --[Datetime during log]
    player_id INT REFERENCES players(id) ON DELETE SET NULL,  --[Player during log]
);
INSERT INTO match_logs (match_id, log_name, log_datetime, player_id)
VALUES
    (1, 'Foul', '2024-11-29 21:30:01', 7),
    (1, 'Goal', '2024-11-29 21:30:02', 12),
    (1, 'Foul', '2024-11-29 21:30:03', 12),
    (1, 'Goal', '2024-11-29 21:30:04', 13),
    (1, 'Foul', '2024-11-29 21:30:05', 13),
    (1, 'Foul', '2024-11-29 21:30:06', 14),
    (1, 'Foul', '2024-11-29 21:30:07', 16),
    (1, 'Foul', '2024-11-29 21:30:07', 22)
    ;  

CREATE TABLE match_files (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),  --Title of file
    file_url VARCHAR(255),  --File can be image or video
    file_type VARCHAR(50),  -- 'image' or 'video'
    match_id INT REFERENCES matches(id) ON DELETE SET NULL,
    player_id INT REFERENCES players(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO match_files (title, file_url, file_type, match_id, player_id, created_at)
VALUES
('Goal Celebration', '/images/goal_celebration.jpg', 'image', 1, null, '2024-12-12 10:00:00'),
('Match Highlight', '/videos/match_highlight.mp4', 'video', 2, null, '2024-12-12 11:00:00'),
('Training Session', '/images/training_session.jpg', 'image', 3, null, '2024-12-12 12:00:00'),
('Final Match', '/videos/final_match.mp4', 'video', 4, null, '2024-12-12 13:00:00'),
('Ncing-1', '/images/ncing-1.jpg', 'image', null, 19, '2024-12-12 14:00:00'),
('Zain-1', '/images/zain-1.jpg', 'image', null, 33, '2024-12-12 14:01:00'),
('Zain-2', '/images/zain-2.jpg', 'image', null, 33, '2024-12-12 14:02:00'),
('Zain-3', '/images/zain-3.jpg', 'image', null, 33, '2024-12-12 14:03:00')
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