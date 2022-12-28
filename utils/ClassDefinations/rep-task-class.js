class RepTask {
    attributes = {}
    innerValue = {}

    constructor({
        SourceObjects = {},
        TargetObjects = {},
        Mappings = {},
        Description = '',
        Name = 'location',
        RepVersion = '2.0',
        Type = 'REALTIME'
    }) {
        this.attributes = {
            Name,
            Description,
            Type,
            RepVersion,
        }

        this.innerValue = {
            SourceObjects,
            TargetObjects,
            Mappings,
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

module.exports = {
    RepTask,
}