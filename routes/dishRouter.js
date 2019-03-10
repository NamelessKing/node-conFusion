const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route("/")

    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log("dish created ", dish);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /dishes`);
    })

    .delete((req, res, next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });




/*************************************************************************************/


//routes with parameters

dishRouter.route("/:dishId")

    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
    })


    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, { new: true })
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });




/*************************************************************************************/



dishRouter.route("/:dishId/comments")

    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {

                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish.comments);
                }
                else {
                    let err = new Error(`Dish ${req.params.dishId} non found`);
                    err.status = 404;
                    return err;
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {

                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(dish);
                        }), (err) => next(err);
                }
                else {
                    let err = new Error(`Dish ${req.params.dishId} non found`);
                    err.status = 404;
                    return err;
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);
    })

    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments = [];
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(dish);
                        }), (err) => next(err);
                }
                else {
                    let err = new Error(`Dish ${req.params.dishId} non found`);
                    err.status = 404;
                    return err;
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


/*************************************************************************************/


dishRouter.route("/:dishId/comments/:commentId")

    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish.comments.id(req.params.commentId));
                }
                else if (dish == null) {
                    let err = new Error(`Dish ${req.params.dishId} non found`);
                    err.status = 404;
                    return err;
                }
                else {
                    let err = new Error(`Comment ${req.params.commentId} non found`);
                    err.status = 404;
                    return err;
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`);
    })


    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(dish);
                        }), (err) => next(err);
                }
                else if (dish == null) {
                    let err = new Error(`Dish ${req.params.dishId} non found`);
                    err.status = 404;
                    return err;
                }
                else {
                    let err = new Error(`Comment ${req.params.commentId} non found`);
                    err.status = 404;
                    return err;
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(dish);
                        }), (err) => next(err);
                }
                else if (dish == null) {
                    let err = new Error(`Dish ${req.params.dishId} non found`);
                    err.status = 404;
                    return err;
                }
                else {
                    let err = new Error(`Comment ${req.params.commentId} non found`);
                    err.status = 404;
                    return err;
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = dishRouter;

//routes with parameters

/**app.get('/dishes/:dishId', (req, res, next) => {
    res.end(`Will send all details of dish: ${req.params.dishId}`);
});

app.post('/dishes/:dishId', (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
});

app.put('/dishes/:dishId', (req, res, next) => {
    res.write(`Updating the dish: ${req.params.dishId} \n`);
    res.end(`Will update the dish: ${req.body.name} with details ${req.body.description}`);
});

app.delete('/dishes/:dishId', (req, res, next) => {
    res.end(`Deleting dish ${req.params.dishId}`);
});
 */
