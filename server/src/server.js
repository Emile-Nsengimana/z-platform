import 'regenerator-runtime';
import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';
import cors from 'cors';
 
 
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Welcome to ZPlatform APIs');
});

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${PORT}`);
});

export default app;