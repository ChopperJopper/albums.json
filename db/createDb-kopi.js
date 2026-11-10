import { connect } from './connect.js';
import upload from 'pg-upload';

const db = await connect();
const timestamp = (await db.query('select now() as timestamp')).rows[0]['timestamp'];
console.log(`Recreating database on ${timestamp}...`);

await db.query('drop table if exists artists');
await db.query('drop table if exists albums');
await db.query('drop table if exists media_types');
await db.query('drop table if exists tracks');
await db.query('drop table if exists genres');
await db.query('drop table if exists users');
await db.query('drop table if exists playlists');
await db.query('drop table if exists playlist_track');
// TODO: drop more tables, if they exist

await db.query(`
    create table artists (
        artist_id   integer unique not null,
        stage_name  text,
        nationality char(2) not null,
        active boolean not null default true,
        unique (stage_name, nationality)
    
    )
`);
await db.query(`
    create table albums (
        album_id         integer unique not null,
        artist_id        integer not null,
        release_date     date,
        title            text,
        riaa_certificate text 
    )
`);
await db.query(`
    create table media_types (
        media_type_id integer unique not null,
        bit_depth     integer,
        sample_rate   real,
        lossless      boolean,
        name          text,
        description   text
    )
`);
await db.query(`
    create table tracks (
        track_id      integer unique not null,
        album_id      integer not null,
        media_type_id integer not null,
        genre_id      integer not null,
        milliseconds  integer check (milliseconds >= 0),
        bytes         bigint,
        unit_price    numeric(10, 2),
        title         text,

        constraint making_money
        check (unit_price > 0.50 + 0.13 * (bytes / 10000000.0))
)
`);
await db.query(`
    create table genres (
        genre_id    integer unique not null,
        name        text,
        description text
    )
`);
await db.query(`
    create table users (
        user_id     bigint unique not null,
        signed_up   timestamp,
        active      boolean,
        screen_name text,
        email       text
    )
`);
await db.query(`
    create table playlists (
        playlist_id bigint unique not null,
        user_id     bigint not null,
        created     timestamp,
        name        text
    )
`);
await db.query(`
    create table playlist_track (
        playlist_id integer not null,
        track_id    integer not null
    )
`);
await upload(db, 'db/artists.csv', `
    copy artists (artist_id, stage_name, nationality)
    from stdin
    with csv encoding 'UTF-8'
    where nationality is not null
`);


await upload(db, 'db/media_types.csv', `
    copy media_types (media_type_id, name, description, sample_rate, bit_depth, lossless)
    from stdin
    with csv header encoding 'UTF-8'
`);
await upload(db, 'db/tracks.csv', `
    copy tracks (track_id, title, album_id, media_type_id, genre_id, milliseconds, bytes, unit_price)
    from stdin
    with csv header encoding 'win1252'
    where (unit_price > 0.50 + 0.13 * (bytes / 10000000.0))
`);
await upload(db, 'db/genres.csv', `
    copy genres (name, genre_id, description)
    from stdin
    with csv encoding 'UTF-8'
`);
await upload(db, 'db/users.csv', `
    copy users (user_id, screen_name, email, active, signed_up)
    from stdin
    with csv encoding 'UTF-8'
`);
await upload(db, 'db/playlists.csv', `
    copy playlists (playlist_id, created, user_id, name)
    from stdin
    with csv header encoding 'UTF-8'
`);
await upload(db, 'db/playlist_track.csv', `
    copy playlist_track (playlist_id, track_id)
    from stdin
    with csv header encoding 'UTF-8'
`);

// TODO: create more tables

// TODO: import data from csv files into tables

await db.end();
console.log('Database successfully recreated.');

function human (){
    
}