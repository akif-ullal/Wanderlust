const mongoose = require("mongoose");

const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b" },
    price: 1500,
    location: "Malibu",
    country: "United States",
    geometry: { type: "Point", coordinates: [-118.689423, 34.035591] }
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    price: 1200,
    location: "New York City",
    country: "United States",
    geometry: { type: "Point", coordinates: [-74.006015, 40.712728] }
  },
  {
    title: "Mountain Retreat",
    description: "Unplug and unwind in this peaceful mountain cabin.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d" },
    price: 1000,
    location: "Aspen",
    country: "United States",
    geometry: { type: "Point", coordinates: [-106.837002, 39.191099] }
  },
  {
    title: "Historic Villa in Tuscany",
    description: "Experience the charm of Tuscany in this beautifully restored villa.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945" },
    price: 2500,
    location: "Florence",
    country: "Italy",
    geometry: { type: "Point", coordinates: [11.255814, 43.769562] }
  },
  {
    title: "Secluded Treehouse Getaway",
    description: "Live among the treetops in this unique treehouse retreat.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" },
    price: 800,
    location: "Portland",
    country: "United States",
    geometry: { type: "Point", coordinates: [-122.676483, 45.523064] }
  },
  {
    title: "Beachfront Paradise",
    description: "This beachfront condo offers the ultimate relaxation.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    geometry: { type: "Point", coordinates: [-86.851528, 21.161908] }
  },
  {
    title: "Rustic Cabin by the Lake",
    description: "Fishing and kayaking on a serene lake.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    geometry: { type: "Point", coordinates: [-120.032351, 39.096849] }
  },
  {
    title: "Luxury Penthouse with City Views",
    description: "Panoramic city views from this stunning penthouse.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd" },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    geometry: { type: "Point", coordinates: [-118.243683, 34.052235] }
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description: "Ski directly from your doorstep.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb" },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    geometry: { type: "Point", coordinates: [7.228889, 46.096667] }
  },
  {
    title: "Safari Lodge in the Serengeti",
    description: "Witness the Great Migration up close.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e" },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    geometry: { type: "Point", coordinates: [34.68565, -2.333333] }
  },
  {
    title: "Historic Canal House",
    description: "Preserved canal house in Amsterdam.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4" },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
    geometry: { type: "Point", coordinates: [4.904139, 52.367573] }
  },
  {
    title: "Private Island Retreat",
    description: "Entire island to yourself.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972" },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    geometry: { type: "Point", coordinates: [178.065033, -17.713371] }
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description: "Quaint cottage with a thatched roof.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f" },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
    geometry: { type: "Point", coordinates: [-1.843299, 51.833889] }
  },
  {
    title: "Historic Brownstone in Boston",
    description: "Elegant historic brownstone.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1533619239233-6280475a633a" },
    price: 2200,
    location: "Boston",
    country: "United States",
    geometry: { type: "Point", coordinates: [-71.05888, 42.360082] }
  },
  {
    title: "Beachfront Bungalow in Bali",
    description: "Beachfront bungalow with a private pool.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1602391833977-358a52198938" },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
    geometry: { type: "Point", coordinates: [115.188919, -8.409518] }
  },
  {
    title: "Mountain View Cabin in Banff",
    description: "Mountain views in the Canadian Rockies.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb" },
    price: 1500,
    location: "Banff",
    country: "Canada",
    geometry: { type: "Point", coordinates: [-115.570807, 51.178362] }
  },
  {
    title: "Art Deco Apartment in Miami",
    description: "Stylish Art Deco apartment.",
    image: { filename: "listingimage", url: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579" },
    price: 1600,
    location: "Miami",
    country: "United States",
    geometry: { type: "Point", coordinates: [-80.19179, 25.761681] }
  },
  {
    title: "Tropical Villa in Phuket",
    description: "Luxury villa with infinity pool.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9" },
    price: 3000,
    location: "Phuket",
    country: "Thailand",
    geometry: { type: "Point", coordinates: [98.338088, 7.880448] }
  },
  {
    title: "Historic Castle in Scotland",
    description: "Live like royalty in the Highlands.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98" },
    price: 4000,
    location: "Scottish Highlands",
    country: "United Kingdom",
    geometry: { type: "Point", coordinates: [-4.202646, 57.477773] }
  },
  {
    title: "Desert Oasis in Dubai",
    description: "Luxury oasis in the desert.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1518684079-3c830dcef090" },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
    geometry: { type: "Point", coordinates: [55.270783, 25.204849] }
  },
  {
    title: "Rustic Log Cabin in Montana",
    description: "Surrounded by Montana wilderness.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f" },
    price: 1100,
    location: "Montana",
    country: "United States",
    geometry: { type: "Point", coordinates: [-110.362566, 46.879682] }
  },
  {
    title: "Beachfront Villa in Greece",
    description: "Crystal-clear Mediterranean waters.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f" },
    price: 2500,
    location: "Mykonos",
    country: "Greece",
    geometry: { type: "Point", coordinates: [25.328884, 37.446735] }
  },
  {
    title: "Eco-Friendly Treehouse Retreat",
    description: "Eco retreat in the forest.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7" },
    price: 750,
    location: "Costa Rica",
    country: "Costa Rica",
    geometry: { type: "Point", coordinates: [-84.090725, 9.748917] }
  },
  {
    title: "Historic Cottage in Charleston",
    description: "Historic charm with private garden.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904" },
    price: 1600,
    location: "Charleston",
    country: "United States",
    geometry: { type: "Point", coordinates: [-79.931051, 32.776475] }
  },
  {
    title: "Modern Apartment in Tokyo",
    description: "Modern apartment in Tokyo.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1480796927426-f609979314bd" },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
    geometry: { type: "Point", coordinates: [139.691706, 35.689487] }
  },
  {
    title: "Lakefront Cabin in New Hampshire",
    description: "Cabin by the scenic lake.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce" },
    price: 1200,
    location: "New Hampshire",
    country: "United States",
    geometry: { type: "Point", coordinates: [-71.572395, 43.193852] }
  },
  {
    title: "Luxury Villa in the Maldives",
    description: "Overwater villa with ocean views.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000" },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    geometry: { type: "Point", coordinates: [73.22068, 3.202778] }
  },
  {
    title: "Ski Chalet in Aspen",
    description: "Luxury ski chalet.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" },
    price: 4000,
    location: "Aspen",
    country: "United States",
    geometry: { type: "Point", coordinates: [-106.837002, 39.191099] }
  },
  {
    title: "Secluded Beach House in Costa Rica",
    description: "Secluded beach house on the Pacific coast.",
    image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2" },
    price: 1800,
    location: "Costa Rica",
    country: "Costa Rica",
    geometry: { type: "Point", coordinates: [-85.780251, 9.748917] }
  }
];

module.exports = { data: sampleListings };
