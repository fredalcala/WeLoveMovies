const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next){
    const movie = await service.read(req.params.movieId)
    if(movie){
        res.locals.movie = movie;
        return next();
    }
    next({status: 404, message: "Movie cannot be found."})
}

async function list(req, res){
    const {is_showing} = req.query;
    if(is_showing){
        res.json({data: await service.showingList(is_showing)})
    }
    res.json({data: await service.list()});
}

async function listTheatersPlayingMovie(req, res, next){
    const { movie_id } = res.locals.movie;
    const data = await service.listTheatersPlayingMovie(movie_id);
    res.json({data});
}

async function listMovieReviews(req, res, next){
    const movie_id = req.params.movieId;
    const response = await service.listMovieReviews(movie_id);
    res.json({data: response});
}

async function read(req, res){
    res.json({ data: await service.read(req.params.movieId)})
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    listTheatersPlayingMovie: [asyncErrorBoundary(movieExists), 
        asyncErrorBoundary(listTheatersPlayingMovie)],
    listMovieReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listMovieReviews)],
        movieExists,
}