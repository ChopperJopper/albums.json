import express from 'express';
import { pool } from '../db/connect.js';

const db = pool();

const port = process.env.PORT || 3010;
const server = express();


server.get('/api/tracks', onGetTracks);
server.get('/api/genres', onGetGenres);

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


 function onServerReady() {
    console.log('Webserver running on port', port);
}