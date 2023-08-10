-- Create tables
begin transaction;
create table if not exists folders (id int primary key autoincrement , name text, parent_id int references folders(id));
create table if not exists files (id int primary key, name text, parent_id int references folders(id));
create table if not exists file_contents (id int, name text, file_id int references files(id));
create table if not exists conversations (id int, name text);
create table if not exists conversation_contents (id int, name text);
commit;

drop table folders;
drop table files;
drop table conversations;
drop table file_contents;
drop table conversation_contents;

insert into folders (id, name, parent_id) values
    (1, 'folder1', null),
    (2, 'folder2', 1),
    (3, 'folder3', 1),
    (4, 'folder4', 2),
    (5, 'folder5', 3);
insert into files (id, name, parent_id) values
    (1, 'file1', 1),
    (2, 'file2', 1),
    (3, 'file3', 2),
    (4, 'file4', 2),
    (5, 'file5', 3),
    (6, 'file6', 7);
select * from folders;
WITH RECURSIVE tree AS (
    SELECT id, parent_id, name,
           json_object('id', id, 'name', name) AS json_data
    FROM folders
    WHERE parent_id IS NULL
    UNION ALL
    SELECT f.id, f.parent_id, f.name,
           json_insert(t.json_data, '$.subNodes', json_group_array(json_object('id', f.id, 'name', f.name))) AS json_data
    FROM folders AS f
             JOIN tree AS t ON f.parent_id = t.id
)
SELECT json_data FROM tree WHERE parent_id IS NULL;


WITH RECURSIVE all_folders AS (
    SELECT id, parent_id, name
    FROM folders
    WHERE parent_id IS NULL -- Starting from the root folder
    UNION ALL
    SELECT f.id, f.parent_id, f.name
    FROM folders f
             JOIN all_folders a ON f.parent_id = a.id
)
SELECT 'folder' AS type, id, name FROM all_folders
UNION ALL
SELECT 'file' AS type, f.id, f.name
FROM files f
         JOIN all_folders a ON f.id = a.id;


-- Examples
-- alter table folders add column parent int;
-- drop table folders;
-- insert into folders (id, name) values (1, 'folder1');
