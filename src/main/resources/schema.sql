-- -----------------------------------------------------
-- Table "student"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "student" (
  "netID" VARCHAR(8) NOT NULL,
  "firstName" VARCHAR(45) NOT NULL,
  "lastName" VARCHAR(45) NOT NULL,
  "gradeLevel" VARCHAR(45) NOT NULL,
  "pronouns" VARCHAR(45) NOT NULL,
  "specialNotes" VARCHAR(100) NOT NULL,
  "email" VARCHAR(45),
  "allergies_sensitivities" VARCHAR(45),
  CONSTRAINT "pk_student" PRIMARY KEY ("netID")
);
-- -----------------------------------------------------
-- Table "actor"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "actor" (
  "netID" VARCHAR(8) NOT NULL,
  "yearsActingExperience" INTEGER,
  "skinTone" VARCHAR(45),
  "piercings" VARCHAR(50),
  "hairColor" VARCHAR(45),
  "previousInjuries" VARCHAR(90),
  "specialNotes" VARCHAR(200),
  "height" VARCHAR(45),
  "ringSize" VARCHAR(45),
  "shoeSize" VARCHAR(45),
  "headCirc" DOUBLE PRECISION,
  "neckBase" DOUBLE PRECISION,
  "chest" DOUBLE PRECISION,
  "waist" DOUBLE PRECISION,
  "highHip" DOUBLE PRECISION,
  "lowHip" DOUBLE PRECISION,
  "armseyeToArmseyeFront" DOUBLE PRECISION,
  "neckToWaistFront" DOUBLE PRECISION,
  "armseyeToArmseyeBack" DOUBLE PRECISION,
  "neckToWaistBack" DOUBLE PRECISION,
  "centerBackToWrist" DOUBLE PRECISION,
  "outsleeveToWrist" DOUBLE PRECISION,
  "outseamBelowKnee" DOUBLE PRECISION,
  "outseamToAnkle" DOUBLE PRECISION,
  "outseamToFloor" DOUBLE PRECISION,
  "otherNotes" VARCHAR(100),
  "photo" BYTEA,
  CONSTRAINT "pk_actor" PRIMARY KEY ("netID"),
  CONSTRAINT "fk_actor_student" FOREIGN KEY ("netID") REFERENCES "student" ("netID") ON DELETE CASCADE ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table "shows"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "shows" (
  "showID" SERIAL NOT NULL,
  "showName" VARCHAR(45),
  "yearSemester" VARCHAR(45),
  "genre" VARCHAR(45),
  "playWright" VARCHAR(45),
  CONSTRAINT "pk_shows" PRIMARY KEY ("showID")
);
-- -----------------------------------------------------
-- Table "characters"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "characters" (
  "showID" INTEGER NOT NULL,
  "characterName" VARCHAR(45) NOT NULL,
  "netID" VARCHAR(8) NOT NULL,
  CONSTRAINT "pk_characters" PRIMARY KEY ("showID", "characterName", "netID"),
  CONSTRAINT "fk_characters_actor" FOREIGN KEY ("netID") REFERENCES "actor" ("netID") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_characters_show" FOREIGN KEY ("showID") REFERENCES "shows" ("showID") ON DELETE CASCADE ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table "crew"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "crew" (
  "crewID" VARCHAR(8) NOT NULL,
  "wigTrained" BOOLEAN,
  "makeupTrained" BOOLEAN,
  "musicReading" BOOLEAN,
  "lighting" VARCHAR(90),
  "sound" VARCHAR(90),
  "studentNonStudent" BOOLEAN,
  "contractOrHired" BOOLEAN,
  "specialty" VARCHAR(45),
  "notes" VARCHAR(45),
  CONSTRAINT "pk_crew" PRIMARY KEY ("crewID"),
  CONSTRAINT "fk_crew_student" FOREIGN KEY ("crewID") REFERENCES "student" ("netID") ON DELETE CASCADE ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table "scene"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "scene" (
  "showID" INTEGER NOT NULL,
  "sceneName" VARCHAR(45) NOT NULL,
  "act" INTEGER,
  "locationSet" VARCHAR(45),
  "song" VARCHAR(45),
  "bookScriptPages" VARCHAR(45),
  "crewNetID" VARCHAR(8),
  CONSTRAINT "pk_scene" PRIMARY KEY ("showID", "sceneName"),
  CONSTRAINT "fk_scene_show" FOREIGN KEY ("showID") REFERENCES "shows" ("showID") ON DELETE CASCADE ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table "character_in_scene"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "character_in_scene" (
  "showID" INTEGER NOT NULL,
  "sceneName" VARCHAR(45) NOT NULL,
  "characterName" VARCHAR(45) NOT NULL,
  "netID" VARCHAR(8) NOT NULL,
  "costumeChange" VARCHAR(45),
  "costumeWorn" VARCHAR(45),
  "characterLocation" VARCHAR(45),
  "changeLocation" VARCHAR(45),
  "changeLengthOfTime" VARCHAR(45),
  "additionalNotes" VARCHAR(45),
  "crewID" VARCHAR(8),
  CONSTRAINT "pk_character_in_scene" PRIMARY KEY ("showID", "sceneName", "characterName", "netID"),
  CONSTRAINT "fk_cis_characters" FOREIGN KEY ("showID", "characterName", "netID") REFERENCES "characters" ("showID", "characterName", "netID") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_cis_scene" FOREIGN KEY ("showID", "sceneName") REFERENCES "scene" ("showID", "sceneName") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_cis_crew" FOREIGN KEY ("crewID") REFERENCES "crew" ("crewID") ON DELETE
  SET NULL ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table "crew_in_show"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "crew_in_show" (
  "showID" INTEGER NOT NULL,
  "crewID" VARCHAR(8) NOT NULL,
  "roles" VARCHAR(45),
  CONSTRAINT "pk_crew_in_show" PRIMARY KEY ("showID", "crewID"),
  CONSTRAINT "fk_crew_in_show_show" FOREIGN KEY ("showID") REFERENCES "shows" ("showID") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_crew_in_show_crew" FOREIGN KEY ("crewID") REFERENCES "crew" ("crewID") ON DELETE CASCADE ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table "previous_roles"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "previous_roles" (
  "netID" VARCHAR(8) NOT NULL,
  "showID" INTEGER NOT NULL,
  CONSTRAINT "pk_previous_roles" PRIMARY KEY ("netID", "showID"),
  CONSTRAINT "fk_previous_roles_student" FOREIGN KEY ("netID") REFERENCES "student" ("netID") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_previous_roles_show" FOREIGN KEY ("showID") REFERENCES "shows" ("showID") ON DELETE CASCADE ON UPDATE CASCADE
);