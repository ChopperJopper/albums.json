import express from 'express';
import { pool } from '../db/connect.js';

const db = pool();

const port = process.env.PORT || 3010;
const server = express();

server.use(express.json());
server.use(express.static('frontend')); // forbinder til frontend
server.get('/api/tracks', onGetTracks);
server.get('/api/genres', onGetGenres);
server.get('/api/albums', onGetAlbums);
/*server.get('/api/genres/:genreId/tracks', onGetTrackFromGenre);*/
server.get('/api/genres/:genreId/randomtrack', onGetRandomTrackFromGenre);
server.get('/api/tracks/search', onGetTracksBySearch);
server.get('/api/users', onGetUsers);
server.get('/api/users/:userId/likedSongs', onGetLikedSongs);
server.put('/api/users/:userId/tracks/:trackId/addsongs', onPutLikedSongsByUser);
server.listen(port, onServerReady);

async function onGetTracks(request, response) {
    const dbResult = await db.query(`
    select  track_id as id,
            title,
            album_id,
            genre_id,
            milliseconds
    from    tracks
    order by title asc
    `);
    console.log(dbResult.rows);
    response.json(dbResult.rows);
 }

 async function onGetGenres(request, response) {
    const dbResult = await db.query(`
        select  genre_id as id,
                name,
                description
        from genres
        order by name asc
        `);
        console.log(dbResult.rows)
        response.json(dbResult.rows)
 }

 async function onGetAlbums(request, response) {
    const dbResult = await db.query(`
        select  album_id as id,
                title
                release_date,
                artist_id,
                riaa_certificate
        from albums
        order by title asc
        `);
        console.log(dbResult.rows)
        response.json(dbResult.rows)
 }

 /*async function onGetTrackFromGenre(request, response){
        const genreId = request.params.genreId;
        const dbResult = await db.query(`
                select  title
                from tracks 
                where genre_id = $1
        `, [genreId]);
        response.json(dbResult.rows);
 }*/
 
 async function onGetRandomTrackFromGenre(request, response){
        const genreId = request.params.genreId;
          const dbResult = await db.query(`
                select  title
                from tracks 
                where genre_id = $1
                order by random()
                limit 10
        `, [genreId]);
        response.json(dbResult.rows);
 }

 async function onGetTracksBySearch(request, response) {
        const search = request.query.q || '';

    const dbResult = await db.query(`
        select  track_id as id,
                title,
                album_id,
                genre_id,
                milliseconds
        from    tracks
        where   title ilike $1
        order by title asc
        limit 10
    `, [`${search}%`]);

    response.json(dbResult.rows);
 }

 async function onGetUsers(request, response) {
        const dbResult = await db.query(`
                select  user_id as id,
                        screen_name as name,
                        email
                from    users
                order by name asc
                `)
        response.json(dbResult.rows);
 }

 async function onGetLikedSongs(request, response){
        const userId = request.params.userId;
        const dbResult = await db.query(`
                select track_id
                from liked_songs
                where user_id = $1
                `, [userId]);
        response.json(dbResult.rows)
 }

async function onPutLikedSongsByUser(request, response){
        const userId = request.params.userId
        const trackId = request.params.trackId
        const dbResult = await db.query(`
                insert into liked_songs (user_id, track_id)
                values ($1, $2)
                on conflict (user_id, track_id) do nothing
                `, [userId, trackId]);
        response.json(dbResult.rows)
}

 function onServerReady() {
        console.log('Webserver running on port', port);
}


