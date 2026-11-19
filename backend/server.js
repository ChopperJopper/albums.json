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
server.get('/api/genres/:genreId/tracks', onGetTrackFromGenre);

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

 async function onGetTrackFromGenre(request, response){
        const genreId = request.params.genreId;
        const dbResult = await db.query(`
                select  title
                from tracks 
                where genre_id = $1
        `, [genreId]);
        response.json(dbResult.rows);
 }

 function onServerReady() {
    console.log('Webserver running on port', port);
}


