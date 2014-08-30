var jade = require('jade');
var Q = require('q');


class JadeTemplate {
    constructor(templateString) {
        this.template = new jade.compile(templateString);
    }

    render(context) {
        var d = Q.defer();

        try {
            d.resolve(this.template(context));
        } catch (error) {
            d.reject(error);
        }

        return d.promise;
    }
}


exports.JadeTemplate = JadeTemplate;