const hana = require("@sap/hana-client");

const getColumnInfoByTableList = (TableList,customConfig)=>{
    return new Promise(function(resolve, reject) {

        if(!Array.isArray(TableList) || !TableList.length) {
            reject('table list is empty or not a array!')
        }
    
        const quotePattern = /"|'/g
    
        const tableString = `('${ TableList.toString().replace(quotePattern, '').replace(/,/g, `','`) }')`

        console.log(tableString)
    
        const connOptions = {
            host: customConfig.logisticSystemHost,
            instanceNumber: customConfig.instanceNumber,
            schema: customConfig.schema,
            databaseName: customConfig.databaseName,
            user: customConfig.user,
            pwd: customConfig.pwd
        };
    
        const dbConnection = hana.createConnection();

        dbConnection.connect(connOptions, function (err) {
            if (err) reject(err);
            dbConnection.exec(
                `SELECT T0.TABLE_NAME, 
                        T0.COLUMN_NAME, 
                        T0.DATA_TYPE_NAME, 
                        CASE WHEN T0.DATA_TYPE_NAME IN ('DOUBLE', 'INTEGER', 'SMALLINT') THEN 0 ELSE T0.LENGTH END AS LENGTH, 
                        LOWER(T0.IS_NULLABLE) AS IS_NULLABLE, 
                        CASE WHEN T1.IS_PRIMARY_KEY IS NULL THEN 'false' ELSE LOWER(T1.IS_PRIMARY_KEY) END AS IS_PRIMARY_KEY, 
                        CASE WHEN T0.DATA_TYPE_NAME = 'DOUBLE' THEN 0 WHEN T0.DATA_TYPE_NAME = 'DECIMAL' THEN T0.LENGTH - T0.SCALE ELSE NULL END AS PRECISION,
                        CASE WHEN T0.DATA_TYPE_NAME = 'DOUBLE' THEN 0 WHEN T0.DATA_TYPE_NAME IN ('INTEGER', 'SMALLINT') THEN NULL ELSE T0.SCALE END AS SCALE
                from TABLE_COLUMNS T0
                LEFT OUTER JOIN (SELECT * FROM CONSTRAINTS WHERE IS_PRIMARY_KEY = 'TRUE') T1 ON (T0.SCHEMA_NAME = T1.SCHEMA_NAME AND T0.TABLE_NAME = T1.TABLE_NAME AND T0.COLUMN_NAME = T1.COLUMN_NAME)
                WHERE T0.SCHEMA_NAME = '${customConfig.schema}' AND T0.TABLE_NAME in ${tableString} order by T0.TABLE_NAME, T0.POSITION asc`,
                function (err, result) {
                    if (err) reject(err);
                    if(!Array.isArray(result) || !result.length) {
                        reject(`can not get table columns correctly from the schema ${customConfig.schema}`);
                    }
                    //console.log(result)
                    resolve(result)
                    dbConnection.disconnect();
                }
            );
        });
    })

};

module.exports = {
    getColumnInfoByTableList,
}