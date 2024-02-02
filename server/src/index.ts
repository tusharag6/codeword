import app from "./app";
import prisma from "./db";
prisma
  .$connect()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `Postgress Connected !!|| Server listening on port:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("Error connecting to postgres: ", error);
  });