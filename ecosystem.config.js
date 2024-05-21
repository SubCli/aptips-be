module.exports = {
    apps: [
      {
        name: 'suidona-be',
        script: 'dist/main.js',
        instances: 'max', // số lượng instance, 'max' để dùng tất cả các CPU
        exec_mode: 'cluster', // dùng chế độ cluster để tận dụng đa CPU
        watch: false, // có thể bật để theo dõi thay đổi file và tự động restart
        env: {
          NODE_ENV: 'development',
          DATABASE_HOST: 'localhost',
          DATABASE_PORT: '3306',
          DATABASE_USER: 'root',
          DATABASE_PASSWORD: 'suIp@y2024',
          DATABASE_NAME: 'suidona',
        },
        env_production: {
          NODE_ENV: 'production',
          DATABASE_HOST: 'localhost',
          DATABASE_PORT: '3306',
          DATABASE_USER: 'root',
          DATABASE_PASSWORD: 'suIp@y2024',
          DATABASE_NAME: 'suidona',
        },
      },
    ],
  };
  