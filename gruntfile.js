/**
 * Created by zj on 2017/3/29.
 */
module.exports = function (grunt) {


    grunt.initConfig({
        //文件改动重新启动服务
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            uglify: {
                files: ['public/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['public/**/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    //入口文件
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    //只要有文件变更，及重新执行设置的任务
    grunt.loadNpmTasks('grunt-contrib-watch');
    //实时监听app.js
    grunt.loadNpmTasks('grunt-nodemon');
    //针对慢任务的插件，优化构建时间(SCSS,LESS等)
    grunt.loadNpmTasks('grunt-concurrent');
    //为了保护grunt整个服务,某处出错不会导致整个应用停掉
    grunt.option('force', true);

    grunt.registerTask('default', ['concurrent'])
};