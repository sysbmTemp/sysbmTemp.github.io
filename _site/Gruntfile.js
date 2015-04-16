/**
 * Created by sam on 15-3-25.
 */

module.exports = function(grunt){
  grunt.initConfig({
    distDir: 'public/dist',
    srcDir: 'public/src',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src:{
      css: '<%= distDir %>/css',
      js: '<%= distDir %>/js',
      imgs: '<%= distDir %>/imgs',
      vendor: '<%= distDir %>/vendor',
      jsWatch: '<%= srcDir %>/js/**.js',
      vendorWatch: '<%= srcDir %>/vendor',
      scss: '<%= srcDir %>/scss/sys_bm.scss',
      scssWatch: '<%= srcDir %>/scss/**/*.scss',
      npm: 'node_modules'
    },
    clean: ['<%= distDir %>'],
    copy:{
      assets:{
        files: [
          { dest: '<%= src.imgs %>/', src : '**', expand: true, cwd: '<%= srcDir %>/imgs' },
          { dest: '<%= distDir %>', src: 'favicon.png', expand: true, cwd: '<%= srcDir %>'},
          // for jquery.modal
          { dest: '<%= src.css %>/', src: 'jquery.modal.css', expand: true, cwd: '<%= srcDir %>/vendor/jquery.modal'},
          { dest: '<%= src.imgs %>/', src: 'close.png', expand:true, cwd: '<%= srcDir %>/vendor/jquery.modal'},
          { dest: '<%= src.imgs %>/', src: 'spinner.gif', expand:true, cwd: '<%= srcDir %>/vendor/jquery.modal'}
        ]
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.jsWatch %>'],
        dest:'<%= src.js %>/<%= pkg.name %>.js'
      },
      jquery:{
        src:['<%= src.npm %>/jquery/dist/jquery.js'],
        dest: '<%= distDir %>/vendor/jquery.js'
      },
      html5shiv:{
        src: ['<%= src.npm %>/html5shiv/dist/html5shiv.min.js'],
        dest: '<%= distDir %>/vendor/html5shiv.js'
      },
      'jquery.modal':{
        src:['<%= src.vendorWatch %>/jquery.modal/jquery.modal.js'],
        dest: '<%= src.vendor %>/jquery.modal.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= srcDir %>/scss',
          cssDir: ['<%= src.css %>'],
          raw: 'preferred_syntax = :sass\n', // Use `raw` since it's not directly available
          outputStyle: 'compressed'
        }
      }
    },
    watch:{
      build: {
        files:[
          '<%= src.jsWatch %>',
          '<%= src.scssWatch %>',
          '<%= src.vendorWatch %>/**/*',
          '<%= srcDir %>/imgs/**/*'
        ],
        tasks:['build','timestamp']
      }
    }
  });

  //grunt.loadNpmTasks('name')
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  //grunt.registerTask('name', [dep])
  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['clean','concat','compass','copy:assets']);
};
