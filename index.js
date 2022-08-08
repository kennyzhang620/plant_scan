// Plant and Camera interfcae

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(urlencodedParser);

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs');
app.get('/capture', (req, res) => res.render('pages/scan_image'));

// Database table required: images. "CREATE TABLE images (id SERIAL, image_data VARCHAR(50000))" without quotes

app.get('/plantscanner-api/get-images', async(req, res) => {
    try {
        var commandstoDB = `SELECT * from images;` 

        const client = await pool.connect();
        const result = await client.query(commandstoDB);
        const data = { results: result.rows };

        res.json(data);
        status = 0;
        client.release();
    }
    catch (error) {
        console.log('X->', error);
        status = -2; 
        res.json("None.")
    }

})

app.get('/plantscanner-api/status', (req,res) =>{
    res.json(status);
    status = 0;
});

app.get('/plantscanner-api/delete?', async (req, res) => {
    res.redirect('/');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if (query != null && query.id != null) {
        var deleteStr = `DELETE FROM images WHERE id = ${query.id}`;


        try {
            const client = await pool.connect();
            const result = await client.query(deleteStr);
            console.log('=>', result);

            status = 0;
            client.release();
        }
        catch (error) {
            console.log('X->', error);
            status = 1;
            res.end(error)
        }
    }
    else {
        status = 1;
    }
});

app.post('/plantscanner-api/image64', async (req, res) => { // /systems-api/image64?data=
    var image_64 = req.body["image_data"]

    if (image_64 != null) {
        try {
            var image64 = image_64;
            console.log("D:", image64);
            var commandstoDB = `INSERT INTO  images (image_data) VALUES ('${image64}');`

            const client = await pool.connect();
            const result = await client.query(commandstoDB);

            console.log('=>', result);

            status = 0;
            client.release();
        }
        catch (error) {
            console.log('X->', error);
            status = -1;
            res.end(error)
        }

    }

    res.send("Success!");

});


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
