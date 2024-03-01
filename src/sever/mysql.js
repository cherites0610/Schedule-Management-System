const mysql = require('mysql')
//连接数据库的配置信息
const db_config = {
    host: 'localhost', //本地都是localhost
    user: 'root', //账户名
    password: '123456', //密码
    port: '3306', //端口号
    database: 'scheduling' //数据库的名称
}

function conMysql(sql) {
    let Myconnect = mysql.createConnection(db_config)

    Myconnect.connect(function (error) { })

    return new Promise((resolve, reject) => {
        Myconnect.query(sql, (err, result) => {
            if (err) {
                reject(err)
                closeMysql(Myconnect);
            } else {
                let res = JSON.parse(JSON.stringify(result))
                closeMysql(Myconnect)
                resolve(res)
            }
        })
    })
}

function closeMysql(Myconnect) {
    Myconnect.end(function (error) { })
}

exports.conMysql = conMysql