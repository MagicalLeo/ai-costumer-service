use aivara_db;
show databases;
select * from Chat;
select * from Message;
ALTER TABLE `Message`
MODIFY COLUMN `content` LONGTEXT NOT NULL;