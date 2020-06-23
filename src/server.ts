import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  const urlExist = require("url-exist");

  app.get( "/filteredimage/", async (req, res) => {

    if (!req.query.hasOwnProperty('image_url')) {
      return res.status(400).send(
        `invalid request: must contain query parameter "image_url"`);
    }

    let { image_url } = req.query;

    //let isDirExists = fs.existsSync(image_url) && fs.lstatSync(image_url).isFile();
    let filetype = image_url.substring(image_url.length - 4);
    let http = image_url.substring(0,4) == 'http';

    if ( !image_url || !(filetype === '.jpg') ) {
        return res.status(400).send(
          `invalid request: image_url must point to a valid picture endpoint`);
    }

    if (http) {
      (async () => {
        const exists = await urlExist(image_url);
          if (!exists) {
            res.status(422).send('unable to find or access file')
          }
        })();
    }

    const image = await filterImageFromURL(`${image_url}`)
    res.status(200).sendFile(image, () => {deleteLocalFiles([image]);})

  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
