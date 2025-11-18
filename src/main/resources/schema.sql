-- -----------------------------------------------------
-- Table `student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS student (
  netID VARCHAR(8) NOT NULL,
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NOT NULL,
  gradeLevel VARCHAR(45) NOT NULL,
  pronouns VARCHAR(45) NOT NULL,
  specialNotes VARCHAR(100) NOT NULL,
  email VARCHAR(45) DEFAULT NULL,
  allergies_sensitivities VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (netID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `actor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS actor (
  netID VARCHAR(8) NOT NULL,
  yearsActingExperience INT DEFAULT NULL,
  skinTone VARCHAR(45) DEFAULT NULL,
  piercings VARCHAR(50) DEFAULT NULL,
  hairColor VARCHAR(45) DEFAULT NULL,
  previousInjuries VARCHAR(90) DEFAULT NULL,
  specialNotes VARCHAR(200) DEFAULT NULL,
  height VARCHAR(45) DEFAULT NULL,
  ringSize VARCHAR(45) DEFAULT NULL,
  shoeSize VARCHAR(45) DEFAULT NULL,
  headCirc DOUBLE DEFAULT NULL,
  neckBase DOUBLE DEFAULT NULL,
  chest DOUBLE DEFAULT NULL,
  waist DOUBLE DEFAULT NULL,
  highHip DOUBLE DEFAULT NULL,
  lowHip DOUBLE DEFAULT NULL,
  armseyeToArmseyeFront DOUBLE DEFAULT NULL,
  neckToWaistFront DOUBLE DEFAULT NULL,
  armseyeToArmseyeBack DOUBLE DEFAULT NULL,
  neckToWaistBack DOUBLE DEFAULT NULL,
  centerBackToWrist DOUBLE DEFAULT NULL,
  outsleeveToWrist DOUBLE DEFAULT NULL,
  outseamBelowKnee DOUBLE DEFAULT NULL,
  outseamToAnkle DOUBLE DEFAULT NULL,
  outseamToFloor DOUBLE DEFAULT NULL,
  otherNotes VARCHAR(100) DEFAULT NULL,
  photo BLOB DEFAULT NULL,
  PRIMARY KEY (netID),
  INDEX fk_ACTOR_STUDENT1_idx (netID ASC),
  CONSTRAINT fk_ACTOR_STUDENT1 FOREIGN KEY (netID)
    REFERENCES student(netID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `shows`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS shows (
  showID INT NOT NULL AUTO_INCREMENT,
  showName VARCHAR(45) DEFAULT NULL,
  yearSemester VARCHAR(45) DEFAULT NULL,
  genre VARCHAR(45) DEFAULT NULL,
  playWright VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (showID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `characters`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS characters (
  showID INT NOT NULL,
  characterName VARCHAR(45) NOT NULL,
  netID VARCHAR(8) NOT NULL,
  PRIMARY KEY (showID, characterName, netID),
  INDEX fk_CHARACTERS_ACTOR1_idx (netID ASC),
  CONSTRAINT fk_CHARACTERS_ACTOR1 FOREIGN KEY (netID)
    REFERENCES actor(netID),
  CONSTRAINT fk_CHARACTERS_SHOW1 FOREIGN KEY (showID)
    REFERENCES shows(showID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `crew`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS crew (
  crewID VARCHAR(8) NOT NULL,
  wigTrained BINARY(1) DEFAULT NULL,
  makeupTrained BINARY(1) DEFAULT NULL,
  musicReading BINARY(1) DEFAULT NULL,
  lighting VARCHAR(90) DEFAULT NULL,
  sound VARCHAR(90) DEFAULT NULL,
  studentNonStudent BINARY(1) DEFAULT NULL,
  contractOrHired BINARY(1) DEFAULT NULL,
  specialty VARCHAR(45) DEFAULT NULL,
  notes VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (crewID),
  INDEX fk_CREW_STUDENT_idx (crewID ASC),
  CONSTRAINT fk_CREW_STUDENT FOREIGN KEY (crewID)
    REFERENCES student(netID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `scene`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS scene (
  sceneName VARCHAR(45) NOT NULL,
  showID INT NOT NULL,
  act INT DEFAULT NULL,
  locationSet VARCHAR(45) DEFAULT NULL,
  song VARCHAR(45) DEFAULT NULL,
  bookScriptPages VARCHAR(45) DEFAULT NULL,
  crewNetID VARCHAR(8) NOT NULL,
  PRIMARY KEY (sceneName),
  INDEX fk_SCENE_SHOW1_idx (showID ASC),
  CONSTRAINT fk_SCENE_SHOW1 FOREIGN KEY (showID)
    REFERENCES shows(showID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `character_in_scene`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS character_in_scene (
  sceneName VARCHAR(45) NOT NULL,
  costumeChange VARCHAR(45) DEFAULT NULL,
  costumeWorn VARCHAR(45) DEFAULT NULL,
  characterLocation VARCHAR(45) DEFAULT NULL,
  changeLocation VARCHAR(45) DEFAULT NULL,
  changeLengthOfTime VARCHAR(45) DEFAULT NULL,
  additionalNotes VARCHAR(45) DEFAULT NULL,
  crewID VARCHAR(8) DEFAULT NULL,
  showID INT NOT NULL,
  characterName VARCHAR(45) NOT NULL,
  netID VARCHAR(8) NOT NULL,
  PRIMARY KEY (sceneName, showID, characterName, netID),
  INDEX fk_CHARACTERS_has_SCENE_SCENE1_idx (sceneName ASC),
  INDEX fk_CHARACTER_IN_SCENE_CREW1_idx (crewID ASC),
  INDEX fk_CHARACTER_IN_SCENE_CHARACTERS1_idx (showID ASC, characterName ASC, netID ASC),
  CONSTRAINT fk_CHARACTER_IN_SCENE_CHARACTERS1 FOREIGN KEY (showID, characterName, netID)
    REFERENCES characters(showID, characterName, netID),
  CONSTRAINT fk_CHARACTER_IN_SCENE_CREW1 FOREIGN KEY (crewID)
    REFERENCES crew(crewID),
  CONSTRAINT fk_CHARACTERS_has_SCENE_SCENE1 FOREIGN KEY (sceneName)
    REFERENCES scene(sceneName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `crew_in_show`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS crew_in_show (
  showID INT NOT NULL,
  roles VARCHAR(45) DEFAULT NULL,
  crewID VARCHAR(8) NOT NULL,
  PRIMARY KEY (showID),
  INDEX fk_STUDENT_has_SHOW_SHOW1_idx (showID ASC),
  INDEX fk_CREW_IN_SHOW_CREW1_idx (crewID ASC),
  CONSTRAINT fk_CREW_IN_SHOW_CREW1 FOREIGN KEY (crewID)
    REFERENCES crew(crewID),
  CONSTRAINT fk_STUDENT_has_SHOW_SHOW1 FOREIGN KEY (showID)
    REFERENCES shows(showID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------
-- Table `previous_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS previous_roles (
  netID VARCHAR(8) NOT NULL,
  showID INT NOT NULL,
  PRIMARY KEY (netID),
  INDEX fk_PREVIOUS_ROLES_STUDENT1_idx (netID ASC),
  INDEX fk_PREVIOUS_ROLES_SHOW1_idx (showID ASC),
  CONSTRAINT fk_PREVIOUS_ROLES_SHOW1 FOREIGN KEY (showID)
    REFERENCES shows(showID),
  CONSTRAINT fk_PREVIOUS_ROLES_STUDENT1 FOREIGN KEY (netID)
    REFERENCES student(netID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
