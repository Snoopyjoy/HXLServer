
module.exports = {
    env:"dev",
    //host:"localhost",
    port:18080,
    vidSocketPort:8081,
    streamSocketPort:8082,
    db: {
        host:"mongo.duapp.com",
        port:8908,
        name:"BQkKrUKvKFAgKBRPKTHo",
        option: {}
    },
     site:"http://127.0.0.1/",
    cdn:{
        res:"http://127.0.0.1:18080/"
    },
    socket:{
        link:"http://127.0.0.1:18081/"
    }

};
