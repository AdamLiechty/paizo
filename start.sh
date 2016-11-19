if [ "$NODE_ENV" = "production" ]; then
    node srv
else
    nodemon srv & ng serve --proxy-config proxy.conf.json
fi
