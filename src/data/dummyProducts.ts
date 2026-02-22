export interface DummyProduct {
  id: string
  name: string
  qty: number
  price: number
  discount: number
  discount_expired: string
  category: string
}

function addHours(date: Date, hours: number): string {
  const d = new Date(date)
  d.setHours(d.getHours() + hours)
  return d.toISOString()
}

const base = new Date()

export const dummyProducts: DummyProduct[] = [
  { id: '1', name: 'Wireless Bluetooth Earbuds', qty: 8, price: 299000, discount: 65, discount_expired: addHours(base, 5), category: 'Electronics' },
  { id: '2', name: 'Smart Watch Pro', qty: 6, price: 899000, discount: 55, discount_expired: addHours(base, 12), category: 'Electronics' },
  { id: '3', name: 'USB-C Fast Charger', qty: 100, price: 89000, discount: 30, discount_expired: addHours(base, 48), category: 'Accessories' },
  { id: '4', name: 'Mechanical Keyboard RGB', qty: 5, price: 649000, discount: 70, discount_expired: addHours(base, 2), category: 'Electronics' },
  { id: '5', name: 'Portable SSD 1TB', qty: 4, price: 1299000, discount: 60, discount_expired: addHours(base, 8), category: 'Electronics' },
  { id: '6', name: 'Desk Lamp LED', qty: 80, price: 159000, discount: 20, discount_expired: addHours(base, 72), category: 'Home' },
  { id: '7', name: 'Gaming Mouse', qty: 10, price: 349000, discount: 52, discount_expired: addHours(base, 6), category: 'Accessories' },
  { id: '8', name: 'Laptop Stand Aluminum', qty: 45, price: 199000, discount: 40, discount_expired: addHours(base, 24), category: 'Accessories' },
  { id: '9', name: 'Noise Cancelling Headphones', qty: 7, price: 749000, discount: 58, discount_expired: addHours(base, 4), category: 'Electronics' },
  { id: '10', name: 'Webcam HD 1080p', qty: 35, price: 429000, discount: 45, discount_expired: addHours(base, 18), category: 'Electronics' },
  { id: '11', name: 'Running Shoes Sport', qty: 55, price: 459000, discount: 35, discount_expired: addHours(base, 36), category: 'Sports' },
  { id: '12', name: 'Yoga Mat Premium', qty: 70, price: 129000, discount: 25, discount_expired: addHours(base, 60), category: 'Sports' },
  { id: '13', name: 'Cotton T-Shirt Basic', qty: 120, price: 89000, discount: 15, discount_expired: addHours(base, 96), category: 'Fashion' },
  { id: '14', name: 'Wireless Speaker Portable', qty: 3, price: 389000, discount: 62, discount_expired: addHours(base, 10), category: 'Electronics' },
  { id: '15', name: 'Coffee Maker Drip', qty: 42, price: 349000, discount: 28, discount_expired: addHours(base, 48), category: 'Kitchen' },
  { id: '16', name: 'Stainless Steel Water Bottle', qty: 90, price: 79000, discount: 22, discount_expired: addHours(base, 72), category: 'Accessories' },
  { id: '17', name: 'Tablet Stand Adjustable', qty: 65, price: 119000, discount: 38, discount_expired: addHours(base, 24), category: 'Accessories' },
  { id: '18', name: 'LED Strip Light 5m', qty: 9, price: 149000, discount: 54, discount_expired: addHours(base, 7), category: 'Home' },
  { id: '19', name: 'Bluetooth Receiver AUX', qty: 85, price: 69000, discount: 40, discount_expired: addHours(base, 30), category: 'Electronics' },
  { id: '20', name: 'Backpack Laptop 15"', qty: 52, price: 279000, discount: 48, discount_expired: addHours(base, 20), category: 'Fashion' },
  { id: '21', name: 'Face Moisturizer SPF 30', qty: 60, price: 189000, discount: 32, discount_expired: addHours(base, 42), category: 'Beauty' },
  { id: '22', name: 'Electric Toothbrush', qty: 2, price: 229000, discount: 56, discount_expired: addHours(base, 9), category: 'Beauty' },
  { id: '23', name: 'Non-Stick Frying Pan', qty: 75, price: 199000, discount: 30, discount_expired: addHours(base, 54), category: 'Kitchen' },
  { id: '24', name: 'Board Game Family', qty: 35, price: 159000, discount: 45, discount_expired: addHours(base, 26), category: 'Toys' },
  { id: '25', name: 'Wireless Router WiFi 6', qty: 6, price: 599000, discount: 68, discount_expired: addHours(base, 3), category: 'Electronics' },
  { id: '26', name: 'Office Chair Ergonomic', qty: 22, price: 899000, discount: 42, discount_expired: addHours(base, 32), category: 'Office' },
  { id: '27', name: 'Notebook Set 3 Pack', qty: 150, price: 49000, discount: 18, discount_expired: addHours(base, 120), category: 'Office' },
  { id: '28', name: 'Hair Dryer Ionic', qty: 40, price: 279000, discount: 50, discount_expired: addHours(base, 14), category: 'Beauty' },
  { id: '29', name: 'Dumbbells Set 2kg Pair', qty: 58, price: 129000, discount: 35, discount_expired: addHours(base, 44), category: 'Sports' },
  { id: '30', name: 'Sunglasses UV400', qty: 72, price: 149000, discount: 44, discount_expired: addHours(base, 28), category: 'Fashion' },
  { id: '31', name: 'USB Hub 4-Port', qty: 95, price: 79000, discount: 26, discount_expired: addHours(base, 66), category: 'Accessories' },
  { id: '32', name: 'Throw Pillow Cover Set', qty: 80, price: 99000, discount: 20, discount_expired: addHours(base, 84), category: 'Home' },
  { id: '33', name: 'Cookbook Best Recipes', qty: 45, price: 119000, discount: 38, discount_expired: addHours(base, 38), category: 'Books' },
  { id: '34', name: 'Phone Holder Car Mount', qty: 10, price: 59000, discount: 52, discount_expired: addHours(base, 11), category: 'Accessories' },
  { id: '35', name: 'Air Purifier Mini', qty: 4, price: 449000, discount: 58, discount_expired: addHours(base, 5), category: 'Home' },
  { id: '36', name: 'Sneakers Casual', qty: 62, price: 329000, discount: 36, discount_expired: addHours(base, 40), category: 'Fashion' },
  { id: '37', name: 'Desk Organizer Set', qty: 88, price: 89000, discount: 24, discount_expired: addHours(base, 78), category: 'Office' },
  { id: '38', name: 'Power Bank 20000mAh', qty: 8, price: 199000, discount: 55, discount_expired: addHours(base, 8), category: 'Electronics' },
  { id: '39', name: 'Essential Oil Diffuser', qty: 41, price: 169000, discount: 42, discount_expired: addHours(base, 34), category: 'Home' },
  { id: '40', name: 'Kids Puzzle 100 pcs', qty: 55, price: 79000, discount: 30, discount_expired: addHours(base, 52), category: 'Toys' },
  { id: '41', name: 'Salad Spinner', qty: 67, price: 99000, discount: 28, discount_expired: addHours(base, 46), category: 'Kitchen' },
  { id: '42', name: 'Fitness Tracker Band', qty: 7, price: 249000, discount: 64, discount_expired: addHours(base, 4), category: 'Sports' },
  { id: '43', name: 'Lipstick Set 3 Colors', qty: 38, price: 139000, discount: 48, discount_expired: addHours(base, 22), category: 'Beauty' },
  { id: '44', name: 'HDMI Cable 2m', qty: 130, price: 45000, discount: 15, discount_expired: addHours(base, 108), category: 'Accessories' },
  { id: '45', name: 'Reading Lamp Clip-On', qty: 56, price: 89000, discount: 34, discount_expired: addHours(base, 56), category: 'Home' },
  { id: '46', name: 'Wireless Earbuds Sport', qty: 5, price: 279000, discount: 60, discount_expired: addHours(base, 6), category: 'Electronics' },
  { id: '47', name: 'Belt Leather Classic', qty: 70, price: 159000, discount: 32, discount_expired: addHours(base, 62), category: 'Fashion' },
  { id: '48', name: 'Resistance Bands Set', qty: 82, price: 79000, discount: 40, discount_expired: addHours(base, 50), category: 'Sports' },
  { id: '49', name: 'Novel Bestseller', qty: 95, price: 89000, discount: 25, discount_expired: addHours(base, 90), category: 'Books' },
  { id: '50', name: 'Multitool Pocket', qty: 78, price: 129000, discount: 46, discount_expired: addHours(base, 16), category: 'Accessories' },
]
