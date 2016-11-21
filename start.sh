if [ "$NODE_ENV" = "production" ]; then
    node srv
else
    nodemon srv
fi
