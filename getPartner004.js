const request = require('request');
const cheerio = require('cheerio');
const pg = require('pg');

const url = 'https://www.ctbcbank.com/content/dam/minisite/long/creditcard/LINEPay/store.html';

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

    // client
    // .query(`DELETE FROM partners WHERE card_no = '004';`)
    //     .then(result => {
    //         console.log('Delete completed');
    //         console.log(`Rows affected: ${result.rowCount}`);
    //     })
    //     .catch(err => console.log(err))

    request(url, function (error, response, body) {
        if (!error) {
            let $ = cheerio.load(body);
            let data = $(".store-table__data");
            data.each(function (index, value) {
                let $ = cheerio.load(value)
                const title = $(".store-table__col").eq(0).find("a").find("h3").text()
                const start_date = $(".store-table__col").eq(0).find("p").text().split("～")[0]
                const end_date = $(".store-table__col").eq(0).find("p").text().split("～")[1]
                const discount = $(".store-table__col").eq(1).find("p").find("span").text()
                const note = $(".store-table__col").eq(2).find("p").find("span").text()

                if (discount.includes("%")) {
                    const discountNum = discount.replace(/\D+|\s+/g, '')

                    // console.log("@", title);
                    // console.log("^", start_date);
                    // console.log("&", end_date);
                    // console.log("#", discount);
                    // console.log("%", note);

                    // console.log(title, discountNum, note, `${start_date}～${end_date}`);
                    client
                        .query(`INSERT INTO partners (card_no, partner, rewards, start_date, expire_date, note)
                    VALUES ('004', '${title}', ${discountNum} - 1, '${start_date}', '${end_date}', '${note}');`)
                        // .then(() => {
                        //     console.log('successful!');
                        //     console.log(title, discountNum);
                        // })
                        .catch(err => console.log(err))
                } else {
                    console.log("@@@@@@@@@@@@@@@@@@@", title);
                }
            });
        }
        else throw new Error(error);
    });
}

