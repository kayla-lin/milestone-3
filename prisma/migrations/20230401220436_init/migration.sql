-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `password` VARCHAR(256) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `roleID` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `courseID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,
    `location` VARCHAR(256) NOT NULL,
    `numEnrolled` INTEGER NOT NULL,
    `instructorID` INTEGER NOT NULL,

    PRIMARY KEY (`courseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `projectID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `description` VARCHAR(256) NOT NULL,
    `courseID` INTEGER NOT NULL,

    PRIMARY KEY (`projectID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentProject` (
    `userID` INTEGER NOT NULL,
    `projectID` INTEGER NOT NULL,
    `priority` VARCHAR(256) NOT NULL,
    `status` VARCHAR(256) NOT NULL,
    `completedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_id_project_id_unique`(`userID`, `projectID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentCourse` (
    `userID` INTEGER NOT NULL,
    `courseID` INTEGER NOT NULL,

    UNIQUE INDEX `user_id_course_id_unique`(`userID`, `courseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleID_fkey` FOREIGN KEY (`roleID`) REFERENCES `Role`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_instructorID_fkey` FOREIGN KEY (`instructorID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`courseID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentProject` ADD CONSTRAINT `StudentProject_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`projectID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentProject` ADD CONSTRAINT `StudentProject_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentCourse` ADD CONSTRAINT `StudentCourse_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentCourse` ADD CONSTRAINT `StudentCourse_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`courseID`) ON DELETE CASCADE ON UPDATE CASCADE;
