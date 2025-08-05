import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    trim: true,
    //fixed categories;
    enum: [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Salon for Women',
  'Salon for Men',
  'AC Repair',
  'Pest Control',
  'Laundry',
  'Packers & Movers',
  'Interior Designing',
  'Tutoring',
  'Mobile Repair',
  'CCTV Installation'
]

  },
  basePrice: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  image: {
  type: String,
  trim: true,
  default: 'https://via.placeholder.com/300',
  validate: {
    validator: v => /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v),
    message: props => `${props.value} is not a valid image URL!`
  }
}

}, {
  timestamps: true
});


const Service = mongoose.model('Service', ServiceSchema);
export default Service;