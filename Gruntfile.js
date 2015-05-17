/**
 * Created by sam on 15-3-25.
 */

module.exports = function(grunt){
  grunt.initConfig({
    distDir: 'static',
    srcDir: 'public/src',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    dist:{
      css: '<%= distDir %>/css',
      js: '<%= distDir %>/js',
      imgs: '<%= distDir %>/imgs',
      vendor: '<%= distDir %>/vendor',
      favicon: '<%= distDir %>/favicon.png'
    },
    src:{
      imgWatch: '<%= srcDir %>/imgs/**/*',
      jsWatch: '<%= srcDir %>/js/**.js',
      vendorWatch: '<%= srcDir %>/vendor/**/*',
      scss: '<%= srcDir %>/scss/sys_bm.scss',
      scssWatch: '<%= srcDir %>/scss/**/*.scss',
      npm: 'node_modules'
    },
    clean: ['<%= distDir %>'],
    copy:{
      assets:{
        files: [
          { dest: '<%= dist.imgs %>/', src : '**', expand: true, cwd: '<%= srcDir %>/imgs' },
          { dest: '<%= distDir %>', src: 'favicon.png', expand: true, cwd: '<%= srcDir %>'},
          // for jquery.modal
          { dest: '<%= dist.css %>/', src: 'jquery.modal.css', expand: true, cwd: '<%= srcDir %>/vendor/jquery.modal'},
          { dest: '<%= dist.imgs %>/', src: 'close.png', expand:true, cwd: '<%= srcDir %>/vendor/jquery.modal'},
          { dest: '<%= dist.imgs %>/', src: 'spinner.gif', expand:true, cwd: '<%= srcDir %>/vendor/jquery.modal'}
        ]
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.jsWatch %>'],
        dest:'<%= dist.js %>/<%= pkg.name %>.js'
      },
      jquery:{
        src:['<%= src.npm %>/jquery/dist/jquery.js'],
        dest: '<%= dist.vendor %>/jquery.js'
      },
      html5shiv:{
        src: ['<%= src.npm %>/html5shiv/dist/html5shiv.min.js'],
        dest: '<%= dist.vendor %>/html5shiv.js'
      },
      'jquery.modal':{
        src:['<%= srcDir %>/vendor/jquery.modal/jquery.modal.js'],
        dest: '<%= dist.vendor %>/jquery.modal.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= srcDir %>/scss',
          cssDir: ['<%= dist.css %>'],
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
          '<%= src.vendorWatch %>',
          '<%= src.imgWatch %>'
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
