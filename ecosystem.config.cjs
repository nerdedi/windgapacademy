module.exports = {
  apps: [{
    name: 'windgap-dev',
    script: 'npm',
    args: 'run dev',
    interpreter: 'none',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    env: {
      NODE_ENV: 'development',
      PORT: '3000'
    },
    error_file: './Logs/pm2-error.log',
    out_file: './Logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
