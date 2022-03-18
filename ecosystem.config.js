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
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
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
