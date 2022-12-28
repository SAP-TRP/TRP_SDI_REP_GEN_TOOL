const { getCustomConfig, getEachCSVFileInfo } = require('./utils/getFileContent');
const { getTableMap,jsonFormat } = require('./utils/convertDataToXML');

/**
 * Step 1: Getting custom configuration from /config/customConfig.json
 */
const customConfig = getCustomConfig();
console.log(customConfig);
if (customConfig) {
/**
 * Step 2: Getting replication task name and table list mapping from each csv file under the input folder   
*/
   const [repTaskNames,tableListOfEachRepTask] = getEachCSVFileInfo();
   repTaskNames.forEach(repTaskname => {
      console.log(`The progrom is is processing ${repTaskname}`);
      console.log(tableListOfEachRepTask[repTaskname]);
/**
 * Step 3: Process each replication task and table list mapping, and covert to XML file for each replication task
 */
      getTableMap(tableListOfEachRepTask[repTaskname],customConfig).then(table_map => {
         jsonFormat(table_map, repTaskname,customConfig)
      });
   });
}



