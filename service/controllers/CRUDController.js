var errs = require('restify-errors');

module.exports = (method, model) => {
    var objectModel = require('../models/' + model);

    let Create = (req, res, next) => {
        let obj = new objectModel();
        let modelFields = Object.keys(obj.schema.obj);
        console.log(modelFields);
        modelFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                obj[field] = req.body[field];
            }
        });
        obj.save((err, savedObj) => {
            if (err) {
                if (err.code == 11000) {
                    return next(new errs.BadRequestError("Ya existe este registro en la base de datos."));
                } else {
                    return next(new errs.InternalServerError(err));
                }
            } else {
                return res.json({ success: true, message: "Succesfully added.", obj: savedObj });
            }
        });
    }

    let Read = (req, res, next) => {
        objectModel.findById(req.params.object_id, (err, newObj) => {
            if (err) {
                return next(new errs.InternalServerError(err));
            } else {
                if (newObj) {
                    return res.json({ success: true , obj: newObj });
                } else {
                    return next(new errs.BadRequestError("El elemento no existe."));
                }
            }
        });
    }

    let Update = (req, res, next) => {
        objectModel.findById(req.params.object_id, (err, obj) => {
            if (err) {
                return next(new errs.InternalServerError(err));
            } else if (obj) {
                let modelFields = Object.keys(obj.schema.obj);
                modelFields.forEach((field) => {
                    if (req.body[field] !== undefined) {
                        obj[field] = req.body[field];
                    }
                });
                obj.save((err, newObj) => {
                    if (err) {
                        return next(new errs.InternalServerError(err));
                    } else {
                        return res.json({ success: true, message: "Succesfully updated.", obj: newObj });
                    }
                });
            } else {
                return next(new errs.BadRequestError("El elemento no existe."));
            }
        });
    }

    let Delete = (req, res, next) => {
        objectModel.findOneAndRemove({ _id: req.params.object_id }, (err, newObj) => {
			if(err){
				return next(new errs.InternalServerError(err));
			} else if (newObj) {
                return res.json({ success: true, message: "Succesfully deleted.", obj: newObj });
            } else {
                return next(new errs.BadRequestError("El elemento no existe."));
            }
        });
    }

    let Search = (req, res, next) => {
        var Paginator = {
            page: 1,
            limit: 50,
            sort: {
                created: -1, // desc
            }
        };
        // FOR PAGINATOR
        if (req.body.page != undefined) {
            Paginator.page = Number(req.body.page);
        }
        if (req.body.limit != undefined) {
            Paginator.limit = Number(req.body.limit);
        }
        // FOR FILTER
        var Filter = {}
        if (req.body.google_user_id != undefined) {
            Filter['google_user_id'] = req.body.google_user_id
        }
        if (req.body.account_id != undefined) {
            Filter['account_id'] = req.body.account_id
        }
        if (req.body.status != undefined) {
            Filter['status'] = req.body.status
        }
        if (req.body.subsidiary_id != undefined) {
            Filter['subsidiary_id'] = req.body.subsidiary_id
        }
        if (req.body.search_text != undefined) {
            Filter['$text'] = { '$search': req.body.search_text };
        }
        if (req.body.coordinates != undefined) {
            Filter['location'] = {
                '$near': {
                    '$maxDistance': 1000,
                    '$geometry': {
                        'type': 'Point',
                        'coordinates': [coordinates[0], coordinates[1]]
                    }
                }
            }
        }

        // FOR SORT: 
        if (req.body.sort_field != undefined) {
            Paginator.sort = {};
            Paginator.sort[req.body.sort_field] = -1;
            if (req.body.sort_order != undefined) {
                Paginator.sort[req.body.sort_field] = Number(req.body.sort_order);
            }
        }
        console.log("request");
        console.log(Filter);
        console.log(Paginator);
        objectModel.paginate(Filter, Paginator, (err, result) => {
            if (err) {
                console.log(err);
                return next(new errs.InternalServerError(err));
            } else {
                console.log(result);
                return res.json({ success: true, data: result });
            }
        });
    }

    let NoValidMethod = (req, res, next) => {
        return next(new errs.BadRequestError("Metodo no valido."));
    }

    if (method == 'create') {
        return Create;
    } else if (method == 'read') {
        return Read;
    } else if (method == 'update') {
        return Update;
    } else if (method == 'delete') {
        return Delete
    } else if (method == 'search') {
        return Search
    } else {
        return NoValidMethod
    }
}
