function MongooseDbManager(dbname) {
    var dbase = new Object();
    var mongooseModule = require('mongoose');
    // provide with url :  ie where our db is existing
    var url = 'mongodb://' + 'localhost/' + dbname;

    // Connect to db
    this.connect = function () {
        var resolve, reject,
            connectPromise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });
        if(global.isConnected) {
             resolve(true);
        }    
        var that = this;
        mongooseModule.connect(url, function (err) {
            if (err) reject(false);
            console.log('Db connected');
            // Database referrence/ instance pointing to the database called dBmane
            global.isConnected = true;
            resolve(true);
        });
        return connectPromise;
    };
    // Fetch records from Db
    this.fetchDoc = function (Model, paramsObj) {
        var resolve, reject,
            fetchPromise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });
        var model = paramsObj;
        if(!model){
            model = {};
        }
        Model.find(model, function (err, docs) {
            if (err) {
                reject(false);
            }
            console.log('this fires after the post find hook', docs);
            resolve(docs);
        });
        return fetchPromise;
    };
    this.insertDoc = function (Model, item) {
        var resolve, reject,
            insertPromise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });
        var model = new Model(item);
        model.save(function (err) {
            if (err) reject(err);
            console.log('this fires after the `post` hook');
            resolve(true);
        });
        return insertPromise;
       // return Promise.resolve(true)
    };
    this.updateDoc = function (Model, paramsObj) {
                 var resolve, reject,
            searchPromise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });
        var model;
        //Query : Model.findOne({ 'name.last': 'Ghost' }, 'name occupation',
        Model.findOne(paramsObj, function (err, user) {
            if (err) {
                reject(false);
            }
            console.log('this fires after the post find hook', docs);
            resolve(user);
        });
        return searchPromise;

    };
    this.deleteDoc = function (tableName, fieldToDelete, valueToDelete) {
        dbase.collection(tableName).updateOne({
            fieldToDelete: valueToDelete
        });
    };
    this.searchDoc = function(Model, paramsObj) {
         var resolve, reject,
            searchPromise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });
        var model;
        //Query : Model.findOne({ 'name.last': 'Ghost' }, 'name occupation',
        Model.findOne(paramsObj, function (err, user) {
            if (err) {
                reject(false);
            }
            console.log('this fires after the post find hook', user);
            if(user)
                resolve(user);
            else
                reject(false);     
        });
        return searchPromise;
    };

}

module.exports = MongooseDbManager;