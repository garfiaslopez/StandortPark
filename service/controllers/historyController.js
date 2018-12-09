//MODELS
var errs = require('restify-errors');
var TicketModel = require("../models/ticket");
var SpendModel = require("../models/spend");
var IngressModel = require("../models/ingress");
var PaybillModel = require("../models/paybill");
var AdjustModel = require("../models/product_adjustment");
var UserModel = require("../models/user");
var CorteModel = require("../models/corte");
var ProductModel = require("../models/product");
var mongoose = require("mongoose");
var moment = require("moment");
var async = require("async");

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

const initDashboardTotals = {
	tickets: 0,
	total_tickets: 0,
	spends: 0,
	total_spends: 0,
	ingresses: 0,
	total_ingresses: 0,
	paybills: 0,
	total_paybills: 0,
	returns: 0,
	total_returns: 0,
	diff: 0
};

const initDashboardData = {
	tickets: [],
	ingresses: [],
	spends: [],
	paybills: [],
	returns: []
};
const initHistoryTotals = {
	tickets: {
		quantity: 0,
		total: 0
	},
	cars: {
		total: 0,
		data: []
	},
	services: {
		total: 0,
		data: []
	},
	products: {
		total: 0,
		data: []
	},
	spends: {
		total: 0,
		data: []
	},
	ingresses: {
		total: 0,
		data: []
	},
	paybills: {
		total: 0,
		data: []
	},
	returns: {
		total: 0,
		data: []
	},
	inventory: [],
	diff: 0
};

function parseDashboardTotals({ tickets, ingresses, spends, paybills, returns }) {
	let totalTickets = 0;
	tickets.forEach(t => {
		totalTickets += t.total;
	});
	let totalIngresses = 0;
	ingresses.forEach(t => {
		totalIngresses += t.total;
	});
	let totalSpends = 0;
	spends.forEach(t => {
		totalSpends += t.total;
	});
	let totalPaybills = 0;
	paybills.forEach(t => {
		totalPaybills += t.total;
	});
	let totalReturns = 0;
	returns.forEach(t => {
		totalReturns += t.total;
	});

	return {
		tickets: tickets.length,
		total_tickets: totalTickets,
		spends: spends.length,
		total_spends: totalSpends,
		ingresses: ingresses.length,
		total_ingresses: totalIngresses,
		paybills: paybills.length,
		total_paybills: totalPaybills,
		returns: returns.length,
		total_returns: totalReturns,
		diff: ((totalTickets + totalIngresses) - (totalSpends + totalReturns))
	}
}

function parseHistoryTotals(cortes) {
	let toReturn = JSON.parse(JSON.stringify(initHistoryTotals));
	let mapCars = {};
	let mapServices = {};
	let mapProducts = {};
	let mapReturns = {};
	let mapInventory = {};

	cortes.forEach(corte => {
		toReturn.tickets.quantity += corte.totals.tickets.quantity;
		toReturn.tickets.total += corte.totals.tickets.total;

		toReturn.cars.total += corte.totals.cars.total;
		corte.totals.cars.data.forEach(c => {
			if (!mapCars[c.denomination]) {
				mapCars[c.denomination] = {
					quantity: c.quantity,
					denomination: c.denomination,
					total: c.total
				}
			} else {
				mapCars[c.denomination].quantity += c.quantity;
				mapCars[c.denomination].total += c.total;
			}
		});

		toReturn.services.total += corte.totals.services.total;
		corte.totals.services.data.forEach(c => {
			if (!mapServices[c.denomination]) {
				mapServices[c.denomination] = {
					quantity: c.quantity,
					denomination: c.denomination,
					total: c.total
				}
			} else {
				mapServices[c.denomination].quantity += c.quantity;
				mapServices[c.denomination].total += c.total;
			}
		});

		toReturn.products.total += corte.totals.products.total;
		corte.totals.products.data.forEach(c => {
			if (!mapProducts[c.denomination]) {
				mapProducts[c.denomination] = {
					quantity: c.quantity,
					denomination: c.denomination,
					total: c.total
				}
			} else {
				mapProducts[c.denomination].quantity += c.quantity;
				mapProducts[c.denomination].total += c.total;
			}
		});

		toReturn.spends.total += corte.totals.spends.total;
		corte.totals.spends.data.forEach(c => { toReturn.spends.data.push(c) });

		toReturn.ingresses.total += corte.totals.ingresses.total;
		corte.totals.ingresses.data.forEach(c => { toReturn.ingresses.data.push(c) });

		toReturn.paybills.total += corte.totals.paybills.total;
		corte.totals.paybills.data.forEach(c => { toReturn.paybills.data.push(c) });

		toReturn.returns.total += corte.totals.returns.total;
		corte.totals.returns.data.forEach(c => {
			if (!mapReturns[c.denomination]) {
				mapReturns[c.denomination] = {
					quantity: c.quantity,
					denomination: c.denomination,
					total: c.total
				}
			} else {
				mapReturns[c.denomination].quantity += c.quantity;
				mapReturns[c.denomination].total += c.total;
			}
		});
		corte.totals.inventory.forEach(c => { toReturn.inventory.push(c) });

		toReturn.diff += corte.totals.diff;
	});


	Object.keys(mapCars).forEach(key => { toReturn.cars.data.push(mapCars[key]) });
	Object.keys(mapServices).forEach(key => { toReturn.services.data.push(mapServices[key]) });
	Object.keys(mapProducts).forEach(key => { toReturn.products.data.push(mapProducts[key]) });
	Object.keys(mapReturns).forEach(key => { toReturn.returns.data.push(mapReturns[key]) });
	Object.keys(mapInventory).forEach(key => { toReturn.inventory.data.push(mapInventory[key]) });

	return toReturn;
}

