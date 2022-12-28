const convert = require('xml-js');
const fs = require('fs');
const { getColumnInfoByTableList }  = require('./getDataFromLogisticSystem');
const { SourceObjects, SourceObject, Annotations  } =  require('./ClassDefinations/source-class');
const { TargetObjects, TargetObject  } =  require('./ClassDefinations/target-class');
const { Mappings, Mapping } =  require('./ClassDefinations/mapping-class');
const { RepTask } = require('./ClassDefinations/rep-task-class');

async function getTableMap(table_list,customConfig) {
    let column_list = []
    let table_map = {}
    try {
        column_list = await getColumnInfoByTableList(table_list,customConfig)
        // console.log(column_list)
    } catch(e) {
        if(e) {
            console.error(e)
            return
        }
    }

    column_list.forEach(column => {
        table_map.hasOwnProperty(column.TABLE_NAME) ? table_map[column.TABLE_NAME].push(column) : table_map[column.TABLE_NAME] = [column]
    })

    return table_map;
}

let toXmlOptions = {
    compact: true, 
    ignoreComment: true, 
    spaces: 4,
}

const writeXmlFile = (jsonContent, filename = './output/output.xml') => {
    const xmlContent = convert.json2xml(jsonContent, toXmlOptions)

    fs.writeFileSync(filename, xmlContent)
}


const jsonFormat = (source_table_map, replication_task_name = '',customConfig) => {
    // generate source objects
    let sourceObjectArr = []
    Object.keys(source_table_map).forEach(table_name => {
        const sourceObject = new SourceObject(table_name, source_table_map[table_name], customConfig.schema)
        sourceObjectArr.push(sourceObject.getJson())
    })

    const annotations = new Annotations()

    const sourceObjects = new SourceObjects({ SourceObject: sourceObjectArr, Annotations: annotations.getJson(), RemoteSourceName: customConfig.RemoteSourceName})


    // generate target objects
    let targetObjectArr = []
    let target_table_map = Object.assign({}, JSON.parse(JSON.stringify(source_table_map)))
    const log_sys_column = {
        COLUMN_NAME: 'LOG_SYS',
        DATA_TYPE_NAME: 'NVARCHAR',
        LENGTH: 10,
        IS_NULLABLE: 'true',
        IS_PRIMARY_KEY: 'true',
        PRECISION: null,
        SCALE: null
    }

    Object.keys(target_table_map).forEach(table_name => {
        target_table_map[table_name].unshift({
            TABLE_NAME: table_name,
            ...log_sys_column,
        })
        const targetObject = new TargetObject({tableName: table_name, column_list: target_table_map[table_name], })
        targetObjectArr.push(targetObject.getJson())
    })

    const targetObjects = new TargetObjects({ TargetObject: targetObjectArr })


    // generate mappings
    let mappingArr = []
    const log_sys_ProjectionExpression = customConfig.logisticSystemName;
    let mapping_table_map = Object.assign({}, JSON.parse(JSON.stringify(source_table_map)))
    Object.keys(mapping_table_map).forEach(table_name => {
        mapping_table_map[table_name] = mapping_table_map[table_name].map(table => ({...table, ProjectionExpression: `"${table.COLUMN_NAME}"`}))

        mapping_table_map[table_name].unshift({
            TABLE_NAME: table_name,
            ...log_sys_column,
            ProjectionExpression: `&#x27;${log_sys_ProjectionExpression}&#x27;`
        })

        const mapping = new Mapping({ tableName: table_name, column_list: mapping_table_map[table_name],RemoteObjectUniqueNamePrefix: customConfig.schema})
        mappingArr.push(mapping.getJson())
    })

    const mappings = new Mappings({ Mapping: mappingArr})
 

    const repTask = new RepTask({ 
        SourceObjects: sourceObjects.getJson(),
        TargetObjects: targetObjects.getJson(),
        Mappings: mappings.getJson(),
        Name: replication_task_name,
    })

    const replication_task = {
        RepTask: repTask.getJson(),
    }

    writeXmlFile(replication_task, `./output/replication_task-${replication_task_name}.xml`)
}

module.exports = {
    getTableMap,jsonFormat
}