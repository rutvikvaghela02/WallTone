const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;



const mongoURI = 'mongodb+srv://rdvaghela078:Rutvik02@cienemahub.vuftzhf.mongodb.net/?retryWrites=true&w=majority&appName=cienemaHub';

// const mongoURI = "mongodb://localhost:27017/ringtone";



mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


app.use(cors());
app.use(bodyParser.json());



const ringtoneSchema = new mongoose.Schema({
  id: String,
  name: String,
  previewUrl: String,
});



const Ringtone = mongoose.model('Ringtone', ringtoneSchema);





app.post('/api/ringtones', async (req, res) => {
  const { id, name, previewUrl } = req.body;

  const newRingtone = new Ringtone({ id, name, previewUrl });

  try {
    const savedRingtone = await newRingtone.save();
    res.status(201).json(savedRingtone);
  } catch (error) {
    res.status(500).json({ error: 'Error saving ringtone' });
  }
});




app.get('/api/ringtones/:name', async (req, res) =>{
    const { name } = req.params;

    try{
        // const findRingtone = await Ringtone.findOne({name});
        const findRingtone = await Ringtone.findOne({ name: { $regex: name, $options: 'i' } }).exec();
        console.log(findRingtone)
        if (findRingtone) {
            //  findRingtone.filter((ele)=> ele.name.toLowerCase().includes({name}))
            console.log(findRingtone)
            res.status(200).json(findRingtone);
          } else {
            res.status(404).json({ message: 'Ringtone not found' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error fetching ringtone' });
        }
    }
);


app.post('/api/ringtones/All/all', async (req, res) => {
    try {
      const allRingtones = await Ringtone.find();
      console.log(allRingtones)
      if (allRingtones && allRingtones.length > 0) {
        res.status(200).json(allRingtones);
      } else {
        res.status(404).json({ message: 'No ringtones found' });
      }
    } catch (error) {
      console.error('Error fetching ringtones:', error);
      res.status(500).json({ error: 'Error fetching ringtones' });
    }
  });
  


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