module.exports = {

	// history query process:
	// 1 - select dates:
	// 2 - show aggs and all cortes in range
	// 3 - if is Mensual Report return also all the products (diff).
	// 4 - onClick on corte, show detail like dashboard (corteOBJ).
	History: (req, res, next) => {
		var Filter = {}
		if (req.body.carwash_id != undefined) {
			Filter['carwash_id'] = ObjectId(req.body.carwash_id);
		}
		if (req.body.initial_date != undefined) {
			if (req.body.final_date != undefined) {
				Filter['initial_date'] = {
					'$gte': req.body.initial_date,
					'$lt': req.body.final_date
				};
			}
		}
		CorteModel.find(Filter).exec((err, results) => {
			if(err){
				return next(new errs.InternalServerError(err));
			} else {
				if (results.length > 0) {
					if (req.body.is_monthly == true) {
						ProductModel.find().exec((err, resultsP) => {
							if(err){
								return next(new errs.InternalServerError(err));
							} else {
								if (results.length > 0) {
									return res.json({
										success: true,
										data: {
											totals: parseHistoryTotals(results),
											products: resultsP
										}
									});
								} else {
									return res.json({
										success: true,
										data: {
											totals: parseHistoryTotals(results),
											products: []
										}
									});
								}
							}
						});
					} else {
						return res.json({
							success: true,
							data: {
								totals: parseHistoryTotals(results),
								products: []
							}
						});
					}
				} else {
					return res.json({
						success: true,
						data: {
							totals: initHistoryTotals,
							products: []
						}
					});
				}
			}
		});
	},

	// today dashboard: (carwash_id)
	// get the last corte:
	// search in all objects with corte_id (for detail porpuoses...)
	// get stats with arrayOfBillsid

	Dashboard: (req,res,next) => {
		// FOR FILTER   // CARWASH, DATE, CORTE, ISMONTHLY
		var Filter = {}
		if (req.body.carwash_id != undefined) {
			Filter['carwash_id'] = ObjectId(req.body.carwash_id);
			Filter['final_date'] = '';
		}
		// GET THE LAST ACTIVE CORTE
		CorteModel.findOne(Filter).sort({'_id': -1}).limit(1).exec((err, result) => {
			if(err){
				return next(new errs.InternalServerError(err));
			} else {
				if (result) {
					const lastCorteID = ObjectId(result._id);
					const tasks = [];
					// tickets query:
					tasks.push((callback) => {
						TicketModel.find({ corte_id: lastCorteID }).exec((err, resultT) => {
							if (!err) {
								callback(null, resultT);
							} else {
								callback(null, []);
							}
						});
					});
					// ingresses query:
					tasks.push((callback) => {
						IngressModel.find({ corte_id: lastCorteID}).exec((err, resultT) => {
							if (!err) {
								callback(null, resultT);
							} else {
								callback(null, []);
							}
						});
					});
					// spends query:
					tasks.push((callback) => {
						SpendModel.find({ corte_id: lastCorteID}).exec((err, resultT) => {
							if (!err) {
								callback(null, resultT);
							} else {
								callback(null, []);
							}
						});
					});
					// paybills query:
					tasks.push((callback) => {
						PaybillModel.find({ corte_id: lastCorteID}).exec((err, resultT) => {
							if (!err) {
								callback(null, resultT);
							} else {
								callback(null, []);
							}
						});
					});
					// returns query:
					tasks.push((callback) => {
						AdjustModel.find({ corte_id: lastCorteID, type: 'return' }).exec((err, resultT) => {
							if (!err) {
								callback(null, resultT);
							} else {
								callback(null, []);
							}
						});
					});
					async.series(tasks, ((err, responses) => {
						if (!err) {
							const data =  {
								tickets: responses[0],
								ingresses: responses[1],
								spends: responses[2],
								paybills: responses[3],
								returns: responses[4]
							};
							const result = parseDashboardTotals(data);
							return res.json({
								success: true,
								totals: result,
								data
							});
						} else {
							return res.json({
								success: true,
								data: initDashboardData,
								totals: initDashboardTotals
							});
						}
					}));
				} else {
					return res.json({
						success: true,
						data: initDashboardData,
						totals: initDashboardTotals
					});
				}
			}
		});
	},

	All: (req,res,next) => {
		var Paginator = {
			page: 1,
			limit: 50,
			sort: {
				created: -1, // desc
			}
		};

		// FOR PAGINATOR:
		if (req.body.page != undefined) {
			Paginator.page = req.body.page;
		}
		if (req.body.limit != undefined) {
			Paginator.limit = req.body.limit;
		}
		// FOR FILTER   // CARWASH, DATE, CORTE, ISMONTHLY
		var Filter = {
		}
		if (req.body.carwash_id != undefined) {
			Filter['carwash_id'] = req.body.carwash_id
		}
		if (req.body.corte_id != undefined) {
			Filter['corte_id'] = req.body.corte_id
		}
		if (req.body.initial_date != undefined) {
			if (req.body.final_date != undefined) {
				Filter['date'] = {
					'$gte': req.body.initial_date,
					'$lt': req.body.final_date
				};
			}
		}
		// FOR SORT
		if (req.body.sort_field != undefined) {
			Paginator.sort = {};
			Paginator.sort[req.body.sort_field] = -1;

			if (req.body.sort_order != undefined) {
				Paginator.sort[req.body.sort_field] = req.body.sort_order;
			}
		}
		CorteModel.paginate(Filter, Paginator, (err, result) => {
			if(err) {
				return next(new errs.InternalServerError(err));
			} else {
				let response = {success: true };
				response[nameModel['plural']] = result;
				return res.json(response);
			}
		});
	}
}


