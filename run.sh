pm2 stop suidona-be
npm run build

pm2 start ecosystem.config.js --env development
# pm2 status