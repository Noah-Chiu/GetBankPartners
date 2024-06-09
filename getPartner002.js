const request = require('request');
const cheerio = require('cheerio');
const pg = require('pg');

const url = 'https://activity.ubot.com.tw/2024JiHoCard/index.htm';

const config = {
    host: 'dpg-cpfc9af109ks73bh74jg-a.singapore-postgres.render.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'admin',
    password: 'ictd2Ts3IUs09e3kKeBAr2r7zj4FP7Ng',
    database: 'noah_db',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else { addPartners(); }
});

function addPartners() {
    console.log(`Running query to PostgreSQL server: ${config.host}`);

    client
        .query(`DELETE FROM partners WHERE card_no = '002';`)
        .then(result => {
            console.log('Delete completed');
            console.log(`Rows affected: ${result.rowCount}`);
        })
        .catch(err => console.log(err))

    let data = "DAISO大創百貨、Standard Products、THREEPPY、日藥本舖、松本清、Tomod’s三友藥妝、 HANDS 台隆手創館、札幌藥妝、TSUTAYA BOOKSTORE、大葉高島屋、UNIQLO、GU、宜得利家居、DON DON DONKI".split("、")

    data.forEach((value) => {
        const title = value
        const discountNum = 4

        client
            .query(`INSERT INTO partners (card_no, partner, rewards, start_date, expire_date, note)
                VALUES ('002', '${title}', ${discountNum}, '2024-01-01', '2024-07-31', '月上限500元');`)
            .then(() => {
                console.log('successful!');
                console.log(title, discountNum);
            })
            .catch(err => console.log(err))
    });
}

