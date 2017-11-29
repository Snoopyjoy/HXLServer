
module.exports = {
    env:"dev",
    //host:"localhost",
    port:18080,

    db: {
        host:"mongo.duapp.com",
        port:8908,
        name:"BQkKrUKvKFAgKBRPKTHo",
        option: {}
    },
     site:"http://192.168.0.253/",
    cdn:{
        res:"http://192.168.0.253:18080/"
    },
    socket:{
        link:"http://192.168.0.253:18081/"
    }

};
