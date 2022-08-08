const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash =require("express-flash");
const passport = require("passport");
const cors = require("cors") //cross-origin resource sharing
const axios = require('axios')
const url = require('url')

const initializePassport = require("./passportConfig");
const globalAPIKey = "dQovNOSOTUaNoNZcs6Yvon0WyjM6JeULJSAbL2effgzxknVhAh"; 

initializePassport(passport);

//const bodyParser = require('body-parser');
const path = require('path')


const PORT = process.env.PORT || 5010;
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
//app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(
    session({
    //what this does this a key we
    //want to keep secret and it's just going to encrypt all of our 
    //information we store in the session the next variable
    secret: 'secret', 
    

    //is should we it's saying should we save our session variables if nothing has
    //changed if none of our informations change which we don't want to do that's what I say well that's what I'm saying is false
    resave: false,

    //then finally save initialized that's also has to be false 
    //because we want to save session details if there's been no value placed
    //in the session which is false
    saveUninitialized: false

    

    })
);

app.use(passport.initialize());

app.use(passport.session());


app.use(flash());


app.get("/",(req,res)=>{
    //res.send("Hello");
    res.redirect('/users/dashboard');

});

app.get("/users/register", (req,res)=>{
    res.render("pages/register");
});

app.get("/users/login", (req,res)=>{
    console.log('testing login')
    res.render("pages/login");
});

app.get("/users/dashboard", (req, res) => {

    if (req.user != null)
        res.render("pages/Image_Display_Grid", { user: req.user.name });
    else
        res.redirect("/users/login");
});

app.get("/users/logout", (req, res)=>{
    req.logout(req.user, err => {
        if(err) return next(err);
        req.flash("success_msg", "You have logged out");
        res.redirect("/users/login");
    });
    
});

app.post("/users/register", async(req,res)=>{
    let name  = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;

    console.log(name, email,password, password2 );

   // console.log({ name, email, password, password2 });

    let errors=[];

   if(!name || !email || !password || !password2 ){
        errors.push({message:"Please enter all fields"});
    }

    if(password.length < 6 ){
        errors.push({message:"Password should be at least 6 characters"});
    }
    
    if(password != password2){
        errors.push({message:"Passwords do not match"});
    }

    if(errors.length > 0){
        res.render("pages/register",{ errors });
    }

    else{
        //form validation has passed
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(`SELECT * FROM users WHERE email=$1`, [email], (err, results)=>{
            if(err){
                throw err;
            }

            console.log(results.rows);

            if(results.rows.length>0){
                errors.push({message:"Email already registered"});
                res.render("pages/register", {errors});
            }
            else{
                pool.query(`INSERT INTO users (name,email,password)
                VALUES ($1,$2,$3)
                RETURNING id, password`, 
                [name, email, hashedPassword], 
                (err, results)=>{
                    if(err){
                        throw err;
                    }
                    console.log(results.rows);
                    req.flash("success_msg", "You are now registered! Please log in");
                    res.redirect("/users/login");
                })
            }
        });

    }
});

app.post("/users/login", passport.authenticate("local", {
    successRedirect:"/users/dashboard",
    failureRedirect:"/users/login",
    failureFlash: true
    })
);



// Plant ID and capture
app.get('/capture', (req, res) => {
    if (req.user == null)
        res.redirect("/users/login");
    else
        res.render('pages/scan_image')
});

app.get('/plant-info', (req, res) => {
    if (req.user == null)
        res.redirect("/users/login");
    else
        res.render('pages/Information')
});
app.get('/reset', async (req, res) => {

    if (req.user == null)
        res.redirect("/users/login");
    else {
        try {
            var commandstoDB = `TRUNCATE images;`

            const client = await pool.connect();
            const result = await client.query(commandstoDB);
            const data = { results: result.rows };

            res.redirect('/');
            status = 0;
            client.release();
        }
        catch (error) {
            console.log('X->', error);
            status = -2;
            res.json("None.")
        }
    }
})


