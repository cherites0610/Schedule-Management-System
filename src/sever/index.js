const express = require('express');
const app = express();
const port = 3000;

const jwt = require('jsonwebtoken')
const expiresIn = '1 days'

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { conMysql } = require('./mysql')

const CryptoJS = require("crypto-js");
const secretKey = '7#9$2%1&5*8@4'

const decryptWord = (word) => {
    return CryptoJS.AES.decrypt(word, secretKey).toString(CryptoJS.enc.Utf8);
}

app.post('/login', (req, res) => {
    const userName = req.body.userName;
    const encryptedPassword = req.body.encryptedPassword;

    let sql = ` SELECT \`id\`,\`name\` FROM \`user\` WHERE \`account\` = '${userName}' AND \`password\` = '${decryptWord(encryptedPassword)}'; `

    conMysql(sql).then((result => {
        if (result.length > 0) {
            const token = jwt.sign({ uId: result[0].id, name: result[0].name }, secretKey, { expiresIn: expiresIn })
            res.json({ token: token, uId: result[0].id, name: result[0].name, status: true })
        } else {
            res.json({ token: '', uId: '', name: '', status: false })
        }
    }))
})

app.post('/auth', (req, res) => {
    const token = req.body.token;
    let result;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            result = { token: '', uId: '', name: '', status: false };
        } else {
            //合法token，核發新token
            const newToken = jwt.sign({ uId: decoded.uId, name: decoded.name }, secretKey, { expiresIn: expiresIn })
            result = { token: newToken, uId: decoded.uId, name: decoded.name, status: true }
        }
    });
    res.send(result);
})

app.post('/getSchedulingByID', (req, res) => {
    const id = req.body.id

    let sql = ` SELECT s.sId,w.name,s.date,s.time,s.hour as restHour FROM \`scheduling\` AS s JOIN \`works\` AS w ON s.wId=w.wId WHERE s.uId=  ${id} `

    conMysql(sql).then((result => {
        res.json(result)
    }))
})

app.post('/getStatisticById', (req, res) => {
    const uId = req.body.uId;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;

    let sql =
        'SELECT ' +
        'COALESCE(SUM(HOUR), 0) AS totalHour, ' +
        'COALESCE(AVG(`hourlyRate`), 0) as avgRate, ' +
        'COALESCE(SUM(`hour` * `hourlyRate`), 0) AS totalCost ' +
        'FROM scheduling ' +
        `WHERE \`uId\` = '${uId}' ` +
        `AND \`date\` BETWEEN '${startTime}' AND '${endTime}';`


    conMysql(sql).then(result => {
        res.send(result)
    })
})

app.post('/setWorkTemplate', (req, res) => {
    const uId = req.body.uId;
    const wId = req.body.wId;
    const workName = req.body.workName;
    const hourlyRate = req.body.hourlyRate;

    let sql = ` INSERT INTO \`works\` VALUES (${uId},'${wId}','${workName}',${hourlyRate}); `
    conMysql(sql).then(result => {
        res.send(result)
    })
})

app.post('/getWorkTemplateByID', (req, res) => {
    const uId = req.body.uId;

    let sql = ` SELECT * FROM \`works\` WHERE \`uId\` = ${uId}; `

    conMysql(sql).then(result => {
        res.send(result)
    })
})

app.post('/getListByID', (req, res) => {
    const id = req.body.id;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    if(!startDate){
        startDate='1900-01-01';
        endDate='2500-12-30';
    }

    let sql = ` SELECT w.name AS workName,s.date,s.time,s.hour AS hoursWorked,(s.hour*s.hourlyRate) AS wage FROM \`scheduling\` AS s JOIN \`works\` AS w ON s.wId = w.wId  WHERE s.uId = ${id} AND s.date BETWEEN '${startDate}' AND '${endDate}' `;

    conMysql(sql).then((result => {
        res.json(result)
    }))
})

app.post('/deleteWorkTemplateByID', (req, res) => {
    const wId = req.body.wId;

    let sql = ` DELETE FROM \`works\` WHERE \`wId\` = '${wId}'; 
    `
    conMysql(sql).then((result => {
        res.json(result)
    }))
})

app.post('/getWorkById',(req,res) => {
    const uId = req.body.uId;

    let sql = ` SELECT \`name\` AS 'text',\`wId\` AS 'value' FROM \`works\` WHERE \`uId\` = ${uId}; `
    conMysql(sql).then((result => {
        res.json(result)
    })).catch((err)=> {
        res.json(err);
    })
})

app.post('/setSchedulingByID', (req, res) => {
    const uId = req.body.uId;
    const wId = req.body.wId;
    const date = req.body.date;
    const time = req.body.time;
    const hour = req.body.hour;
    const hourlyRate = req.body.hourlyRate;

    let sql = ` INSERT INTO \`scheduling\` (\`uId\`,\`wId\`,\`date\`,\`time\`,\`hour\`,\`hourlyRate\`) VALUES (${uId},'${wId}','${date}','${time}',${hour},${hourlyRate})`;

    conMysql(sql).then((result => {
        res.json(result)
    })).catch((err) => {
        res.json({state:500})
    })
})

app.post('/getWorkIdByName', (req, res) => {
    const workName = req.body.workName

    let sql = ` SELECT \`wId\` FROM \`works\` WHERE \`name\` = '${workName}'; `

    conMysql(sql).then((result => {
        res.json(result)
    }))
})

app.post('/editSchedulingBySchedulingId', (req, res) => {
    const newScheduling = JSON.parse(req.body.newScheduling);
    const SchedulingId = req.body.SchedulingId;

    let sql = ` UPDATE \`scheduling\` SET \`wId\` = '${newScheduling.wId}', \`date\` = '${newScheduling.date}', \`time\` = '${newScheduling.time}', \`hour\` = ${newScheduling.hour}, \`hourlyRate\` = ${newScheduling.hourlyRate} WHERE \`sId\` = ${SchedulingId}; `

    conMysql(sql).then((result => {
        res.json(result)
    }))
})

app.post('/deleteSchedulingByDateTime', (req, res) => {
    const date = req.body.date;
    const time = req.body.time;

    let sql = ` DELETE FROM \`scheduling\` WHERE \`date\` = '${date}' AND \`time\` = '${time}'; `

    conMysql(sql).then((result => {
        res.json(result)
    }))
})

app.listen(port, () => {
    console.log('服務器已啟動成功')
})