class SourceObjects {
    attributes = {}
    innerValue = {}

    constructor({
        SourceObject = {},
        Annotations = {},
        RemoteSourceName, 
        //SourceType = 'HanaAdapter', 
        TTFullyQualifiedName = 'FALSE',
        VTFullyQualifiedName = 'FALSE',
        VirtualTableSchema = ''
    }) {
        this.attributes = { 
           // SourceType, 
            TTFullyQualifiedName,
            VTFullyQualifiedName,
            RemoteSourceName, 
            VirtualTableSchema,
        }

        this.innerValue = {
            SourceObject,
            Annotations,
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

class SourceObject {
    attributes = {}
    innerValue = {}

    constructor(SourceDisplayName, column_list = [], RemoteObjectUniqueNamePrefix) {

        this.attributes = {
            RemoteObjectUniqueName: `"${RemoteObjectUniqueNamePrefix}"."${SourceDisplayName}"`,
            SourceDisplayName,
        }

        if(Array.isArray(column_list) && !!column_list.length) {
            const SourceColumns = {
                SourceColumn: [],
            }
            SourceColumns.SourceColumn = column_list.map(column => {
                const { DATA_TYPE_NAME: Datatype, LENGTH: Length, COLUMN_NAME: Name, IS_NULLABLE: Nullable, IS_PRIMARY_KEY: PartOfPrimaryKey, PRECISION: Precision, SCALE: Scale} = column
                const sourceColumn = new SourceColumn({Datatype, Length, Name, Nullable, PartOfPrimaryKey, Precision, Scale})
                
                return {_attributes: sourceColumn.attributes}
            })

            this.innerValue = {
                SourceColumns,
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

class SourceColumn {
    attributes = {}

    constructor({ Datatype, Length, Name, Nullable, PartOfPrimaryKey, Precision, Scale}) {

        this.attributes = {
            Name,
            Datatype,
            Length: Length.toString(),
            Nullable,
            PartOfPrimaryKey,
        }

        if(Precision !== null && !!Precision.toString()) {
            this.attributes.Precision = Precision
        }

        if(Scale !== null && !!Scale.toString()) {
            this.attributes.Scale = Scale
        }
    }

    get attributes() {
        return this.attributes
    }
}

class Annotations {
    attributes = {}
    innerValue = {}

    constructor() {
        this.attributes = { Key: 'sap.im.properties' }
        this.innerValue = {
            Annotation: new Annotation().getJson(),
        }
    }

    getJson() {
        return {
            _attributes: this.attributes,
            ...this.innerValue,
        }
    }
}

class Annotation {
    attributes = {}
    
    constructor() {
        this.attributes = { Key: 'cdc', Value: 'true' }
    }

    getJson() {
        return {
            _attributes: this.attributes,
        }
    }
}


module.exports = {
    SourceObjects,
    SourceObject,
    SourceColumn,
    Annotations,
}