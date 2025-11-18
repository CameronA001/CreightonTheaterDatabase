DESCRIBE actor;
INSERT IGNORE INTO actor (netID, yearsActingExperience, skinTone, piercings, hairColor, previousInjuries, height)
VALUES('CAA43510', 2, 'mk105', 'nose and ears', 'brown', 'broken foot', '6 foot 4'),
('CAA67234', 5, 'lt200', 'earlobes', 'blonde', 'sprained ankle', '5 foot 9'),
('CAA98122', 3, 'dk300', 'none', 'black', 'torn ligament', '6 foot 1'),
('CAA55678', 7, 'ol250', 'nose', 'red', 'concussion', '5 foot 11'),
('CAA44321', 1, 'pk150', 'tongue', 'brown', 'none', '5 foot 7');

DESCRIBE student;
INSERT IGNORE INTO student 
(netID, firstName, lastName, gradeLevel, pronouns, specialNotes, email, allergies_sensitivities)
VALUES
('CAA43510', 'Balls', 'Abanes', 'Junior', 'He/Him', 'No special notes', 'caa43510@creighton.edu', 'dust allergy'),
('CAA67234', 'Alex', 'Johnson', 'Senior', 'They/Them', 'No special notes', 'ajohnson@creighton.edu', 'peanut allergy'),
('CAA98122', 'Taylor', 'Smith', 'Sophomore','She/Her', 'No special notes', 'tsmith@creighton.edu', 'none'),
('CAA55678', 'Jordan', 'Lee', 'Junior', 'He/Him', 'No special notes', 'jlee@creighton.edu', 'seasonal allergies'),
('CAA44321', 'Morgan', 'Davis', 'Freshman', 'She/Her', 'No special notes', 'mdavis@creighton.edu', 'lactose intolerance');


DESCRIBE crew;
-- 1 means yes, 0 means no
-- 1 means student 0 means non student
-- 1 means contracted and 0 means hired
-- A crew can only be contracted or hired if they are a non student
INSERT IGNORE INTO crew
VALUES('CAA43510', 1, 1, 1, 'Some experience in lighting', 'No experience in sound', 1, 0,'no speicalty', 'no notes'),
('CAA67234', 0, 1, 1, 'Performed lighting for two shows', 'No experience in sound', 1, 1,'no speicalty', 'no notes'),
('CAA98122', 1, 0, 1, 'Worked backstage for lighting once', 'No sound experience', 0, 0,'no speicalty', 'no notes'),
('CAA55678', 1, 1, 1, 'Choreographed lighting for small shows', 'Minimal sound experience', 1, 1,'no speicalty', 'no notes'),
('CAA44321', 0, 0, 1, 'Extra lighting help in one show', 'No sound experience', 0, 0,'no speicalty', 'no notes');

DESCRIBE shows;
-- Left NULL because showID is autoIncrement
INSERT IGNORE INTO shows
VALUES(NULL, '12th Night', '2023 Spring', 'Comedy', 'Shakespeare'),
(NULL, 'Hamlet', '2023 Fall', 'Tragedy', 'Shakespeare'),
(NULL, 'A Midsummer Night’s Dream', '2024 Spring', 'Comedy', 'Shakespeare'),
(NULL, 'Macbeth', '2024 Fall', 'Tragedy', 'Shakespeare'),
(NULL, 'Twelfth Night', '2025 Spring', 'Comedy', 'Shakespeare');

DESCRIBE previous_roles;
INSERT IGNORE INTO previous_roles
VALUES ('CAA43510',1),
('CAA67234',2),
('CAA98122',3),
('CAA55678',4),
('CAA44321',5);

DESCRIBE characters;
INSERT IGNORE INTO characters (showID, characterName, netID)
VALUES
  (1, 'Viola', 'CAA43510'),
  (2, 'Hamlet', 'CAA67234'),
  (3, 'Puck', 'CAA98122'),
  (4, 'Macbeth', 'CAA55678'),
  (5, 'Olivia', 'CAA44321');

DESCRIBE scene;
INSERT IGNORE INTO scene
VALUES('Violas entrance', 1, 2, 'Forest', 'No song', 'page 34', 'MKK71859'),
('Hamlet soliloquy', 2, 1, 'Castle', 'No song', 'page 12', 'LJP83210'),
('Puck mischief', 3, 1, 'Forest', 'No song', 'page 45', 'QRT55622'),
('Macbeth dagger scene', 4, 2, 'Castle', 'No song', 'page 78', 'ZMW44311'),
('Olivia meets Viola', 5, 1, 'Manor', 'No song', 'page 56', 'HBN99823');

DESCRIBE character_in_scene;
INSERT IGNORE INTO character_in_scene
VALUES('Violas entrance', 'no costume change', 'dress worn', 'stage left', 'no costume change location', 'none', 'none', 'MKK71859', 1, 'Viola', 'CAA43510' ),
('Hamlet soliloquy', 'no costume change', 'royal attire', 'center stage', 'no costume change location', 'none', 'none', 'LJP83210', 2, 'Hamlet', 'CAA67234'),
('Puck mischief', 'no costume change', 'mischief outfit', 'forest', 'no costume change location', 'none', 'none', 'QRT55622', 3, 'Puck', 'CAA98122'),
('Macbeth dagger scene', 'cape change', 'black cape', 'castle hall', 'backstage', '2 minutes', 'none', 'ZMW44311', 4, 'Macbeth', 'CAA55678'),
('Olivia meets Viola', 'hat change', 'formal dress', 'manor entrance', 'backstage', '1 minute', 'none', 'HBN99823', 5, 'Olivia', 'CAA44321');

DESCRIBE crew_in_show;
INSERT IGNORE INTO crew_in_show
VALUES(1, 'Lighting design', 'MKK71859'),
(2, 'Stage manager', 'LJP83210'),
(3, 'Props', 'QRT55622'),
(4, 'Costume assistant', 'ZMW44311'),
(5, 'Sound design', 'HBN99823');



