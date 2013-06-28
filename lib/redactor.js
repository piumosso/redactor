define('redactor/Redactor', [
    'redactor/modules/Build',
    'redactor/modules/Block'
], function(Build, Block){
    var Redactor = {};

    // Публичное API
    _.extend(Redactor, {
        Build: Build,
        Block: Block
    });

    return Redactor;
});
