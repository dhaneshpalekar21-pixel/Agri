const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const seedProducts = [
  {
    productId: 'PRD-001',
    productName: 'BT Cotton Seeds 450g',
    category: 'Seeds',
    brand: 'Mahyco',
    description: 'High yield pest-resistant cotton seeds.',
    purchasePrice: 650,
    sellingPrice: 740,
    stockQuantity: 45,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=60',
    status: 'Active'
  },
  {
    productId: 'PRD-002',
    productName: 'Urea Fertilizer 50kg',
    category: 'Fertilizers',
    brand: 'IFFCO',
    description: 'Standard agricultural nitrogen fertilizer.',
    purchasePrice: 240,
    sellingPrice: 290,
    stockQuantity: 300,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd85?w=150&auto=format&fit=crop&q=60',
    status: 'Active'
  },
  {
    productId: 'PRD-003',
    productName: 'Bayer Confidor Insecticide',
    category: 'Pesticides',
    brand: 'Bayer',
    description: 'Highly effective systemic insecticide.',
    purchasePrice: 780,
    sellingPrice: 890,
    stockQuantity: 24,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=150&auto=format&fit=crop&q=60',
    status: 'Active'
  },
  {
    productId: 'PRD-004',
    productName: 'NPK 19:19:19 Fertilizer',
    category: 'Fertilizers',
    brand: 'Coromandel',
    description: 'Water soluble balanced fertilizer.',
    purchasePrice: 70,
    sellingPrice: 85,
    stockQuantity: 65,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd85?w=150&auto=format&fit=crop&q=60',
    status: 'Active'
  }
];

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to DB');
  await Product.deleteMany({});
  console.log('Cleared existing products');
  await Product.insertMany(seedProducts);
  console.log('Seeded new products');
  process.exit();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
