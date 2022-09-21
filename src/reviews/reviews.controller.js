const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next){
    const { reviewId }= req.params;
    const review = await service.read(reviewId);

    if (review){
        res.locals.review = review;
        return next();
    } return next ({
        status: 404,
        message: "Review cannot be found."
    })
}

async function list(req, res, next){
    res.json({data: await service.list()})
}

async function read(req, res, next){
    const {reviewId}= req.params;
    const data= await service.read(reviewId);
    res.json({ data })
}

async function update(req, res, next){
    const time = new Date().toISOString();
 const reviewId = res.locals.review.review_id;
    const updatedReview = {
        ...req.body.data,
        review_id: reviewId,
    };
    await service.update(updatedReview);
    const rawData = await service.newCritic(reviewId);
    const data = { ...rawData[0], created_at: time, updated_at: time };
    res.json({data});
}

async function destroy(req, res, next){
    const {review_id}= res.locals.review;
    await service.delete(review_id);
    res.sendStatus(204);
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [reviewExists, asyncErrorBoundary(read)],
    update: [reviewExists, asyncErrorBoundary(update)],
    delete: [reviewExists, asyncErrorBoundary(destroy)],
}