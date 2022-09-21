const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function list(){
    return knex("movies")
    .select("*")
}

function showingList(is_showing){
return knex("movies as m")
.distinct()
.join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
.select("m.*")
.where({"mt.is_showing": true})
}

function listTheatersPlayingMovie(movie_id){
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "mt.is_showing", "m.movie_id")
    .where({"m.movie_id": movie_id});
}

function listMovieReviews(movie_id){
    return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("c.*", "r.*")
    .where({"m.movie_id": movie_id})
    .then((data) => data.map(addCritic));
}

function read(movieId){
return knex("movies")
.select("*")
.where({movie_id: movieId})
.first();
}

module.exports = {
    list,
    showingList,
    listTheatersPlayingMovie,
    listMovieReviews,
    read,
}