/*


CorteModel.aggregate([
	{
		$match: Filter
	},
	{
		$group: {
			_id: "$carwash_id",
			tickets: {$sum: "$totals.tickets"},
			total_tickets: {$sum: "$totals.total_tickets"},
			spends: {$sum: "$totals.spends"},
			total_spends: {$sum: "$totals.total_spends"},
			ingresses: {$sum: "$totals.ingresses"},
			total_ingresses: {$sum: "$totals.total_ingresses"},
			paybills: {$sum: "$totals.paybills"},
			total_paybills: {$sum: "$totals.total_paybills"},
			returns: {$sum: "$totals.returns"},
			total_returns: {$sum: "$totals.total_returns"},
		}
	}
], (err, result) => {
	if(err){
		return next(new errs.InternalServerError(err));
	} else {
		if (result.length > 0) {
			return res.json({ success: true, totals: result[0] });
		} else {
			return res.json({
				success: true,
				totals: initTotals
			});
		}
	}
});
	DashboardByLavado: function(req,res){
		var Tasks = [];
		var Query;
			var carwash_id = new ObjectId(req.params.carwash_id);

		if(req.body.initialDate && req.body.finalDate){
			var initialDate = moment(req.body.initialDate).toDate();
			var finalDate = moment(req.body.finalDate).toDate();
			if(req.body.corte_id){
				Query = {
					carwash_id: carwash_id,
					corte_id: String(req.body.corte_id),
					date: {
						$gte: initialDate,
						$lt: finalDate
					}
				};
			}else{
				Query = {
					carwash_id: carwash_id,
					date: {
						$gte: initialDate,
						$lt: finalDate
					}
				};
			}
		}else if(req.body.corte_id){
			Query = {
				carwash_id: carwash_id,
				corte_id: String(req.body.corte_id)
			};
		}else{
			var initialDate = moment().format('YYYY-MM-DD');
			var finalDate = moment().add(1,'day').format('YYYY-MM-DD');
			Query = {
				carwash_id: carwash_id,
				date: {
					$gte: initialDate,
					$lt: finalDate
				}
			};
		}

		//retrive all the tickets.
		Tasks.push(function(callback){
			TicketModel.aggregate([
				{$match: Query},
				{$group: {_id: "$carwash_id",count: {$sum: 1},total: {$sum: "$total"}}
			}], function (err, result){
				if(err){
					res.json({success:false,error:err});
				}
				if (result.length > 0) {
					callback(null,{'name':'tickets','count':result[0].count, 'total':result[0].total });
				} else{
					callback(null,{'name':'tickets','count':0, 'total':0 });
				}
			});
		});

		//retrive all the spends.
		Tasks.push(function(callback){
			SpendModel.aggregate([
				{$match: Query},
				{$group: {_id: "$carwash_id",count: {$sum: 1},total: {$sum: "$total"}}
			}], function (err, result){
				if(err){
					res.json({success:false,error:err});
				}
				if (result.length > 0){
					callback(null,{'name':'spends','count':result[0].count, 'total':result[0].total });
				}else {
					callback(null,{'name':'spends','count':0, 'total':0 });
				}
			});
		});

		//retrive all the Ingresses.
		Tasks.push(function(callback){
			IngressModel.aggregate([
				{$match: Query},
				{$group: {_id: "$carwash_id",count: {$sum: 1},total: {$sum: "$total"}}
			}], function (err, result){
				if(err){
					res.json({success:false,error:err});
				}
				if(result.length > 0 ){
					callback(null,{'name':'ingresses','count':result[0].count, 'total':result[0].total });
				}else{
					callback(null,{'name':'ingresses','count':0, 'total':0 });
				}
			});
		});
		//retrive all the Bills.
		Tasks.push(function(callback){
			PaybillModel.aggregate([
				{$match: Query},
				{$group: {_id: "$carwash_id",count: {$sum: 1},total: {$sum: "$total"}}
			}], function (err, result){
				if(err){
					res.json({success:false,error:err});
				}
				if(result.length > 0){
					callback(null,{'name':'paybills','count':result[0].count, 'total':result[0].total });
				}else{
					callback(null,{'name':'paybills','count':0, 'total':0 });
				}
			});
		});

		async.series(Tasks, function(err, result) {
				if (err){
					console.log(err);
				}
				var historyReturn = {};
				historyReturn.success = true;
				result.forEach(function(obj){
					historyReturn[obj.name] = {
						count: obj.count,
						total: obj.total
					};
				});
				if(historyReturn){
					res.json(historyReturn);
				}else{
					res.json({success: false , message:'Ocurrio algun error.'});
				}
		});
	},

	// USE THE PAGINATOR QUERY FOR WEB DETAIL: (FOUR PAGINATORS...)
	AllHistoryByLavado: function(req,res){

		var Tasks = [];
		var Query;
		var carwash_id = new ObjectId(req.params.carwash_id);
		var Paginator = {
			page: 1,
			limit: 10
		};
		if (req.body.page){
			Paginator.page = req.body.page;
		}
		if (req.body.limit) {
			Paginator.limit = req.body.limit;
		}
		if(req.body.initialDate && req.body.finalDate){
			var initialDate = moment(req.body.initialDate).toDate();
			var finalDate = moment(req.body.finalDate).toDate();

			if(req.body.corte_id){
				Query = {
					carwash_id: carwash_id,
					corte_id: String(req.body.corte_id),
					date: {
						$gt: initialDate,
						$lt: finalDate
					}
				};
			}else{
				Query = {
					carwash_id: carwash_id,
					date: {
						$gt: initialDate,
						$lt: finalDate
					}
				};
			}
		}else if(req.body.corte_id){
			Query = {
				carwash_id: carwash_id,
				corte_id: String(req.body.corte_id)
			};
		}else{
			var initialDate = moment().format('YYYY-MM-DD');
			var finalDate = moment().add(1,'day').format('YYYY-MM-DD');
			Query = {
				carwash_id: carwash_id,
				date: {
					$gt: initialDate,
					$lt: finalDate
				}
			};
		}

		//retrive all the tickets.
		Tasks.push(function(callback){
			TicketModel.paginate(Query,Paginator, function(err, result) {
				if(err){
					res.json({success:false,error:err});
				}else{
					callback(null,{'name':'tickets','data': result});
				}
			});
		});

		//retrive all the spends.
		Tasks.push(function(callback){
			SpendModel.paginate(Query,Paginator, function(err, result) {
				if(err){
					res.json({success:false,error:err});

				}else{
					callback(null,{'name':'spends','data': result});
				}
			});
		});

		//retrive all the Ingresses.
		Tasks.push(function(callback){
			IngressModel.paginate(Query,Paginator, function(err, result) {
				if(err){
					res.json({success:false,error:err});
				}else{
					callback(null,{'name':'ingresses','data': result});
				}
			});
		});
		//retrive all the Bills.
		Tasks.push(function(callback){
			PaybillModel.paginate(Query,Paginator, function(err, result) {
				if(err){
					res.json({success:false,error:err});
				}else{
					callback(null,{'name':'paybills','data': result});
				}
			});
		});

		async.series(Tasks, function(err, result) {
            if (err){
                console.log(err);
            }
            var historyReturn = {};
            historyReturn.success = true;
			result.forEach(function(obj){
				historyReturn[obj.name] = obj.data;
			});
			if(historyReturn){
	    		res.json(historyReturn);
			}else{
				res.json({success: false , message:'Ocurrio algun error.'});
			}
        });
	},

	UpdateByLavado: function(req,res){

		var TokenObj = req.decoded;
		var Tasks = [];

		req.body.tickets.forEach(function(reqTicket){
			Tasks.push(function(callback){
				var Ticket = new TicketModel();
				Ticket.carwash_id = reqTicket.carwash_id;
				Ticket.order_id = reqTicket.order_id;
				Ticket.corte_id = reqTicket.corte_id;
				Ticket.status = reqTicket.status;
				Ticket.user = reqTicket.user;
				Ticket.car.denomination = reqTicket.car.denomination;
				Ticket.car.price = Number(reqTicket.car.price);
				reqTicket.services.forEach(function(service){
					var tmp = {
						'denomination': service.denomination,
						'price': Number(service.price)
					}
					Ticket.services.push(tmp);
				});
				Ticket.services = reqTicket.services;
				Ticket.entryDate = reqTicket.entryDate;
				Ticket.exitDate = reqTicket.exitDate;
				Ticket.washingTime = reqTicket.washingTime;
				Ticket.total = reqTicket.total;
				Ticket.date = reqTicket.date;
				Ticket.save(function(err){
					if(err){
						callback(null,{'name':'tickets','_id':Ticket._id,'succesfull':false});
					}else{
						callback(null,{'name':'tickets','_id':Ticket._id,'succesfull':true});
					}
				});
			});
		});

		req.body.spends.forEach(function(reqSpend){
			Tasks.push(function(callback){
				var Spend = new SpendModel();
				Spend.carwash_id = reqSpend.carwash_id;
				Spend.corte_id = reqSpend.corte_id;
				Spend.denomination = reqSpend.denomination;
				Spend.total = reqSpend.total;
				if(reqSpend.isMonthly){
					Spend.isMonthly = reqSpend.isMonthly;
				}
				Spend.user = TokenObj.user_username;
				Spend.date = reqSpend.date;
				Spend.save(function(err){
					if(err){
						callback(null,{'name':'spends','_id':Spend._id,'succesfull':false});
					}else{
						callback(null,{'name':'spends','_id':Spend._id,'succesfull':true});
					}
				});
			});
		});

		req.body.ingresses.forEach(function(reqIngress){
			Tasks.push(function(callback){
				var Ingress = new IngressModel();
				Ingress.carwash_id = reqIngress.carwash_id;
				Ingress.corte_id = reqIngress.corte_id;
				Ingress.denomination = reqIngress.denomination;
				Ingress.total = reqIngress.total;
				Ingress.user = TokenObj.user_username;
				Ingress.date = reqIngress.date;
				Ingress.save(function(err){
					if(err){
						callback(null,{'name':'ingresses','_id':Ingress._id,'succesfull':false});
					}else{
						callback(null,{'name':'ingresses','_id':Ingress._id,'succesfull':true});
					}
				});
			});
		});

		req.body.paybills.forEach(function(reqPaybill){
			Tasks.push(function(callback){
				var Paybill = new PaybillModel();
				Paybill.carwash_id = reqPaybill.carwash_id;
				Paybill.corte_id = reqPaybill.corte_id;
				Paybill.denomination = reqPaybill.denomination;
				Paybill.total = reqPaybill.total;
				Paybill.user = TokenObj.user_username;
				Paybill.owner = reqPaybill.owner;
				Paybill.date = reqPaybill.date;
				Paybill.save(function(err){
					if(err){
						callback(null,{'name':'paybills','_id':Paybill._id,'succesfull':false});
					}else{
						callback(null,{'name':'paybills','_id':Paybill._id,'succesfull':true});
					}
				});
			});
		});

		req.body.cortes.forEach(function(reqCorte){
			Tasks.push(function(callback){
				var Corte = new CorteModel();
				Corte.carwash_id = reqCorte.carwash_id;
				Corte.corte_id = reqCorte.corte_id;
				Corte.user = reqCorte.user;
				Corte.date = reqCorte.date;
				Corte.save(function(err){
					if(err){
						callback(null,{'name':'cortes','_id':Corte._id,'succesfull':false});
					}else{
						callback(null,{'name':'cortes','_id':Corte._id,'succesfull':true});
					}
				});
			});
		});

		req.body.pendings.forEach(function(reqPending){
			Tasks.push(function(callback){
				var Pending = new PendingModel();
				Pending.date = reqPending.date;
				Pending.carwash_id = reqPending.carwash_id;
				Pending.user = reqPending.user_id;
				Pending.denomination = reqPending.denomination;
				Pending.corte_id = reqPending.corte_id;
				Pending.isDone = reqPending.isDone;

				Pending.save(function(err){
					if(err){
						callback(null,{'name':'pendings','_id':Pending._id,'succesfull':false});
					}else{
						callback(null,{'name':'pendings','_id':Pending._id,'succesfull':true});
					}
				});
			});
		});

		async.series(Tasks, function(err, Results) {
            if (err){
                console.log(err);
            }
			var arrayOfTicketsid = [];
			var arrayOfSpendsid = [];
			var arrayOfIngressid = [];
			var arrayOfBillsid = [];
			var arrayOfCortesid = [];
			var arrayOfPendingsid = [];

			Results.forEach(function(result){
				if(result.name == "tickets"){
					arrayOfTicketsid.push(result._id);
				}else if(result.name == "spends"){
					arrayOfSpendsid.push(result._id);
				}else if(result.name == "ingresses"){
					arrayOfIngressid.push(result._id);
				}else if(result.name == "paybills"){
					arrayOfBillsid.push(result._id);
				}else if(result.name == "cortes"){
					arrayOfCortesid.push(result._id);
				}else if(result.name == "pendings"){
					arrayOfPendingsid.push(result._id);
				}else{
				}
			});
			if(Results){
	    		res.json({
					success: true,
					tickets: arrayOfTicketsid,
					spends: arrayOfSpendsid,
					ingresses: arrayOfIngressid,
					paybills: arrayOfBillsid,
					cortes: arrayOfCortesid,
					pendings: arrayOfPendingsid,
					message:'Contenido Actualizado con el servidor.'
				});
			}else{
				res.json({success: false , message:'Ocurrio algun error.'});
			}
    	});
	},

	DeleteById: function(req,res){
		var Tasks = [];
		req.body.spends.forEach(function(spend_id){
			Tasks.push(function(callback){
				SpendModel.remove(
					{
						_id: spend_id
					},
					function(err,Spend){
						if(err){
							callback(null,false);
						}else{
							callback(null,true);
						}
					}
				);
			});
		});

		req.body.ingresses.forEach(function(ingress_id){
			Tasks.push(function(callback){
				IngressModel.remove(
					{
						_id: ingress_id
					},
					function(err,Ingress){
						if(err){
							callback(null,false);
						}else{
							callback(null,true);
						}
					}
				);
			});
		});

		req.body.paybills.forEach(function(paybill_id){
			Tasks.push(function(callback){
				PaybillModel.remove(
					{
						_id: paybill_id
					},
					function(err,Paybill){
						if(err){
							callback(null,false);
						}else{
							callback(null,true);
						}
					}
				);
			});
		});

		req.body.pendings.forEach(function(pending_id){
			Tasks.push(function(callback){
				PendingModel.remove(
					{
						_id: pending_id
					},
					function(err,Pending){
						if(err){
							callback(null,false);
						}else{
							callback(null,true);
						}
					}
				);
			});
		});

		async.series(Tasks, function(err, result) {
				if (err){
					console.log(err);
				}
				if(result){
					res.json({success: true , message: 'Todo Borrados.'});
				}else{
					res.json({success: false , message:'Ocurrio algun error.'});
				}
		});
	}
}


*/