// Server code that handles plant-scan requests.
app.get('/plantscanner-api/get-images', async (req, res) => {

    if (req.user == null)
        res.send("Invalid request.");

    try {
        var commandstoDB = `SELECT * from plant_entries;`

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

app.get('/plantscanner-api/get-image?', async (req, res) => {

    if (req.user == null)
        res.send("Invalid request.");
    else {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        if (query != null && query.id != null) {
            try {
                var commandstoDB = `SELECT * from plant_entries WHERE id= ${query.id};`;

                const client = await pool.connect();
                const result = await client.query(commandstoDB);
                const data = { results: result.rows };
                
                console.log(data)
              //  console.log(data.results[0].is_healthy)
                res.render("pages/Information", data);
                status = 0;
                client.release();
            }
            catch (error) {
                console.log('X->', error);
                status = -2;
                res.json("None.")
            }
        }
    }
})

app.get('/plantscanner-api/status', (req, res) => {
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

    var ERROR = false;

    if (req.user == null)
        res.send("Invalid API request.");


    var image_64 = req.body["image_data"];

    if (image_64 != null) {
        var image64 = image_64;

        // Process and send to plant-api
        // Get response JSON and process that into db ready form 
        // images_new => ID | common_name | latin_name | types | description | condition_types | description_health | base64

        plantData = await extract_plant_type(image_64);
        healthData = await extract_plant_health(image_64);

        // console.log("pd: ", plantData, "HD: ", healthData);


        if (plantData != null && healthData != null) {
            // Implement probability logic and break into sections to store into database.
            // Example: 

            

            if (plantData.suggestions != null) {
                // console.log("--->>>>", plantData.suggestions[0]);
                // console.log("--->>>>", healthData.health_assessment)

                if (plantData.suggestions[0].plant_details != null && plantData.suggestions[0].plant_details.common_names != null) {
                    if (plantData.suggestions[0].plant_details.wiki_description != null) {
                        var plant_object = {
                            common_name: plantData.suggestions[0].plant_details.common_names[0],
                            latin_name: plantData.suggestions[0].plant_name,
                            plant_description: plantData.suggestions[0].plant_details.wiki_description.value,
                            propagation_method: plantData.suggestions[0].plant_details.propagation_methods,
                            edible_parts: plantData.suggestions[0].plant_details.edible_parts,
                            disease_name: '',
                            disease_cause: '',
                            disease_description: '',
                            bio_treatment: '',
                            chem_treatment: '',
                            prev_treatment: '',
                            is_healthy: healthData.health_assessment.is_healthy,
                            base64: image64
                        };

                        if(!plant_object.is_healthy){
                            plant_object.disease_name = healthData.health_assessment.diseases[0].name
                            if(healthData.health_assessment.diseases[0].disease_details.cause != null){
                                plant_object.disease_cause = healthData.health_assessment.diseases[0].disease_details.cause
                            }
                            plant_object.disease_description = healthData.health_assessment.diseases[0].disease_details.description
                            if(healthData.health_assessment.diseases[0].disease_details.treatment.biological != null){
                                plant_object.bio_treatment = healthData.health_assessment.diseases[0].disease_details.treatment.biological[0]
                            }
                            if(healthData.health_assessment.diseases[0].disease_details.treatment.chemical != null){
                                plant_object.chem_treatment = healthData.health_assessment.diseases[0].disease_details.treatment.chemical[0]
                            }
                            if(healthData.health_assessment.diseases[0].disease_details.treatment.prevention != null){
                                plant_object.prev_treatment = healthData.health_assessment.diseases[0].disease_details.treatment.prevention[0]
                            }
                        }

                        console.log("plant obj -->", plant_object);
                        try {
                            var image64 = image_64;
                            var commandstoDB = `INSERT INTO  plant_entries (common_name, latin_name, plant_description, disease_name, disease_cause, disease_description, bio_treatment, chem_treatment, prev_treatment, 
                                is_healthy, image64) VALUES ('${plant_object.common_name}', '${plant_object.latin_name}', '${plant_object.plant_description}', '${plant_object.disease_name}', '${plant_object.disease_cause}', 
                                '${plant_object.disease_description}', '${plant_object.bio_treatment}', '${plant_object.chem_treatment}', '${plant_object.prev_treatment}','${plant_object.is_healthy}', '${image64}');`
                            //(id SERIAL, common_name VARCHAR(100), latin_name VARCHAR(100), plant_description VARCHAR(2872), disease_name VARCHAR(100), disease_cause VARCHAR(100), disease_description VARCHAR(2872), bio_treatment VARCHAR(2872), 
                            //chem_treatment VARCHAR(2872), prev_treatment VARCHAR(2872), is_healthy BOOLEAN, is_edible BOOLEAN, cuttings BOOLEAN, division BOOLEAN, grafting BOOLEAN, seeds BOOLEAN, spores BOOLEAN, suckers BOOLEAN, image64 VARCHAR(992801));
                            
                            const client = await pool.connect();
                            const result = await client.query(commandstoDB);
                            
                            if(plant_object.edible_parts != null || plant_object.propagation_method != null){//case 1
                                create_tag(plant_object); //creates tag for the plant
                            }

                            commandstoDB = `select max(ID) from plant_entries;`;

                            var result2 = await client.query(commandstoDB);
                            console.log('=>', result2.rows[0].max);

                            status = 0;
                            client.release();
                            res.json(result2.rows[0].max);
                        }
                        catch (error) {
                            console.log('X->', error);
                            status = -1;
                            ERROR = true;
                        }
                    }
                    else {
                        ERROR = true;
                    }
                }
                else {
                    ERROR = true;
                }
               

            }
            else {
                ERROR = true;
            }
            
        }
        else {
            ERROR = true;
        }
    }
    else {
        ERROR = true;
    }

    if (ERROR) {
        res.json(-1);
    }

});

app.post('/plantscanner-api/image64_test', async (req, res) => { // /systems-api/image64?data=
    if (req.user == null)
        res.send("Invalid API request.");


    var image_64 = req.body["image_data"];

    if (image_64 != null) {
        try {
            var image64 = image_64;
            var commandstoDB = `INSERT INTO  TEST_IMAGES (image_data) VALUES ('${image64}');`

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



function storeData(array1, arrayT) {
    array1.push(arrayT);
}

// api integration for plant id - adapated from source code at: https://github.com/flowerchecker/Plant-id-API/blob/master/node/plant_identification_example_https.js
async function extract_plant_type(image64, arrayT) {

    // getting img and converting to base64 - will need to replace with request to img database
    const base64img = [image64];

    var results = null;
    // arguments to send to api
    const data = {

        api_key: globalAPIKey,

        images: base64img, // replace with variable containing database image
        plant_language: 'en',
        plant_details: ['common_names',
            'name_authority', // latin name
            'wiki_description',
            'edible_parts',
            'propagation_methods'],
    }
    await axios.post('https://api.plant.id/v2/identify', data).then(apiRes => {
        results = (apiRes.data);
    }).catch(error => {
        console.error('Error: ', error)
    });

    return results;
}

// api integration for health assessment - adapted from source code at: https://github.com/flowerchecker/Plant-id-API/blob/master/node/health_assessment_example_https.js
async function extract_plant_health(image64, arrayT) {
    // getting img and converting to base64 - will need to replace with request to img database
    // absolute path of image, may differ when running locally
    const base64img = [image64];
    var results = null;

    // arguments to send to api
    const data = ({

        api_key: globalAPIKey,

        images: base64img, // replace with variable containing database image
        language: 'en',
        disease_details: ['cause',
            'common_names',
            'description',
            'local_name',
            'treatment'],
    })

    await axios.post('https://api.plant.id/v2/health_assessment', data).then(apiRes => {
        results = (apiRes.data);
    }).catch(error => {
        console.error('Error: ', error)
    })

    return results;
}

//creates tag entries in the tag_info db
async function create_tag(plant_obj){
    let is_edible = true;
    let is_cuttings = false;
    let is_division = false;
    let is_grafting = false;
    let is_seeds = false;
    let is_spores = false;
    let is_suckers = false;

    //tests whether any edible parts exists
    //case2
    if(plant_obj.edible_parts == null){
        is_edible = false;
    }

    //tests whether various propagation methods exist
    //case3
    if(plant_obj.propagation_method != null){
        plant_obj.propagation_method.forEach(element => {
            if(element == 'cuttings'){
                is_cuttings = true;
            }else if(element == 'division'){
                is_division = true;
            }else if(element == 'grafting'){
                is_grafting = true;
            }else if(element == 'seeds'){
                is_seeds = true;
            }else if(element == 'spores'){
                is_spores = true;
            }else if(element == 'suckers'){
                is_suckers = true;
            }
        });
    }
    
    try{
        //create a tag in the db
        let create_tag_query;
        //case 2
        if(plant_obj.propagation_method == null){
            create_tag_query = `UPDATE plant_entries SET is_edible = '${is_edible}' WHERE image64 = '${plant_obj.base64}';`
        }else if(plant_obj.edible_parts == null){//case 3
            create_tag_query = `UPDATE plant_entries SET cuttings = '${is_cuttings}', division = '${is_division}', grafting = '${is_grafting}', seeds = '${is_seeds}', spores = '${is_spores}', suckers = '${is_suckers}' WHERE image64 = '${plant_obj.base64}';`
        }else{//case 4
            create_tag_query = `UPDATE plant_entries SET is_edible = '${is_edible}', cuttings = '${is_cuttings}', division = '${is_division}', grafting = '${is_grafting}', seeds = '${is_seeds}', spores = '${is_spores}', suckers = '${is_suckers}' WHERE image64 = '${plant_obj.base64}';`
        }
        // console.log("tag query inside function --> ", create_tag_query)
        //(id SERIAL, common_name VARCHAR(100), latin_name VARCHAR(100), plant_description VARCHAR(2872), disease_name VARCHAR(100), disease_cause VARCHAR(100), disease_description VARCHAR(2872), bio_treatment VARCHAR(2872), chem_treatment VARCHAR(2872), prev_treatment VARCHAR(2872), 
        const client = await pool.connect();
        const result = await client.query(create_tag_query);
        const data = { results: result.rows };

        console.log('success updating entry in plant_entries')
    }catch(error){
        console.log(error);
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // allows us to export app for use in testing
