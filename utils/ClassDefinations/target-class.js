class TargetObjects {
    attributes = {}
    innerValue = {}

    constructor({
        TargetObject = {},
    }) {

        this.innerValue = {
            TargetObject,
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

class TargetObject {
    attributes = {}
    innerValue = {}

    constructor({
        tableName,
        column_list = [],
        GeneratedByReptask = "true",
        ObjectNamePrefix = "",
        Type = "TABLE",
        WriterType = "UPSERT",
    }) {
        this.attributes = {
            ObjectName: `${ObjectNamePrefix}${tableName}`,
            Type,
            GeneratedByReptask,
            WriterType,
        }

        if(Array.isArray(column_list) && !!column_list.length) {
            const TargetColumns = {
                TargetColumn: [],
            }

            TargetColumns.TargetColumn = column_list.map(column => {
                const { DATA_TYPE_NAME: Datatype, LENGTH: Length, COLUMN_NAME: Name, IS_NULLABLE: Nullable, IS_PRIMARY_KEY: PartOfPrimaryKey, PRECISION: Precision, SCALE: Scale} = column
                const targetColumn = new TargetColumn({Datatype, Length, Name, Nullable, PartOfPrimaryKey, Precision, Scale})

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

    getJson() {
        return {
            _attributes: this.attributes,
        }
    }
}

module.exports = {
    TargetObjects,
    TargetObject,
}