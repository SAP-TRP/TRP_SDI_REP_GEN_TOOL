
const fs = require('fs');

const getCustomConfig =  () => {
    const configJSON = fs.readFileSync("./config/customConfig.json","utf8");
    const config = JSON.parse(configJSON);
    let result = [];
   
    if (config[0]) {
       result  = config[0];  
      return result ;
    } else {
       console.log('Please config the customConfig.json correctly');      
    }    
 }

 const csvToArray = (fileName) => {
   let csvContent = fs.readFileSync(`./input/${fileName}`, "utf8");
   let csvRows = csvContent.split("\r\n");

   const rows = csvRows.map(item => item.replace(/\s/g, '').split(","));

   const pattern = /^\s*$/;
   return pattern.test(rows[rows.length - 1].toString()) ?  rows.slice(0, -1) : rows;
}

const getEachCSVFileInfo = () => {

  const repTaskNames = [];
  const tableListOfEachRepTask = [];
  const csvFileNames = [];
  const result = [];
  let headerOfEachCSVFile, rowsOfEachCSVFile;
  

  // list all .csv files in the input folder
  try {
    const files = fs.readdirSync('./input');   
    files.forEach(file => {             
        if(file.endsWith('.csv')){
            csvFileNames.push(file);
        }
    })

  } catch (err) {
    console.log(err);
  }

  //get content of each csv file
  try {
    csvFileNames.forEach(csvFileName => {
      [ headerOfEachCSVFile,...rowsOfEachCSVFile ]  =   csvToArray(csvFileName);
       tableListOfEachRepTask[headerOfEachCSVFile] = rowsOfEachCSVFile;
       repTaskNames.push(headerOfEachCSVFile);
    });
  } catch (err2) {
    console.log(err2);
  }
  
  return [repTaskNames,tableListOfEachRepTask];
}



module.exports = {getCustomConfig, getEachCSVFileInfo};