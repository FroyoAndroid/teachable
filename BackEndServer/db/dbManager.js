function DbManager(dbname) {
    var dbase = new Object();
    var mongoModule = require('mongoDb');

    // create the mongo Client 
    var mongoClient = mongoModule.MongoClient;
    // provide with url :  ie where our db is existing
    var url = 'mongodb:' + 'lolocalhost/' + dbname;

    // Connect to db
    this.connect = function () {
        var that = this;
        return mongoClient.connect(url).then(function (db, err) {
            if (err) throw new Error('DB connectivity problem');
            console.log('Db connected');
            // Database referrence/ instance pointing to the database called dBmane
            dbase = db;
            return true;
        });
    };
    // Fetch records from Db
    this.fetchDoc = function (tableName, paramsObj) {
        var resolve, reject,
            fetchPromise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            })
        var records = [],
            // cursor will be fetching the entire data
            cursor;
        if (paramsObj) {
            cursor = dbase.collection(tableName).find(paramsObj);
        } else {
            cursor = dbase.collection(tableName).find();
        }
        // Interating through every row of the table
        cursor.each(function (err, doc) {
            console.log('retrieving docs', doc);

            if (doc === null) {
                resolve(records);
            } else {
                records.push(doc);
            }
        })
        return fetchPromise;
    };
    this.insertDoc = function (tableName, item) {
        // item :   {uId: userId, uName: name, email: emValue}
        return dbase.collection(tableName).insertOne(item);
    };
    this.updateDoc = function (tableName, fieldToUpdate, oldValue, updatedValue) {
        /**
         * 
        { "EmployeeName": "Soumya"},
         {
           $set: {
                 "EmployeeName": "Mohan"
                }
          }
         */
        dbase.collection(tableName).updateOne({
            fieldToUpdate: oldValue
        }, {
            $set: {
                fieldToUpdate: updatedValue
            }
        });
    };
    this.deleteDoc = function (tableName, fieldToDelete, valueToDelete) {
        dbase.collection(tableName).updateOne({
            fieldToDelete: valueToDelete
        });
    };

}

module.exports = DbManager;