class Mappings {
    attributes = {}
    innerValue = {}

    constructor({
        Mapping = {},
    }) {
        this.innerValue = {
            Mapping,
        }
    }

    get attributes() {
        return this.attributes
    }

    set attributes(attributes) {
        this.attributes = attributes
    }

    getJson() {
        return {
            _attributes: this.attributes,
            ...this.innerValue,
        }
    }
}

class Mapping {
    attributes = {}
    innerValue = {}

    constructor({
        tableName,
        column_list = [],
        ObjectNamePrefix = '',
        RemoteObjectUniqueNamePrefix,
        ReplicationBehavior = 'InitAndRealtime',
        VTObjectNamePrefix = 'VT_',
        VTObjectName = tableName,
    }) {

        this.attributes = {
            ObjectName: `${ObjectNamePrefix}${tableName}`,
            RemoteObjectUniqueName: `"${RemoteObjectUniqueNamePrefix}"."${tableName}"`,
            ReplicationBehavior,
            VTObjectName: `${VTObjectNamePrefix}${VTObjectName}`,
        }

        if(Array.isArray(column_list) && !!column_list.length) {
            const TargetColumns = {
                TargetColumn: [],
            }

            TargetColumns.TargetColumn = column_list.map(column => {
                const { COLUMN_NAME: Name, ProjectionExpression } = column
                const targetColumn = new TargetColumn({ Name, ProjectionExpression })

                return targetColumn.getJson()
            })

            this.innerValue = {
                TargetColumns,
            }
        }
    }

    get Attributes() {
        return this.attributes
    }

    getJson() {
        return {
            _attributes: this.attributes,
            ...this.innerValue,
        }
    }
}

class TargetColumn {
    attributes = {}

    constructor({ Name, ProjectionExpression }) {

        this.attributes = { Name, ProjectionExpression }
    }

    get attributes() {
        return this.attributes
    }

    getJson() {
        return {
            _attributes: this.attributes,
        }
    }
}


module.exports = {
    Mappings,
    Mapping,
}