var jade = require('jade');
var Q = require('q');
var React = require('react');


class JadeTemplate {
  constructor(templateString) {
    this.template = new jade.compile(templateString());
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


class ReactTemplate {
  constructor(template) {
    console.log("template", template.toString());
    this.template = template;
  }

  render(context) {
    var d = Q.defer();

    try {
      d.resolve('123');
    } catch (error) {
      d.reject(error);
    }

    return d.promise;
  }
}


exports.JadeTemplate = JadeTemplate;
exports.ReactTemplate = ReactTemplate;
