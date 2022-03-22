// module.exports = {
//   apps: [
//     {
//       script: 'index.js',
//       watch: '.',
//     },
//     {
//       script: './service-worker/',
//       watch: ['./service-worker'],
//     },
//   ],

//   deploy: {
//     production: {
//       user: 'SSH_USERNAME',
//       host: 'SSH_HOSTMACHINE',
//       ref: 'origin/master',
//       repo: 'GIT_REPOSITORY',
//       path: 'DESTINATION_PATH',
//       'pre-deploy-local': '',
//       'post-deploy':
//         'npm install && pm2 reload ecosystem.config.js --env production',
//       'pre-setup': '',
//     },
//   },
// };
module.exports = {
  apps: [
    {
      name: 'serve-data-prod',
      script: 'dist/main.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'postgres',
        DB_DATABASE: 'task-management',
        STAGE: 'dev',
        JWT_SECRECT:
          'FrJBWSh^N$Lwj59?eTbC=La2hLwF3BN!F+D5bFD7+#$FPSCqp?wYh@vLd+HKTF%ZR#urx?dbPjcKkMdeRDjj$cw&RYD5Gk2KYhp7B4gu*fhZ=Q&xL#DwLeN%RXPudTFUw5++e68emrv$!n24N_gd5vMkD%YEk3E7X4_gwtY+b?DPty-^PfUcBkDwxWF!tR8+-7*p4V4euWRQLZH8#4KLeah9eDtA^^+DjU#jAh5rjR$g*#!hatqCkbZ^2@-ku%^w',
      },
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
