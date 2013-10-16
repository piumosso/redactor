module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';',
                banner: '/*! <%= pkg.name %> */\n'
            },
            redactor: {
                src: ['lib/**/*.js'],
                dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.js'
            },
            redactorFull: {
                src: ['vendors/*.js', 'lib/**/*.js'],
                dest: 'dist/<%= pkg.name %>.full.<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> */\n'
            },
            redactor: {
                src: ['dist/<%= pkg.name %>.<%= pkg.version %>.js'],
                dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.min.js'
            },
            redactorFull: {
                src: ['dist/<%= pkg.name %>.full.<%= pkg.version %>.js'],
                dest: 'dist/<%= pkg.name %>.full.<%= pkg.version %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);
};
