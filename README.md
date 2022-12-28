# SDI Replication Tasks Generation Tool 
The replication task generation tool is provided to help you to generate SDI replications tasks.
The tool is just for reference, please adjust based on your own requirement.
## How to use the tool?
### Steps:
1. Maintain /config/customConfig.json
2. Execute the following command in the root folder
```sh
    npm i    
```
4. Execute the following command in the root folder, replication_task-[ReplicationTaskName].xml files will be generated in the output folder
```sh
    npm run start   
```
5. Create you own .csv files based on your requirement. Put your replication task name in the first line and Maintain the table list in the first column of each csv file.(refer to /input/TMTablesforReplicationTaskSample1.csv & /input/TMTablesforReplicationTaskSample2.csv).
6. Perform step 4 to generate your replication_task-[ReplicationTaskName].xml file
___

## Limitations

1. This tool is ***NOT TO BE USED***  in ***Production System***
2. The tool is just for reference, please adjust based on your own requirement.
___
## Known Issues
None

___

## How to obtain support
This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.

___
