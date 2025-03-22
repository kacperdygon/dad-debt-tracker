import app, { connectMongoDB } from './api/app';

const PORT = process.env.PORT || 3000;

connectMongoDB().then(() => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Accepted origin: ${process.env.FRONTEND_URL}`)
});
