import { connect } from './connect.js';
import upload from 'pg-upload';

const db = await connect();
const timestamp = (await db.query('select now() as timestamp')).rows[0]['timestamp'];
console.log(`Recreating database on ${timestamp}...`);

await db.query('drop table if exists artists cascade');
await db.query('drop table if exists albums cascade');
/*await db.query('drop table if exists media_types');*/
await db.query('drop table if exists tracks cascade');
await db.query('drop table if exists genres cascade');
await db.query('drop table if exists users cascade');
await db.query('drop table if exists playlists cascade');
await db.query('drop table if exists playlist_track cascade');
await db.query('drop table if exists liked_songs cascade');
await db.query('drop table if exists location cascade');


await db.query(`
    create table artists (
        artist_id   integer unique not null,
        stage_name  text,
        nationality char(2),
        unique (stage_name, nationality)
    
    )
`);
await db.query(`
    create table albums (
        album_id         integer unique not null,
        artist_id        integer not null references artists (artist_id),
        release_date     date,
        title            text,
        riaa_certificate text 
    )
`);

/* await db.query(`
    create table media_types (
        media_type_id integer unique not null,
        bit_depth     integer,
        sample_rate   real,
        lossless      boolean,
        name          text,
        description   text
    )
`);
*/
await db.query(`
    create table genres (
        genre_id    integer unique not null,
        name        text,
        description text
    )
`);
await db.query(`
    create table tracks (
        track_id      integer unique not null,
        album_id      integer not null references albums (album_id),
        genre_id      integer not null references genres (genre_id),
        milliseconds  integer check (milliseconds >= 0),
        title         text
)
`);

await db.query(`
    create table users (
        user_id     integer unique not null,
        screen_name text,
        email       text 
    )
`);
await db.query(`
    create table playlists (
        playlist_id integer unique not null,
        user_id     integer not null,
        name        text
    )
`);
await db.query(`
    create table playlist_track (
        playlist_id integer not null references playlists (playlist_id),
        track_id    integer not null references tracks (track_id)
    )
`);
await db.query(`
    create table liked_songs (
        user_id integer not null references users (user_id),
        track_id integer not null references tracks (track_id)
    )
`);
await db.query(`
    create table location (
        location_id integer unique not null,
        type    text
    )
`);
await upload(db, 'db/artists.csv', `
    copy artists (artist_id, stage_name, nationality)
    from stdin
    with csv encoding 'UTF-8'
`);

await upload(db, 'db/albums.csv', `
    copy albums (album_id, title, artist_id, release_date, riaa_certificate)
    from stdin
    with csv header encoding 'UTF-8'
`);


/*await upload(db, 'db/media_types.csv', `
    copy media_types (media_type_id, name, description, sample_rate, bit_depth, lossless)
    from stdin
    with csv header encoding 'UTF-8'
`);*/

await upload(db, 'db/genres.csv', `
    copy genres (name, genre_id, description)
    from stdin
    with csv encoding 'UTF-8'
`);
await upload(db, 'db/tracks.csv', `
    copy tracks (track_id, title, album_id, genre_id, milliseconds)
    from stdin
    with csv header encoding 'win1252'
`);
await upload(db, 'db/users.csv', `
    copy users (user_id, screen_name, email)
    from stdin
    with csv encoding 'UTF-8'
`);
await upload(db, 'db/playlists.csv', `
    copy playlists (playlist_id, user_id, name)
    from stdin
    with csv header encoding 'UTF-8'
`);
await upload(db, 'db/playlist_track.csv', `
    copy playlist_track (playlist_id, track_id)
    from stdin
    with csv header encoding 'UTF-8'
`);
await upload(db, 'db/lokationer.csv', `
    copy location (location_id, type)
    from stdin
    with csv header encoding 'UTF-8'
    `)


// TODO: create more tables

// TODO: import data from csv files into tables

await db.end();
console.log('Database successfully recreated.');

