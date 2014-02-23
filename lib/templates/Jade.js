var jade = require('ja' + 'de'),
    Q = require('q');


function JadeTemplate(templateString){
    this.template = new jade.compile(templateString);
}


JadeTemplate.prototype.render = function(context){
    var d = Q.defer();

    try {
        d.resolve(this.template.render(context));
    } catch (error) {
        d.reject(error);
    }

    return d.promise;
};


module.exports = JadeTemplate;
