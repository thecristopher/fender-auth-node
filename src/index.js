import './load-env.js';
import { app } from './server.js';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App in http://localhost:${port}`);
});

