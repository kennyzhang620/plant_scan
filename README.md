# PlantScan
* Gitlab link (requires computing id): https://csil-git1.cs.surrey.sfu.ca/mda74/cmpt276project.git
* Web application link: https://plant-scan.herokuapp.com/users/login

## What is PlantScan?
PlantScan is a standalone web application designed for AVA Grows hydroponics management company, and it will allow users to identify a plant and analyze its health through a photo. Users will be able to login, take and upload photos of their plants to the application. The photos will be analyzed through the  plant identification API [Plant.id] (https://web.plant.id/), which utilizes machine learning to identify the type of plant in the photo and also return any potential stressors, such as unusual coloration, growing mold, or the presence of pests. Users will also be able to filter photos by tags, such as plants with flowers. With our application, we aim to make caring for plants more easily accessible to plant owners, as well as provide a scaffolding for AVA Grows to integrate a similar technology into their existing platform.

## Competitive Analysis
The problem is finding an algorithm that will figure out the general well-being of a plant and accurately identify a species. A partial solution to this problem is a tool called Convolutional Neural Network (CNN), which “is a class of neural networks that specializes in processing data that has a grid-like topology, such as an image. A digital image is a binary representation of visual data” (Mayank Mishra, 2020). More recently, researchers from Kingston University have found that CNN is able to accurately identify plant species by looking at multiple layers of each leaf, and comparing them to their corresponding plant species. Despite their conclusions not directly addressing the problem, CNN offers a pathway for further research into the identification and caring of plants using technological means.

Currently, there are other applications for the focus of this web application. However the other applications have received strong criticism for being too expensive, or very difficult to use even for individuals who are technologically literate. We aim to make this app obsolete from bugs and  cater this app to plant-parents who need accurate, quick, and helpful information about the plants that they are growing. By succeeding in developing this service, we will allow plant owners to more easily identify plant species as well as evaluate their plants’ general health. By making it simpler to check on the condition of their plants, users will be able to understand and respond to the needs of their plants quickly, especially when the stressors are not immediately obvious to the untrained eye. As a result, we aim to facilitate plant care for gardeners and other house plant owners with the creation of our application.

## Features
The features of PlantScan can be broken down into the following epics:
* Login/Register
    * Custom login using a PostgreSQL database
* Mobile/tablet friendly user interface
    * Photo management
    * Taking and uploading photos
    * Storing photos in a backend database
* Plant identification
    * Integration of external API for machine learning
    * Tag and sort plants by type
    * Store the information for each photo to reduce requests to API
* Health assessment
    * Integration of external API for machine learning
    * Report general health indicators including potential diseases and treatment

Users will be able to login (or be prompted to create a new account), take or upload a picture of a plant, and see information regarding its identity and health using machine learning from the [Plant.id] (https://web.plant.id/) API. They will also be able to filter the plants being displayed on their dashboard by attributes such as whether the plant is healthy and whether the plant is edible.

## UI Requirements
The UI mockups for the application have been drawn up here:
https://www.figma.com/file/fPKRRkejeu1IBHS1GXb9uA/Untitled?node-id=14%3A12

#### Pages
* **User Login:**
    * Users will be prompted to login or create a new account on the home page of the application. New users will be redirected to a ‘create new account’ page. User authentication will be saved and stored in the PostgreSQL database.
* **Upload Image:**
    * Users will be able to upload images to the application by taking a picture with their device.
* **Dashboard:**
    * Users will be able to view the photos they have previously uploaded, and click on the photos to view the details associated with that photo.
    * Users will be able to delete photos they have previously uploaded.
    * Users will be able to filter their photos by tags, for example, searching for all photos that contain flowers.
* **Plant Assessment/Information Display:**
    * Users will be able to see the following information associated with the plant(s) in the photo:
        * General information about the plant
            * Common name
            * Latin (scientific) name
            * Short Wikipedia description
            * Whether it is edible
            * How it propagates
        * If the plant is ill, general information about the disease
            * Disease name
            * Cause of disease
            * Short description
            * Local name
            * Potential treatments


## Technology
PlantScan uses the following technologies:
- **Heroku** - Host web application server
- **Node.js** - Handles backend requests
- **HTML/CSS/Javascript** - Handles frontend requests
- **PostgreSQL** - Backend database

## Installation

Ensure that node.js is installed on your machine.
Install these packages with npm if you have not done so:
- express
- bcrypt
- body-parser
- chai
- chai-http
- cors
- dotenv
- ejs
- express-flash
- express-session
- mocha
- passport
- passport-local
- pg

* To run the application, ensure that you are in the root of this repo and use:
  * <span style="font-family:Courier New; font-size:4em;">node server.js</span>
   
* Alternatively for automatic restarts upon source code change (Requires Python 3 or later):
  * <span style="font-family:Courier New; font-size:4em;">python auto.py</span>

## Contributors
PlantScan is the CMPT 276 group project created by Kenny Zhang, Parmida Saghafi, Manthan Desai, Jodie Lee, and Monzer Alismaael for AVA Technologies.
