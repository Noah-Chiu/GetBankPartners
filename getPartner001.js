const request = require('request');
const cheerio = require('cheerio');
const pg = require('pg');

const url = 'https://www.piapp.com.tw/enterprise/partners';

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
    .query(`DELETE FROM partners WHERE card_no = '001';`)
        .then(result => {
            console.log('Delete completed');
            console.log(`Rows affected: ${result.rowCount}`);
        })
        .catch(err => console.log(err))

    request(url, function (error, response, body) {
        if (!error) {
            let $ = cheerio.load(body);
            let data = $(".tab_content .filter-store .desc");
            data.each(function (index, value) {
                let $ = cheerio.load(value)
                var title = $("h3").contents().filter(function () {
                    return this.nodeType === 3;
                });
                let discount = $(".p-discount").contents().filter(function () {
                    return this.nodeType === 3;
                });
                if (discount.text() !== "") {
                    const discountNum = discount.text().replace(/\D+\s+/g, '')
                    client
                    .query(`INSERT INTO partners (card_no, partner, rewards, start_date, expire_date, note)
                        VALUES ('001', '${title.text()}', ${discountNum} - 1, '2024-03-01', '2024-12-31', '每月每一卡人回饋上限300 P幣');`)
                        .then(() => {
                            console.log('successful!');
                            console.log(title.text(), discountNum);
                        })
                        .catch(err => console.log(err))
                } else {
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@', title.text());
                }
            });
        }
        else throw new Error(error);
    });
}

