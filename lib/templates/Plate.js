define('redactor/templates/Plate', [
    'plate'
], function(plate){
    var Template = function(templateString){
        this.template = new plate.Template(templateString);
    };

    Template.prototype.render = function(context, callback){
        this.template.render(context, callback);
    };

    return Template;
});
