import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredImage", async (req: Request, res: Response) => {
    const { image_url } = req.query;

    try {
      const url: URL = new URL(image_url);
      try {
        const image: string = await filterImageFromURL(url.toString());

        res.sendFile(image, null, async (err) => {
          if (err) {
            throw new Error(`Failed to send file, ${err}`);
          }
          await deleteLocalFiles([image]);
        });
      } catch (e) {
        res.status(500).send({ message: "Something went wrong.", error: e });
      }
    } catch (e) {
      res.status(400).send({ message: "Invalid Url", error: e });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
