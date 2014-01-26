function PlateTemplate(templateString){
    var plate = require('plate');

    this.template = new plate.Template(templateString);
}


PlateTemplate.prototype.render = function(context, callback){
    this.template.render(context, function(err, html){
        if (err) {
            throw new Error('Ошибка рендеринга', err);
        } else {
            callback(html);
        }
    });
};


module.exports = PlateTemplate;
