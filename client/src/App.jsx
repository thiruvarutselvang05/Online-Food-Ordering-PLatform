import React, { useState, useEffect, useRef } from "react";
import {
  LogOut,
  Home,
  ShoppingCart,
  User,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Utensils,
  BookOpen,
  X, // Added X icon for modal close
} from "lucide-react";

// --- 1. DATA DEFINITION (SwiftFeast Theme & Expanded Menu) ---

// --- A. LOCAL (South Indian) DATA ---

// Restaurant Names for the second filter bar (Local/South Indian Theme)
const localRestaurantOptions = [
  "All",
  "Madras Kitchen",
  "Chettinad Palace",
  "Tiffin Centre",
  "Kongu Mess",
  "Spice Grill",
  "Ambur Biryani House",
  "Gourmet Grill",
  "Best Sweets Co.",
  "Village Thali",
];

// Function to map a cuisine category to a stable, high-relevance search keyword
const getFoodKeyword = (cuisine) => {
  switch (cuisine) {
    case "Biryani":
      return "south indian biryani";
    case "Tiffin":
      return "south indian tiffin";
    case "Sweets":
      return "indian sweets dessert";
    case "Seafood":
      return "spicy prawn curry";
    case "Soups":
      return "south indian rasam soup";
    case "BBQ/Grill":
      return "indian tandoori chicken grill";
    case "Thali/Meals":
      return "south indian thali meal";
    case "Beverages":
      return "indian filter coffee drink";
    case "Chettinad":
      return "chettinad chicken curry";
    case "Kongunad":
      return "kongunad style food";
    case "Dosa":
      return "south indian dosa variety";
    case "Pasta":
      return "italian pasta dish";
    case "Curries":
      return "indian curry plate";
    case "Sandwiches":
      return "club sandwich";
    case "Pizza":
      return "italian pizza slice";
    default:
      return "indian food plate";
  }
};

// Global dish ID counter for generating unique IDs across categories
let currentDishId = 1;

// Helper function to generate food item data (used by both local and global)
const generateFoodItem = (
  id,
  name,
  price,
  cuisine, // Main category type: cuisine
  isVeg,
  offer = null,
  restaurantName,
  isMock = false // Flag to differentiate dynamically created mock items
) => {
  // **FINAL RELIABLE IMAGE LOGIC:** Use only the broad, stable keyword for the highest load success rate.
  const searchKeyword = getFoodKeyword(cuisine);

  // The image URL is simplified to category + fixed size, ensuring stability.
  const imageUrl = `https://source.unsplash.com/250x180/?${searchKeyword}&sig=${id}`;

  return {
    id: id,
    name: name,
    price: price,
    imageUrl: imageUrl,
    category: cuisine,
    restaurant: restaurantName, // Use passed restaurant name
    isVeg: isVeg,
    offer: offer,
    // Ensure every item has a full description
    description: `Experience the authentic taste of ${cuisine} cuisine with our specialty dish, ${name}. This item is prepared fresh with locally sourced spices and ingredients.`,
  };
};

// --- UPDATED CUISINE CATEGORIES (Local Theme) ---
const localCuisineCategories = [
  { name: "All Cuisines", icon: Home, filterKey: "All" },
  { name: "Spicy Curries", icon: "🌶️", filterKey: "Chettinad" },
  { name: "Breakfast Tiffins", icon: "🥞", filterKey: "Tiffin" },
  { name: "Country Style", icon: "🐔", filterKey: "Kongunad" },
  { name: "Sea Delights", icon: "🦐", filterKey: "Seafood" },
  { name: "Fragrant Rice", icon: "🍚", filterKey: "Biryani" },
  { name: "Indian Sweets", icon: "🍮", filterKey: "Sweets" },
  { name: "Fresh Drinks", icon: "🥤", filterKey: "Beverages" },
  { name: "Warm Soups", icon: "🥣", filterKey: "Soups" },
  { name: "Tandoor & Grill", icon: "🔥", filterKey: "BBQ/Grill" },
  { name: "Full Meals", icon: "🍛", filterKey: "Thali/Meals" },
  { name: "Snacks & Sides", icon: "🍟", filterKey: "Side Orders" },
];

// Generator for a large menu (Local Theme)
const localFoodItems = [];

const localDishNameTemplates = {
  Chettinad: [
    "Mutton Sukka Varuval",
    "Kozhi Varuval",
    "Fish Fry Masala",
    "Prawn Pepper Masala",
  ],
  Tiffin: [
    "Idiyappam & Sambar",
    "Veg Pongal",
    "Vada Curry Combo",
    "Aappam & Coconut Milk",
  ],
  Kongunad: [
    "Pallipalayam Chicken Fry",
    "Erode Mutton Briyani",
    "Kola Urundai Curry",
    "Kothu Parotta (Chicken)",
  ],
  Seafood: ["Crab Masala", "Squid Roast", "Nethili Fry", "Madras Fish Curry"],
  Biryani: [
    "Seeraga Samba Biryani",
    "Ambur Chicken Biryani",
    "Hyderabadi Veg Biryani",
    "Kushka",
  ],
  Sweets: ["Mysore Pak (250g)", "Jangiri (100g)", "Rasamalai", "Palkova"],
  Beverages: [
    "Fresh Lime Soda",
    "Spicy Buttermilk",
    "Filter Coffee",
    "Rose Milk",
  ],
  Soups: ["Nandu Rasam", "Vegetable Clear Soup", "Sweet Corn Soup"],
  "BBQ/Grill": ["Tandoori Prawns", "Grilled Paneer Tikka", "Mushroom Tandoori"],
  "Thali/Meals": ["South Indian Meal", "Executive Veg Lunch", "Mini Tiffin"],
  "Side Orders": ["French Fries", "Onion Pakoda", "Raita", "Chapati (2 pcs)"],
};

// Populate local food items
const localFilterKeys = localCuisineCategories
  .filter((c) => c.filterKey !== "All")
  .map((c) => c.filterKey);

localFilterKeys.forEach((categoryKey) => {
  const dishNames = localDishNameTemplates[categoryKey] || [
    `${categoryKey} Special 1`,
    `${categoryKey} Special 2`,
  ];

  const isVegCategory =
    categoryKey !== "Chettinad" &&
    categoryKey !== "Kongunad" &&
    categoryKey !== "Seafood" &&
    categoryKey !== "BBQ/Grill" &&
    categoryKey !== "Biryani";

  // Generate 20 dishes minimum per category
  for (let i = 1; i <= 20; i++) {
    const baseName = dishNames[Math.floor(Math.random() * dishNames.length)];
    const suffix = i % 5 === 0 ? " (Premium)" : i % 3 === 0 ? " (Small)" : "";
    const price = 100 + Math.floor(Math.random() * 400);
    const restaurantIndex =
      (currentDishId % (localRestaurantOptions.length - 1)) + 1;
    const restaurant = localRestaurantOptions[restaurantIndex];

    localFoodItems.push(
      generateFoodItem(
        currentDishId++,
        `${baseName}${suffix}`,
        price,
        categoryKey, // Use the actual category key for the dish data
        isVegCategory || i % 2 === 0, // Mix veg/non-veg where applicable
        i % 10 === 0 ? "20% OFF" : null,
        restaurant
      )
    );
  }
});

// --- B. GLOBAL (Fast Food) DATA ---

// New Global Restaurant Options
const globalRestaurantOptions = [
  "All",
  "McDonald's",
  "Burger King",
  "Pizza Hut",
  "Domino's",
  "KFC",
  "Starbucks",
];

// New Global Cuisine Categories
const globalCuisineCategories = [
  { name: "All", icon: Home, filterKey: "All" },
  { name: "Burgers", icon: "🍔", filterKey: "Burger" },
  { name: "Chicken", icon: "🍗", filterKey: "Chicken" },
  { name: "Pizzas", icon: "🍕", filterKey: "Pizza" },
  { name: "Coffee", icon: "☕", filterKey: "Coffee" },
  { name: "Dessert", icon: "🍦", filterKey: "Dessert" },
  { name: "Fries & Sides", icon: "🍟", filterKey: "Fries" },
];

const globalDishNameTemplates = {
  Burger: [
    { name: "Big Mac Combo", res: "McDonald's" },
    { name: "Whopper Meal", res: "Burger King" },
    { name: "McSpicy Chicken Burger", res: "McDonald's" },
    { name: "Crispy Chicken Sandwich", res: "Burger King" },
  ],
  Chicken: [
    { name: "Zinger Burger", res: "KFC" },
    { name: "Hot Wings (6pc)", res: "KFC" },
    { name: "Chicken McNuggets (9pc)", res: "McDonald's" },
  ],
  Pizza: [
    { name: "Pepperoni Feast (L)", res: "Domino's" },
    { name: "Paneer Veggie Supreme", res: "Pizza Hut" },
    { name: "Margherita Classic", res: "Domino's" },
    { name: "Chicken Tikka Pizza", res: "Pizza Hut" },
  ],
  Coffee: [
    { name: "Caramel Macchiato (Large)", res: "Starbucks" },
    { name: "Cold Brew Original", res: "Starbucks" },
    { name: "Filter Coffee Indian", res: "Starbucks" },
  ],
  Dessert: [
    { name: "Chocolate Lava Cake", res: "Pizza Hut" },
    { name: "McFlurry Oreo", res: "McDonald's" },
    { name: "Brownie Fudge Sundae", res: "Burger King" },
  ],
  Fries: [
    { name: "French Fries (Large)", res: "McDonald's" },
    { name: "Peri Peri Fries", res: "KFC" },
    { name: "Cheesy Garlic Bread", res: "Domino's" },
  ],
};

const globalFoodItems = [];
let globalDishId = 10000;

Object.keys(globalDishNameTemplates).forEach((categoryKey) => {
  globalDishNameTemplates[categoryKey].forEach((template) => {
    // Generate 5 items per template to create variety
    for (let i = 1; i <= 5; i++) {
      const price = 150 + Math.floor(Math.random() * 300);
      const isVeg =
        categoryKey !== "Chicken" &&
        !template.name.toLowerCase().includes("chicken") &&
        !template.name.toLowerCase().includes("mutton");

      const newItem = generateFoodItem(
        globalDishId++,
        `${template.name} - V${i}`,
        price,
        categoryKey,
        isVeg,
        i === 1 ? "Top Rated" : null,
        template.res,
        true // isMock
      );
      globalFoodItems.push(newItem);
    }
  });
});
// Total global food items: ~90+

// --- C. SHARED DATA (Offers & General Categories) ---

// General Categories (used in the dedicated Global Cuisines bar)
const generalFoodCategoriesData = [
  // Existing data remains for the 'Global Cuisines' bar logic
  {
    name: "Dosa",
    icon: "🍽️",
    description: "A savory pancake from South India...",
    varieties: [
      { name: "Plain Dosa", detail: "A classic, crispy..." },
      { name: "Masala Dosa", detail: "Stuffed with a spiced..." },
      { name: "Mysore Masala Dosa", detail: "Features a spicy red..." },
      { name: "Rava Dosa", detail: "A quick, lacy, and crispy..." },
    ],
  },
  {
    name: "Biryani",
    icon: "🍚",
    description: "A fragrant rice dish...",
    varieties: [
      { name: "Hyderabadi Biryani", detail: "A spicy, flavorful..." },
      { name: "Lucknowi Biryani", detail: "A mild, fragrant..." },
      { name: "Kolkata Biryani", detail: "A lighter, Bengali..." },
      { name: "Malabar Biryani", detail: "A coastal Kerala..." },
    ],
  },
  {
    name: "Curries",
    icon: "🥘",
    description: "A wide category of saucy dishes...",
    varieties: [
      { name: "Chicken Tikka Masala", detail: "Grilled chicken chunks..." },
      { name: "Butter Chicken", detail: "Another creamy, tomato-based..." },
      { name: "Vindaloo", detail: "A very hot and spicy..." },
      { name: "Green Curry", detail: "A spicy Thai curry..." },
    ],
  },
  {
    name: "Soups",
    icon: "🥣",
    description: "A liquid food made by combining ingredients...",
    varieties: [
      { name: "Broth/Consommé", detail: "Clear soups; broth is a simple..." },
      { name: "Cream Soups", detail: "Thickened with a roux..." },
      { name: "Purée Soups", detail: "Made by puréeing one or more..." },
      {
        name: "French Onion Soup",
        detail: "A soup with a rich, beef stock...",
      },
    ],
  },
  {
    name: "Sandwiches",
    icon: "🥪",
    description: "Two or more pieces of bread with a filling...",
    varieties: [
      { name: "Club Sandwich", detail: "A double-decker sandwich..." },
      { name: "Grilled Cheese", detail: "A classic hot sandwich..." },
      { name: "BLT", detail: "Features bacon, lettuce, and tomato..." },
      { name: "Cuban Sandwich", detail: "A grilled ham and cheese..." },
    ],
  },
  {
    name: "Pizza",
    icon: "🍕",
    description: "A dish of Italian origin with a flat dough base...",
    varieties: [
      { name: "Neapolitan Pizza", detail: "The original pizza..." },
      {
        name: "New York-Style Pizza",
        detail: "Features a large, hand-tossed...",
      },
      { name: "Chicago Deep-Dish Pizza", detail: "A thick, pie-like pizza..." },
      { name: "Sicilian Pizza", detail: "A rectangular, thick-crust pizza..." },
    ],
  },
  {
    name: "Pasta",
    icon: "🍝",
    description: "A staple of Italian cuisine, pasta comes in a wide range...",
    varieties: [
      { name: "Spaghetti", detail: "Long, thin, and cylindrical noodles..." },
      { name: "Penne", detail: "Tube-shaped pasta with angled ends..." },
      { name: "Fettuccine", detail: "Flat, thick, and ribbon-like..." },
      { name: "Lasagna", detail: "Wide, flat sheets of pasta..." },
    ],
  },
];

// Mock data for generating 8 featured dishes dynamically (used for 'Global Cuisines' bar)
const generateGeneralCategoryDishes = (categoryName) => {
  // Simplified, keeping previous mock logic structure for stability
  const dishNames = {
    Dosa: [
      "Plain Dosa Supreme",
      "Masala Dosa Classic",
      "Mysore Dosa Delight",
      "Rava Dosa Special",
      "Neer Dosa with Curry",
      "Set Dosa Trio",
      "Paper Dosa Giant",
      "Onion Uthappam",
    ],
    Biryani: [
      "Hyderabadi Chicken Biryani",
      "Lucknowi Mutton Biryani",
      "Kolkata Egg Biryani",
      "Malabar Fish Biryani",
      "Ambur Veg Biryani",
      "Bamboo Shoot Biryani",
      "Kushka Deluxe",
      "Seeraga Samba Chicken",
    ],
    Curries: [
      "Chicken Tikka Masala",
      "Butter Chicken Premium",
      "Vindaloo Spicy Pork",
      "Green Curry Thai",
      "Massaman Curry Beef",
      "Beef Rendang Dry",
      "Japanese Curry Katsu",
      "Paneer Lababdar",
    ],
    Soups: [
      "Broth Clear Veg",
      "Cream of Mushroom",
      "Lentil Puree Soup",
      "Clam Chowder New England",
      "Minestrone Italian",
      "French Onion Gratinee",
      "Miso Tofu Soup",
      "Spicy Crab Rasam",
    ],
    Sandwiches: [
      "Club Sandwich Classic",
      "Grilled Cheese Cheddar",
      "BLT with Avocado",
      "Cuban Sandwich Pressed",
      "Banh Mi Chicken",
      "Open-Face Roast Beef",
      "Bombay Sandwich Grilled",
      "Veggie Submarine",
    ],
    Pizza: [
      "Neapolitan Margherita",
      "New York Pepperoni",
      "Chicago Deep Dish",
      "Sicilian Thick Crust",
      "California BBQ Chicken",
      "Detroit Red Top",
      "Four Cheese Pizza",
      "Tandoori Paneer Pizza",
    ],
    Pasta: [
      "Spaghetti Bolognese",
      "Penne Arrabbiata",
      "Fettuccine Alfredo",
      "Lasagna Italiano",
      "Ravioli Spinach Cheese",
      "Macaroni & Cheese",
      "Fusilli Pesto",
      "Farfalle Primavera",
    ],
  };

  const dishes = [];
  const baseId = 50000 + Math.floor(Math.random() * 100) * 100;

  const names = dishNames[categoryName] || [];
  const numDishes = Math.min(8, names.length);

  for (let i = 0; i < numDishes; i++) {
    const name = names[i];
    const basePrice = 200 + i * 30;
    const price = basePrice + Math.floor(Math.random() * 40);
    const isVeg =
      name.toLowerCase().includes("veg") ||
      name.toLowerCase().includes("paneer") ||
      categoryName === "Dosa" ||
      categoryName === "Pasta";

    dishes.push(
      generateFoodItem(
        baseId + i,
        name,
        price,
        categoryName,
        isVeg,
        i === 0 ? "Chef's Special" : null,
        "SwiftFeast Kitchen",
        true
      )
    );
  }
  return dishes;
};

// Offers data (used by the dedicated OffersPage)
const offers = [
  // ... (Offers data remains unchanged)
  {
    id: 9001,
    name: "Family Biryani Combo",
    price: 999.0,
    size: "4 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?biryani,family,indian&sig=1",
    description:
      "Serves 4. Includes 2 Chicken Biryani, 2 Veg Biryani, 4 Raita, and 4 Gulab Jamun. Perfect for a weekend feast!",
    customization: true,
  },
  {
    id: 9002,
    name: "Couple's Delight Biryani",
    price: 650.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?biryani,couple,spicy&sig=2",
    description:
      "Serves 2. Choose any two Chicken or Mutton Biryanis with 2 portion of salan and 2 soft drinks.",
    customization: true,
  },
  {
    id: 9003,
    name: "Veg Biryani Value Pack",
    price: 499.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?veg,rice,indian&sig=3",
    description:
      "Two portions of Hyderabadi Veg Biryani served with large portion of Mirchi ka Salan and 2 Butter Milks.",
    customization: false,
  },
  {
    id: 9004,
    name: "Mutton Biryani Special",
    price: 899.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?mutton,biryani,spices&sig=4",
    description:
      "Premium Mutton Biryani (2 servings) with double meat quantity. Includes a free dessert.",
    customization: false,
  },

  // Tiffin/Breakfast Combos (4)
  {
    id: 9005,
    name: "Breakfast Tiffin Platter",
    price: 350.0,
    size: "1 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?dosa,idli,sambar&sig=5",
    description:
      "Assortment of Idli, Vada, Mini Dosa, and Pongal. Served with 3 chutneys and Sambar. Available until 11 AM.",
    customization: false,
  },
  {
    id: 9006,
    name: "Dosa & Coffee Combo",
    price: 299.0,
    size: "1 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?coffee,dosa,indian&sig=6",
    description:
      "Any one Masala Dosa or Plain Dosa with a complimentary Filter Coffee or Masala Tea.",
    customization: true,
  },
  {
    id: 9007,
    name: "Appam & Stew Combo",
    price: 420.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?appam,stew,kerala&sig=7",
    description:
      "Four pieces of Appam served with choice of Vegetable Stew or Chicken Stew.",
    customization: true,
  },
  {
    id: 9008,
    name: "Weekend Idiyappam Treat",
    price: 390.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?idiyappam,curry,meal&sig=8",
    description:
      "Eight pieces of soft Idiyappam served with sweet coconut milk and a savory Kurma.",
    customization: false,
  },

  // Curry & Meal Deals (4)
  {
    id: 9009,
    name: "Chettinad Curry Feast",
    price: 750.0,
    size: "2 Pax",
    imageUrl:
      "https://source.unsplash.com/80x80/?chettinad,chicken,curry&sig=9",
    description:
      "One Chicken Chettinad Curry (large) with 4 Parottas or 6 Chapatis. High spice level.",
    customization: true,
  },
  {
    id: 9010,
    name: "Panner Butter Masala Kit",
    price: 599.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?paneer,butter,indian&sig=10",
    description:
      "Rich Panner Butter Masala (large) served with family-size Jeera Rice and 2 Garlic Naans.",
    customization: false,
  },
  {
    id: 9011,
    name: "Village Thali Executive",
    price: 320.0,
    size: "1 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?thali,meal,veg&sig=11",
    description:
      "A complete South Indian vegetarian Thali with rice, sambar, rasam, kootu, poriyal, curd, and a sweet.",
    customization: false,
  },
  {
    id: 9012,
    name: "Kongunad Meal Pack",
    price: 680.0,
    size: "2 Pax",
    imageUrl:
      "https://source.unsplash.com/80x80/?chicken,kongunadu,mess&sig=12",
    description:
      "Includes Pallipalayam Chicken Fry and a Kongunad style Mutton gravy. Served with 6 Parottas.",
    customization: false,
  },

  // Grill & Snacks Deals (4)
  {
    id: 9013,
    name: "Tandoori Grill Special",
    price: 799.0,
    size: "3 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?tandoori,grill,kabab&sig=13",
    description:
      "Assortment of Chicken Tikka, Tandoori Prawns, and Paneer Tikka. Served with mint chutney and onion salad.",
    customization: false,
  },
  {
    id: 9014,
    name: "BBQ Veg Platter",
    price: 550.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?bbq,veg,skewers&sig=14",
    description:
      "Grilled Paneer, Mushroom, and Bell Peppers marinated in spicy yogurt. Served with a tangy dipping sauce.",
    customization: false,
  },
  {
    id: 9015,
    name: "Evening Snack Deal",
    price: 199.0,
    size: "1 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?pakoda,tea,snack&sig=15",
    description:
      "Large portion of crispy Onion Pakoda with a cup of hot Masala Chai. Perfect for evening hunger.",
    customization: false,
  },
  {
    id: 9016,
    name: "Seafood Starter Pack",
    price: 799.0,
    size: "2 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?seafood,prawn,fry&sig=16",
    description:
      "Includes Nethili Fish Fry and Prawn Pepper Masala (small servings). A spicy start to your meal.",
    customization: false,
  },

  // Dessert & Beverage Combos (4) - Ensuring minimum 20 offers
  {
    id: 9017,
    name: "Sweet Tooth Trio",
    price: 250.0,
    size: "1 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?dessert,mysore,pak&sig=17",
    description:
      "Three popular Indian sweets: one piece each of Gulab Jamun, Rasamalai, and Mysore Pak.",
    customization: false,
  },
  {
    id: 9018,
    name: "Filter Coffee Bulk Pack",
    price: 180.0,
    size: "4 Servings",
    imageUrl: "https://source.unsplash.com/80x80/?coffee,filter,hot&sig=18",
    description:
      "Four large cups of authentic Madras Filter Coffee, packed in a heat-retaining container.",
    customization: false,
  },
  {
    id: 9019,
    name: "Summer Cooler Combo",
    price: 299.0,
    size: "3 Drinks",
    imageUrl: "https://source.unsplash.com/80x80/?lime,soda,drink&sig=19",
    description:
      "Three refreshing Fresh Lime Sodas (sweet/salt customizable). Perfect for cooling down.",
    customization: true,
  },
  {
    id: 9020,
    name: "Palkova Delight",
    price: 150.0,
    size: "100g",
    imageUrl: "https://source.unsplash.com/80x80/?palkova,milk,sweet&sig=20",
    description:
      "100g of rich, traditional Palkova (sweetened milk fudge). Freshly made daily.",
    customization: false,
  },
  // Two extra to ensure minimum 20 is met even if one is filtered out
  {
    id: 9021,
    name: "Jumbo Party Pack (Save 30%)",
    price: 1999.0,
    size: "8 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?party,food,feast&sig=21",
    description:
      "Includes 4 Biryanis, 2 Curries, 8 Breads, and a large dessert tray. Our best value!",
    customization: true,
  },
  {
    id: 9022,
    name: "Midnight Munchies Deal",
    price: 399.0,
    size: "1 Pax",
    imageUrl: "https://source.unsplash.com/80x80/?sandwich,fries,late&sig=22",
    description:
      "Club Sandwich and large French Fries with a free soft drink. Available after 10 PM.",
    customization: false,
  },
];

// --- 2. COMPONENTS ---

// Component for the New Image Logo (Requirement 2)
const ImageLogo = () => (
  <img
    src={"uploaded:download (1).jpeg-59c69311-0b99-42f7-ae42-3ab712c14134"}
    alt="SwiftFeast Food Delivery Logo"
    className="header-image-logo"
    onError={(e) =>
      (e.target.src = "https://placehold.co/100x40/FF7F7F/FFFFFF?text=Logo")
    }
  />
);

// Component for the Stylish Logo Text (Kept for Footer)
const StylishLogo = ({ className }) => (
  <div className={`stylish-logo ${className}`}>SwiftFeast</div>
);

// Component: GeneralFoodBar (Global Cuisines bar, used by both themes for "Global Picks")
const GeneralFoodBar = ({
  categories,
  activeFeaturedView,
  onSelectGeneralCategory,
}) => {
  const scrollRef = useRef(null);
  const scrollAmount = 200; // Pixels to scroll

  const scroll = (direction) => {
    if (scrollRef.current) {
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll =
        currentScroll + (direction === "left" ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="general-food-bar-wrapper">
      <div className="general-food-bar-title-section">
        <h4 className="general-food-bar-title-text">Explore Global Cuisines</h4>
        <div className="scroll-controls">
          <button onClick={() => scroll("left")} className="scroll-btn">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} className="scroll-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="general-food-bar-container">
        <div className="general-food-bar" ref={scrollRef}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`general-food-item ${
                activeFeaturedView?.key === `Global:${category.name}`
                  ? "active"
                  : ""
              }`}
              onClick={() => onSelectGeneralCategory(category)}
            >
              <div className="general-food-icon-wrapper">
                {typeof category.icon === "string" ? (
                  <span className="text-3xl">{category.icon}</span>
                ) : (
                  <category.icon size={30} className="text-red-600" />
                )}
              </div>
              <span className="general-food-name">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component: CategoryDetailsDisplay (Featured Dishes Display)
const CategoryDetailsDisplay = ({
  category,
  dishes,
  onAddToCart,
  onCardClick,
  onClear,
}) => {
  if (!category) return null;

  return (
    <div className="category-details-display">
      <h3 className="details-title">
        <BookOpen size={24} className="mr-2 text-blue-600" /> Featured:{" "}
        {category.name} Dishes
      </h3>

      {dishes && dishes.length > 0 && (
        <div className="featured-dishes-wrapper">
          <h4 className="featured-dishes-title">
            <Utensils size={20} className="mr-2" />
            {category.name} Picks ({dishes.length} Dishes)
          </h4>
          <div className="featured-dishes-grid">
            {dishes.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-5">
        <button className="clear-category-button" onClick={onClear}>
          <X size={16} className="mr-2" /> VIEW ALL CUISINES
        </button>
      </div>
    </div>
  );
};

// --- 3. CORE COMPONENTS (Header, Card, etc.) ---

// Component: HeroBanner (Only for Home page)
const HeroBanner = () => (
  <div className="hero-banner">
    <img
      src="https://media.istockphoto.com/id/1457979959/photo/snack-junk-fast-food-on-table-in-restaurant-soup-sauce-ornament-grill-hamburger-french-fries.jpg?s=612x612&w=0&k=20&c=QbFk2SfDb-7oK5Wo9dKmzFGNoi-h8HVEdOYWZbIjffo="
      alt="Delicious Food Spread"
      className="hero-image"
    />
    <div className="main-intro">
      <h1 className="main-title">Order Authentic Tamil Nadu Food Online</h1>
      <p className="main-subtitle">
        Explore the best Chettinad, Kongunad, and Madras kitchens near you.
      </p>
    </div>
  </div>
);

// Component: Header (Modified for Logo and Sign Up button placement)
const Header = ({ onToggleCart, currentPage, onNavigate }) => {
  const NavLink = ({ Icon, text, pageName, isButton = false }) => {
    const displayIcon =
      React.isValidElement(Icon) ||
      Icon === Home ||
      Icon === ShoppingCart ||
      Icon === User;

    return (
      <a
        href="#"
        className={`header-link nav-item ${
          currentPage === pageName ? "active" : ""
        } ${isButton ? "sign-up-button-link" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(pageName);
        }}
      >
        {displayIcon &&
          (React.isValidElement(Icon) ? Icon : <Icon size={18} />)}
        <span
          className={`${
            displayIcon ? "ml-1 hidden sm:inline-block" : "inline-block"
          }`}
        >
          {text}
        </span>
      </a>
    );
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* MODIFICATION 1: Combine ImageLogo and StylishLogo for Name */}
        <div className="logo-name-group">
          <ImageLogo />
          <StylishLogo className="header-logo-text" />
        </div>
      </div>

      <div className="header-right">
        <div className="main-nav-links">
          <NavLink Icon={Home} text="Home" pageName="Home" />
          <NavLink text="Menu" pageName="Menu" />
          <NavLink text="Service" pageName="Service" />
          <NavLink text="Contact" pageName="Contact" />
          <NavLink Icon={ShoppingCart} text="Offers" pageName="Offers" />
        </div>

        {/* MODIFICATION 2: Cart button moved before Sign Up */}
        <button className="cart-toggle-button" onClick={onToggleCart}>
          <ShoppingCart size={20} />
        </button>

        {/* Sign Up moved here */}
        <NavLink Icon={User} text="Sign Up" pageName="SignUp" isButton={true} />

        <button className="header-button login-btn">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

// Component: CuisineBar (First horizontal filter bar - takes dynamic data)
const CuisineBar = ({
  cuisineCategories,
  activeFeaturedView,
  onSelectCategory,
  featuredKeyPrefix, // Added to distinguish between local/global cuisine bar activation
}) => {
  const scrollRef = useRef(null);
  const scrollAmount = 150; // Pixels to scroll

  const scroll = (direction) => {
    if (scrollRef.current) {
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll =
        currentScroll + (direction === "left" ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="cuisine-bar-wrapper">
      {/* Title for the Cuisine Categories */}
      <div className="cuisine-bar-title-section">
        <h4 className="cuisine-bar-title-text">Cuisines & Styles</h4>
        <div className="scroll-controls">
          <button onClick={() => scroll("left")} className="scroll-btn">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} className="scroll-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="cuisine-bar-container">
        <div className="cuisine-bar" ref={scrollRef}>
          {cuisineCategories.map((category, index) => (
            <div
              key={index}
              className={`cuisine-item ${
                activeFeaturedView?.key ===
                `${featuredKeyPrefix}:${category.filterKey}`
                  ? "active"
                  : ""
              }`}
              // Pass the filterKey to the handler
              onClick={() => onSelectCategory(category.filterKey)}
            >
              <div className="cuisine-icon-wrapper">
                {typeof category.icon === "string" ? (
                  <span className="text-3xl">{category.icon}</span>
                ) : (
                  <category.icon size={30} className="text-red-600" />
                )}
              </div>
              {/* Display the more descriptive name */}
              <span className="cuisine-name">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component: RestaurantFilterBar (Second horizontal filter bar - takes dynamic data)
const RestaurantFilterBar = ({
  restaurantOptions,
  activeRestaurant,
  onSelectRestaurant,
}) => {
  const scrollRef = useRef(null);
  const scrollAmount = 200; // Pixels to scroll

  const scroll = (direction) => {
    if (scrollRef.current) {
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll =
        currentScroll + (direction === "left" ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="restaurant-bar-wrapper">
      {/* Title for the Restaurants Filter */}
      <div className="restaurant-bar-title-section">
        <h4 className="restaurant-bar-title">Restaurants Near You</h4>
        <div className="scroll-controls">
          <button onClick={() => scroll("left")} className="scroll-btn">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} className="scroll-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="restaurant-bar-container">
        <div className="restaurant-bar" ref={scrollRef}>
          {restaurantOptions.map((name, index) => (
            <div
              key={index}
              className={`restaurant-item ${
                name === activeRestaurant ? "active" : ""
              }`}
              onClick={() => onSelectRestaurant(name)}
            >
              <span className="restaurant-name">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component: DishTypeFilter
const DishTypeFilter = ({ activeDishType, onSelectDishType }) => {
  const dishTypes = [
    { name: "All Dishes", type: "All", icon: Utensils, color: "#1a1a1a" },
    { name: "Vegetarian", type: "Veg", icon: "🟢", color: "#008000" },
    { name: "Non-Vegetarian", type: "Non-Veg", icon: "🔴", color: "#DC3545" },
  ];

  return (
    <div className="dish-type-filter-bar-container">
      {dishTypes.map((item) => (
        <button
          key={item.type}
          className={`dish-type-btn ${
            activeDishType === item.type ? "active" : ""
          }`}
          onClick={() => onSelectDishType(item.type)}
          style={{ "--active-color": item.color }}
        >
          {typeof item.icon === "string" ? (
            <span className="mr-1">{item.icon}</span>
          ) : (
            <item.icon size={16} className="mr-1" />
          )}
          {item.name}
        </button>
      ))}
    </div>
  );
};

// Component: FoodCard
const FoodCard = ({ item, onAddToCart, onCardClick }) => {
  const { name, price, imageUrl, offer, category, isVeg, restaurant } = item;

  return (
    <div
      className={`food-card ${isVeg ? "veg" : "non-veg"}`}
      // Click on the card opens the modal
      onClick={() => onCardClick(item)}
    >
      {offer && <span className="offer-badge">{offer}</span>}
      <img
        src={imageUrl}
        alt={name}
        // Fallback to a placehold.co link in case Unsplash fails
        onError={(e) =>
          (e.target.src =
            "https://placehold.co/250x180/EAEAEA/333333?text=Image+Not+Found")
        }
      />
      <div className="card-info">
        <span className={`card-category ${isVeg ? "veg-tag" : "non-veg-tag"}`}>
          {isVeg ? "VEG" : "NON-VEG"} | {category}
        </span>
        <h4 title={name}>{name}</h4>
        <p className="price">₹ {price.toFixed(2)}</p>
        <p className="restaurant-name-tag">{restaurant}</p>
        {/* Display the image URL beneath the restaurant name for inspection */}
        <p className="image-url-tag">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "10px",
              color: "#17a2b8",
              display: "block",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {imageUrl}
          </a>
        </p>
      </div>
      <button
        className="add-button"
        // CRITICAL: Stop propagation to prevent modal from opening when adding
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(item);
        }}
      >
        ADD
      </button>
    </div>
  );
};

// Component: OfferCard
const OfferCard = ({ item, onAddToCart, onCardClick }) => {
  const { name, price, imageUrl, customization, size } = item;

  // Create a minimal item object for the modal
  const dishItem = {
    ...item,
    // Add missing properties required by DishModal for offers
    category: "Offer",
    isVeg:
      !name.toLowerCase().includes("chicken") &&
      !name.toLowerCase().includes("mutton") &&
      !name.toLowerCase().includes("fish") &&
      !name.toLowerCase().includes("sea"),
    restaurant: "SwiftFeast Deals",
  };

  return (
    <div
      className="offer-card"
      onClick={() => onCardClick(dishItem)} // Open modal on card click
    >
      <div className="offer-details">
        <h5>{name}</h5>
        <p className="price">₹ {price.toFixed(2)}</p>
        {customization && (
          <p className="customization-info">Customisation Available</p>
        )}
      </div>
      <img
        src={imageUrl}
        alt={name}
        onError={(e) =>
          (e.target.src =
            "https://placehold.co/100x100/EAEAEA/333333?text=Offer+Image")
        }
      />
      <button
        className="add-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent modal from opening when clicking ADD
          onAddToCart(item);
        }}
      >
        ADD
      </button>
      {size && <span className="offer-size">{size}</span>}
    </div>
  );
};

// --- 4. DEDICATED PAGE COMPONENTS ---

// Component: OffersPage
const OffersPage = ({ offers, onAddToCart, onCardClick }) => (
  <div className="main-layout offers-page-layout">
    <h2 className="page-heading">🔥 Today's Exclusive Offers & Combo Deals</h2>
    <p className="page-subheading">
      Save big with our value packs, perfect for family dinners or parties.
      Click an offer for details.
    </p>
    <div className="offers-grid">
      {offers.map((item) => (
        <OfferCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  </div>
);

// Component: ServiceDetailsPage
const ServiceDetailsPage = () => (
  <div className="main-layout service-page-layout">
    <h2 className="page-heading">🚀 SwiftFeast Delivery & Catering Services</h2>
    <p className="page-subheading mb-8">
      Explore our commitment to **fast, reliable delivery** and tailored **bulk
      order catering** solutions across Tamil Nadu.
    </p>

    <div className="service-grid">
      {" "}
      {/* Reusing service-grid for contact layout */}
      <div className="service-card">
        <h3 className="service-card-title">Instant Delivery Zones ⚡</h3>
        <p className="service-card-description">
          Our standard, rapid delivery service covers all major metropolitan and
          surrounding areas in Tamil Nadu. We ensure your food arrives fresh,
          hot, and within the estimated time of arrival (ETA).
        </p>
        <ul className="service-list">
          <li>
            **Primary Zones:** Chennai, Coimbatore, Madurai, Trichy, Salem,
            Erode.
          </li>
          <li>**Feature:** Real-time GPS order tracking available.</li>
          <li>
            **Speed:** Average delivery time under 30 minutes in metro areas.
          </li>
        </ul>
      </div>
      <div className="service-card">
        <h3 className="service-card-title">Bulk & Catering Orders 🍽️</h3>
        <p className="service-card-description">
          Planning a party, corporate event, or large gathering? We offer
          specialized bulk order catering services tailored to your needs,
          including customizable menus from our premium local kitchens.
        </p>
        <ul className="service-list">
          <li>
            **Service:** Dedicated order manager for hassle-free event planning.
          </li>
          <li>**Menu:** Customizable menus from local and global partners.</li>
          <li>
            **Guarantee:** Delivery temperature guarantee for all large orders.
          </li>
        </ul>
      </div>
      <div className="service-card">
        <h3 className="service-card-title">Reliability & Support 📞</h3>
        <p className="service-card-description">
          We pride ourselves on the professionalism of our riders and the
          quality of our service. Our support team is always ready to assist
          with any queries or issues.
        </p>
        <ul className="service-list">
          <li>
            **Support:** 24/7 Customer support via in-app chat and dedicated
            phone lines.
          </li>
          <li>**Commitment:** Rain or shine delivery guarantee.</li>
          <li>
            **Fleet:** Dedicated fleet of vetted and trained delivery partners.
          </li>
        </ul>
      </div>
    </div>
  </div>
);

// Component: ContactDetailsPage
const ContactDetailsPage = () => (
  <div className="main-layout service-page-layout">
    <h2 className="page-heading">📞 Contact & Support Center</h2>
    <p className="page-subheading mb-8">
      Reach out to our support team for any queries, feedback, or assistance.
      We're here 24/7 to help you.
    </p>

    <div className="service-grid">
      {" "}
      {/* Reusing service-grid for contact layout */}
      <div className="service-card">
        <h3 className="service-card-title">Customer Care (24/7) 🧑‍💻</h3>
        <p className="service-card-description">
          For all issues related to **orders, delivery, or menu questions**,
          contact our primary customer support channel.
        </p>
        <ul className="service-list">
          <li>**Primary Contact:** **+91 98765 43210**</li>
          <li>**Email Support:** **support@swiftfeast.in**</li>
          <li>**In-App Chat:** Available directly on the checkout screen.</li>
        </ul>
      </div>
      <div className="service-card">
        <h3 className="service-card-title">Bulk Orders & Catering 🍽️</h3>
        <p className="service-card-description">
          If you require large volume orders or dedicated catering services for
          events, please contact our specialized business unit.
        </p>
        <ul className="service-list">
          <li>**Business Line:** **+91 98765 11122**</li>
          <li>**Catering Email:** **catering@swiftfeast.in**</li>
          <li>**Office Hours:** Mon - Fri, 9:00 AM - 6:00 PM IST</li>
        </ul>
      </div>
      <div className="service-card">
        <h3 className="service-card-title">Media & Partnerships 🤝</h3>
        <p className="service-card-description">
          For press inquiries, media relations, investment interest, or
          potential restaurant partnership opportunities.
        </p>
        <ul className="service-list">
          <li>**Media Contact:** **media@swiftfeast.in**</li>
          <li>**Partner Inquiries:** **partners@swiftfeast.in**</li>
          <li>**Head Office:** Chennai, Tamil Nadu, India</li>
        </ul>
      </div>
    </div>
  </div>
);

// Component: AuthPage (NEW AUTHENTICATION COMPONENT)
const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(false); // Default to Sign Up
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would dispatch authentication actions (e.g., Firebase signUp/signIn)
    console.log(showLogin ? "Logging In..." : "Signing Up...", form);

    const action = showLogin ? "Sign In" : "Sign Up";
    // Using a custom message box instead of alert()
    const messageBox = document.createElement("div");
    messageBox.className = "alert-message-box";
    messageBox.innerText = `${action} Attempted!\nEmail: ${
      form.email
    }\nPhone: ${form.phone || "N/A"}`;
    document.body.appendChild(messageBox);
    setTimeout(() => messageBox.remove(), 3000);

    // Clear sensitive fields after attempt
    setForm({ ...form, password: "", confirmPassword: "" });
  };

  const toggleAuthMode = () => {
    setShowLogin((prev) => !prev);
    setForm({
      username: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleGoogleAuth = () => {
    // Using a custom message box instead of alert()
    const messageBox = document.createElement("div");
    messageBox.className = "alert-message-box";
    messageBox.innerText = `Redirecting to Google for ${
      showLogin ? "Sign In" : "Sign Up"
    }...`;
    document.body.appendChild(messageBox);
    setTimeout(() => messageBox.remove(), 3000);
  };

  const SignUpForm = (
    <form onSubmit={handleAuthSubmit} className="auth-form">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleInputChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleInputChange}
        required
      />
      <button type="submit" className="auth-main-btn">
        SIGN UP
      </button>
      <div className="auth-separator">OR</div>
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="auth-google-btn"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo-google-icon.png"
          alt="Google"
          style={{ width: "20px", marginRight: "10px" }}
        />
        SIGN UP USING GOOGLE
      </button>
    </form>
  );

  const LoginForm = (
    <form onSubmit={handleAuthSubmit} className="auth-form">
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleInputChange}
        required
      />
      <button type="submit" className="auth-main-btn">
        SIGN IN
      </button>
      <div className="auth-separator">OR</div>
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="auth-google-btn"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo-google-icon.png"
          alt="Google"
          style={{ width: "20px", marginRight: "10px" }}
        />
        CONTINUE WITH GOOGLE
      </button>
    </form>
  );

  return (
    <div className="main-layout auth-page-layout">
      <div className="auth-card">
        <h2 className="auth-title">
          {showLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>
        <div className="auth-toggle">
          <button
            className={!showLogin ? "active" : ""}
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
          <button
            className={showLogin ? "active" : ""}
            onClick={() => setShowLogin(true)}
          >
            Log In
          </button>
        </div>

        {showLogin ? LoginForm : SignUpForm}

        <p className="auth-footer-text">
          {showLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={toggleAuthMode} className="auth-toggle-link">
            {showLogin ? " Sign Up Here" : " Log In Here"}
          </span>
        </p>
      </div>
    </div>
  );
};

// Component: LocalFoodMainContent (The default content for "Home" page)
const LocalFoodMainContent = ({
  foodItems,
  onAddToCart,
  onCardClick,
  activeRestaurant,
  onSelectRestaurant,
  activeDishType,
  onSelectDishType,
  activeFeaturedView,
  onSelectCategory,
  onSelectGeneralCategory,
  onClearFeaturedView,
  generalCategoryDishes,
}) => {
  const isFeaturedByGlobal = activeFeaturedView?.key.startsWith("Global:");
  const isFeaturedByLocalCuisine =
    activeFeaturedView?.key.startsWith("Cuisine:");

  // If ANY featured view is active, the food grid only contains 8 dishes from generalCategoryDishes
  const isAnyFeaturedViewActive = !!activeFeaturedView;
  const itemsToDisplay = isAnyFeaturedViewActive
    ? generalCategoryDishes
    : foodItems;

  const sectionTitle = isAnyFeaturedViewActive
    ? `Popular Picks near SwiftFeast Kitchen (${itemsToDisplay.length} items)`
    : `Popular Picks (${itemsToDisplay.length} items)`;

  return (
    <main className="main-content">
      {/* 1. Global Food Category Bar (Always visible) */}
      <GeneralFoodBar
        categories={generalFoodCategoriesData}
        activeFeaturedView={activeFeaturedView}
        onSelectGeneralCategory={onSelectGeneralCategory}
      />

      {/* 2. Featured Dishes - Placement for GLOBAL Cuisines (Requirement 3) */}
      {isFeaturedByGlobal && (
        <CategoryDetailsDisplay
          category={{ name: activeFeaturedView.name }}
          dishes={itemsToDisplay}
          onAddToCart={onAddToCart}
          onCardClick={onCardClick}
          onClear={onClearFeaturedView}
        />
      )}

      {/* 3. Main Cuisine Filter Bar (Local Cuisine) */}
      <CuisineBar
        cuisineCategories={localCuisineCategories}
        activeFeaturedView={activeFeaturedView}
        onSelectCategory={onSelectCategory}
        featuredKeyPrefix="Cuisine"
      />

      {/* 4. Featured Dishes - Placement for LOCAL Cuisines (If triggered by CuisineBar) */}
      {isFeaturedByLocalCuisine && (
        <CategoryDetailsDisplay
          category={{ name: activeFeaturedView.name }}
          dishes={itemsToDisplay}
          onAddToCart={onAddToCart}
          onCardClick={onCardClick}
          onClear={onClearFeaturedView}
        />
      )}

      {/* 5. Standard Filters/Grid (Only visible if NO featured view is active) */}
      {!isAnyFeaturedViewActive && (
        <>
          {/* Filters are only visible when the featured view is NOT active */}
          <RestaurantFilterBar
            restaurantOptions={localRestaurantOptions}
            activeRestaurant={activeRestaurant}
            onSelectRestaurant={onSelectRestaurant}
          />
          <DishTypeFilter
            activeDishType={activeDishType}
            onSelectDishType={onSelectDishType}
          />
          {/* The main food grid section */}
          <h3 className="section-heading popular-picks">{sectionTitle}</h3>
          <div className="food-grid">
            {itemsToDisplay.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

// Component: GlobalFoodMainContent (Dedicated page for global brands)
const GlobalFoodMainContent = ({
  foodItems,
  onAddToCart,
  onCardClick,
  activeRestaurant,
  onSelectRestaurant,
  activeDishType,
  onSelectDishType,
  activeFeaturedView,
  onSelectCategory, // This is handleGlobalCuisineFeatured
  onClearFeaturedView,
  generalCategoryDishes,
  // FIX: openDishModal was missing from destructuring, causing ReferenceError
  openDishModal,
}) => {
  const isFeaturedActive = activeFeaturedView?.key.startsWith("GlobalCuisine:");

  const itemsToDisplay = isFeaturedActive ? generalCategoryDishes : foodItems;

  const sectionTitle = `Featured Global Meals (${itemsToDisplay.length} items)`;

  return (
    <main className="main-content pt-10">
      <h2 className="page-heading">Global Fast Food Menu</h2>
      <p className="page-subheading">
        Order instantly from top global chains like McDonald's, Pizza Hut, and
        Starbucks.
      </p>

      {/* 1. Main Cuisine Filter Bar (Global Cuisine) */}
      <CuisineBar
        cuisineCategories={globalCuisineCategories}
        activeFeaturedView={activeFeaturedView}
        onSelectCategory={onSelectCategory}
        featuredKeyPrefix="GlobalCuisine" // New prefix for global menu featured view
      />

      {/* 2. Featured Dishes (Requirement 4 - Same logic for Menu page's cuisine bar) */}
      {isFeaturedActive && (
        <CategoryDetailsDisplay
          category={{ name: activeFeaturedView.name }}
          dishes={itemsToDisplay}
          onAddToCart={onAddToCart}
          onCardClick={openDishModal}
          onClear={onClearFeaturedView}
        />
      )}

      {/* 3. Standard Filters/Grid (Only visible if NO featured view is active) */}
      {!isFeaturedActive && (
        <>
          <RestaurantFilterBar
            restaurantOptions={globalRestaurantOptions}
            activeRestaurant={activeRestaurant}
            onSelectRestaurant={onSelectRestaurant}
          />

          <DishTypeFilter
            activeDishType={activeDishType}
            onSelectDishType={onSelectDishType}
          />

          {/* The main food grid section */}
          <h3 className="section-heading popular-picks">{sectionTitle}</h3>
          <div className="food-grid">
            {itemsToDisplay.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                // FIX: Prop is now correctly passed to FoodCard
                onCardClick={openDishModal}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

// Component: CartView
const CartView = ({
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
  checkoutMessage,
  isCartOpen,
  onToggleCart, // Added for the close button
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <aside className={`shopping-cart ${isCartOpen ? "open" : "closed"}`}>
      <div className="cart-header">
        <h3>My Cart ({cartItems.length})</h3>
        <button onClick={onToggleCart} className="cart-close-btn">
          <X size={20} />
        </button>
      </div>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">
            Add items from the menu to your order!
          </p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <span className="cart-item-name">{item.name}</span>
              <div className="item-controls">
                <span className="cart-price">
                  ₹ {(item.price * item.quantity).toFixed(2)}
                </span>
                <div className="quantity-stepper">
                  <button onClick={() => onRemoveFromCart(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onAddToCart(item)}>+</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary-container">
        {checkoutMessage && (
          <div className="checkout-message">{checkoutMessage}</div>
        )}
        <div className="cart-summary">
          <p>Subtotal:</p>
          <p className="total-price">₹ {subtotal.toFixed(2)}</p>
        </div>
        <button
          className="checkout-button"
          onClick={onCheckout}
          disabled={cartItems.length === 0}
        >
          PROCEED TO PAY
        </button>
      </div>
    </aside>
  );
};

// Component: DishModal for showing details - Used for both Dishes and Offers
const DishModal = ({ dish, onClose, onAddToCart }) => {
  if (!dish) return null;

  // Determine if it's a standard food item or an offer based on the presence of a 'description' property
  const isOffer =
    !dish.description ||
    dish.name.toLowerCase().includes("combo") ||
    dish.name.toLowerCase().includes("pack") ||
    dish.name.toLowerCase().includes("deal");

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(dish);
    onClose(); // Close modal after adding
  };

  return (
    <div
      className={`dish-modal-overlay ${dish ? "open" : ""}`}
      onClick={onClose}
    >
      <div className="dish-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="modal-dish-image"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/400x300/EAEAEA/333333?text=Details+Image")
          }
        />
        <div className="modal-details">
          <div className="flex justify-between items-start mb-3">
            <h3 className="modal-dish-name">{dish.name}</h3>
            {/* Show Offer or Veg/Non-Veg tag */}
            <span
              className={`modal-veg-tag ${
                isOffer ? "offer-tag" : dish.isVeg ? "veg-tag" : "non-veg-tag"
              }`}
            >
              {isOffer ? "OFFER" : dish.isVeg ? "VEG" : "NON-VEG"}
            </span>
          </div>
          <p className="modal-dish-price">₹ {dish.price.toFixed(2)}</p>

          {/* Display Offer/Dish Description */}
          <p className="modal-dish-description">
            {dish.description || "Detailed description unavailable."}
          </p>

          {/* Additional info for offers/dishes */}
          <p className="modal-restaurant-tag">
            {isOffer && dish.size ? `Servings: ${dish.size} | ` : ""}
            From: {dish.restaurant || "SwiftFeast Kitchen"}
          </p>

          <button className="modal-add-btn" onClick={handleAdd}>
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

// Component: AppFooter
const AppFooter = () => {
  const FooterColumn = ({ title, links }) => (
    <div className="footer-column">
      <h4>{title}</h4>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href="#">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="app-footer">
      <div className="footer-content-wrapper">
        <div className="footer-logo-section">
          <StylishLogo className="footer-logo-text" />
          <p className="copyright-text">© 2025 SwiftFeast Limited</p>
        </div>

        <FooterColumn
          title="Company"
          links={[
            "About Us",
            "SwiftFeast Corporate",
            "Careers",
            "Team",
            "Blog",
            "Press & Media",
          ]}
        />

        <FooterColumn
          title="Contact Us"
          links={[
            "Help & Support",
            "Partner with Us",
            "Ride with Us",
            "Investor Relations",
          ]}
        />

        <FooterColumn
          title="Available in"
          links={[
            "Chennai",
            "Coimbatore",
            "Madurai",
            "Tiruchirappalli",
            "Salem",
            "Erode",
            "20+ Cities in TN",
          ]}
        />

        <div className="footer-column">
          <h4>Legal & Social</h4>
          <ul className="footer-social-links">
            <li>
              <a href="#">
                <Linkedin size={20} />
              </a>
            </li>
            <li>
              <a href="#">
                <Facebook size={20} />
              </a>
            </li>
            <li>
              <a href="#">
                <Twitter size={20} />
              </a>
            </li>
            <li>
              <a href="#">
                <Instagram size={20} />
              </a>
            </li>
          </ul>
          <ul className="footer-legal-links">
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
            <li>
              <a href="#">Responsible Disclosure</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

// --- 5. MAIN APP COMPONENT ---

const App = () => {
  // Cart States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  // Navigation State
  const [currentPage, setCurrentPage] = useState("Home");

  // Filter States for Local Menu (Home)
  const [activeLocalCategory, setActiveLocalCategory] = useState("All");
  const [activeLocalRestaurant, setActiveLocalRestaurant] = useState("All");
  const [activeLocalDishType, setActiveLocalDishType] = useState("All");
  const [filteredLocalItems, setFilteredLocalItems] = useState(localFoodItems); // Default to local

  // Filter States for Global Menu (Menu)
  const [activeGlobalCategory, setActiveGlobalCategory] = useState("All");
  const [activeGlobalRestaurant, setActiveGlobalRestaurant] = useState("All");
  const [activeGlobalDishType, setActiveGlobalDishType] = useState("All");
  const [filteredGlobalItems, setFilteredGlobalItems] =
    useState(globalFoodItems); // Default to global

  // Featured View State (Shared by both Home and Menu pages)
  const [activeFeaturedView, setActiveFeaturedView] = useState(null);
  const [generalCategoryDishes, setGeneralCategoryDishes] = useState([]);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // Dish Modal Handlers
  const openDishModal = (dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const closeDishModal = () => {
    setSelectedDish(null);
    setIsModalOpen(false);
  };

  // Scroll to top when navigating to main pages
  useEffect(() => {
    if (
      currentPage === "Home" ||
      currentPage === "Menu" ||
      currentPage === "Offers" ||
      currentPage === "Service" ||
      currentPage === "Contact" ||
      currentPage === "SignUp"
    ) {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  // --- SHARED FEATURED VIEW LOGIC ---

  const clearFeaturedView = () => {
    // Timeout ensures React re-renders with filters before scrolling
    setTimeout(() => {
      setActiveFeaturedView(null);
      setGeneralCategoryDishes([]);
      window.scrollTo(0, savedScrollPosition);
    }, 0);
  };

  // --- HOME MENU (LOCAL) FILTERING & FEATURED VIEW CONTROL ---

  // Local Filter Logic
  useEffect(() => {
    // Skip standard filtering if any featured view is active
    if (activeFeaturedView) {
      return;
    }

    let currentItems = localFoodItems;

    if (activeLocalCategory !== "All") {
      currentItems = currentItems.filter(
        (item) => item.category === activeLocalCategory
      );
    }
    if (activeLocalRestaurant !== "All") {
      currentItems = currentItems.filter(
        (item) => item.restaurant === activeLocalRestaurant
      );
    }
    if (activeLocalDishType === "Veg") {
      currentItems = currentItems.filter((item) => item.isVeg);
    } else if (activeLocalDishType === "Non-Veg") {
      currentItems = currentItems.filter((item) => !item.isVeg);
    }

    setFilteredLocalItems(currentItems.sort((a, b) => a.id - b.id));
  }, [
    activeLocalCategory,
    activeLocalRestaurant,
    activeLocalDishType,
    activeFeaturedView,
  ]);

  // Local Category Filter handler (triggers featured view or standard filter)
  const handleLocalCategoryFilter = (filterKey) => {
    const viewKey = `Cuisine:${filterKey}`;
    const categoryData = localCuisineCategories.find(
      (c) => c.filterKey === filterKey
    );

    if (filterKey === "All") {
      clearFeaturedView();
      setActiveLocalCategory("All");
      return;
    }
    if (activeFeaturedView && activeFeaturedView.key === viewKey) {
      clearFeaturedView();
      return;
    }

    setSavedScrollPosition(window.scrollY);

    const preFilteredItems = localFoodItems.filter(
      (item) => item.category === filterKey
    );
    setGeneralCategoryDishes(
      preFilteredItems.slice(0, 8).sort((a, b) => a.id - b.id)
    );

    setActiveFeaturedView({ key: viewKey, name: categoryData.name });
    setActiveLocalCategory("All");
    setActiveLocalRestaurant("All");
    setActiveLocalDishType("All");
  };

  // Local General Category Select (triggers mock data featured view - Requirement 3)
  const handleLocalGeneralCategorySelect = (category) => {
    const viewKey = `Global:${category.name}`;

    if (activeFeaturedView && activeFeaturedView.key === viewKey) {
      clearFeaturedView();
      return;
    }

    setSavedScrollPosition(window.scrollY);

    const newDishes = generateGeneralCategoryDishes(category.name);
    setGeneralCategoryDishes(newDishes);
    setActiveFeaturedView({ key: viewKey, name: category.name });

    setActiveLocalCategory("All");
    setActiveLocalRestaurant("All");
    setActiveLocalDishType("All");
  };

  const handleLocalRestaurantFilter = (restaurant) => {
    setActiveLocalRestaurant(restaurant);
    setActiveLocalCategory("All");
    setActiveLocalDishType("All");
    clearFeaturedView(); // Always clear featured view on standard filter change
  };

  const handleLocalDishTypeFilter = (type) => {
    setActiveLocalDishType(type);
    clearFeaturedView(); // Always clear featured view on standard filter change
  };

  // --- GLOBAL MENU (MENU) FILTERING & FEATURED VIEW CONTROL (Requirement 4) ---

  // Global Filter Logic
  useEffect(() => {
    // Skip standard filtering if featured view is active
    if (activeFeaturedView) {
      return;
    }

    let currentItems = globalFoodItems;

    if (activeGlobalCategory !== "All") {
      currentItems = currentItems.filter(
        (item) => item.category === activeGlobalCategory
      );
    }
    if (activeGlobalRestaurant !== "All") {
      currentItems = currentItems.filter(
        (item) => item.restaurant === activeGlobalRestaurant
      );
    }
    if (activeGlobalDishType === "Veg") {
      currentItems = currentItems.filter((item) => item.isVeg);
    } else if (activeGlobalDishType === "Non-Veg") {
      currentItems = currentItems.filter((item) => !item.isVeg);
    }

    setFilteredGlobalItems(currentItems.sort((a, b) => a.id - b.id));
  }, [
    activeGlobalCategory,
    activeGlobalRestaurant,
    activeGlobalDishType,
    activeFeaturedView,
  ]);

  // Global Cuisine Filter Handler (activates featured view on Menu page)
  const handleGlobalCuisineFeatured = (filterKey) => {
    const viewKey = `GlobalCuisine:${filterKey}`;
    const categoryData = globalCuisineCategories.find(
      (c) => c.filterKey === filterKey
    );

    if (filterKey === "All") {
      clearFeaturedView();
      setActiveGlobalCategory("All");
      return;
    }
    if (activeFeaturedView && activeFeaturedView.key === viewKey) {
      clearFeaturedView();
      return;
    }

    setSavedScrollPosition(window.scrollY);

    // Filter globalFoodItems to find the items for this category
    const preFilteredItems = globalFoodItems.filter(
      (item) => item.category === filterKey
    );
    setGeneralCategoryDishes(
      preFilteredItems.slice(0, 8).sort((a, b) => a.id - b.id)
    );

    setActiveFeaturedView({ key: viewKey, name: categoryData.name });
    setActiveGlobalCategory(filterKey);
    setActiveGlobalRestaurant("All");
    setActiveGlobalDishType("All");
  };

  const handleGlobalRestaurantFilter = (restaurant) => {
    setActiveGlobalRestaurant(restaurant);
    clearFeaturedView();
  };

  const handleGlobalDishTypeFilter = (type) => {
    setActiveGlobalDishType(type);
    clearFeaturedView();
  };

  // --- SHARED HANDLERS ---

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    if (!isCartOpen) setIsCartOpen(true);
  };

  const handleRemoveFromCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (!existingItem) return;

    if (existingItem.quantity === 1) {
      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const handleNavigate = (page) => {
    // Clear any active featured view when changing pages
    setActiveFeaturedView(null);
    setGeneralCategoryDishes([]);
    setCurrentPage(page);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setCheckoutMessage(
        "Order Placed! Please scan the QR code at the counter."
      );
      setCartItems([]);
      setTimeout(() => setCheckoutMessage(""), 4000);
    }
  };

  // Conditional rendering based on currentPage
  const renderPageContent = () => {
    switch (currentPage) {
      case "Home":
        const itemsToDisplayHome = activeFeaturedView
          ? generalCategoryDishes
          : filteredLocalItems;
        return (
          <>
            <HeroBanner />
            <div className="main-layout">
              <LocalFoodMainContent
                foodItems={itemsToDisplayHome}
                onAddToCart={handleAddToCart}
                onCardClick={openDishModal}
                // Unified Featured View Props
                activeFeaturedView={activeFeaturedView}
                onClearFeaturedView={clearFeaturedView}
                onSelectGeneralCategory={handleLocalGeneralCategorySelect} // Global Bar on Home
                onSelectCategory={handleLocalCategoryFilter} // Local Bar on Home
                generalCategoryDishes={generalCategoryDishes}
                // Standard Filter Props
                activeRestaurant={activeLocalRestaurant}
                onSelectRestaurant={handleLocalRestaurantFilter}
                activeDishType={activeLocalDishType}
                onSelectDishType={handleLocalDishTypeFilter}
              />
            </div>
          </>
        );
      case "Menu": // New Global Menu page
        const itemsToDisplayGlobal = activeFeaturedView
          ? generalCategoryDishes
          : filteredGlobalItems;
        return (
          <div className="main-layout">
            <GlobalFoodMainContent
              foodItems={itemsToDisplayGlobal}
              onAddToCart={handleAddToCart}
              onCardClick={openDishModal} // Pass openDishModal here
              // Filter Props
              activeRestaurant={activeGlobalRestaurant}
              onSelectRestaurant={handleGlobalRestaurantFilter}
              activeDishType={activeGlobalDishType}
              onSelectDishType={handleGlobalDishTypeFilter}
              // Featured View Props for Menu Page (Cuisine Bar Click)
              activeFeaturedView={activeFeaturedView}
              onSelectCategory={handleGlobalCuisineFeatured}
              onClearFeaturedView={clearFeaturedView}
              generalCategoryDishes={generalCategoryDishes}
              // Pass the modal handler down
              openDishModal={openDishModal}
            />
          </div>
        );
      case "Offers": // Dedicated offers page
        return (
          <OffersPage
            offers={offers}
            onAddToCart={handleAddToCart}
            onCardClick={openDishModal}
          />
        );
      case "Service": // Updated to use the dedicated ServiceDetailsPage
        return <ServiceDetailsPage />;
      case "Contact": // Updated to use the dedicated ContactDetailsPage
        return <ContactDetailsPage />;
      case "SignUp": // NEW: Authentication Page
        return <AuthPage />;
      default:
        return (
          <>
            <div className="main-layout">
              <PlaceholderPage
                title="404 - Page Not Found"
                message="Oops! The page you are looking for doesn't exist."
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <style jsx="true">{`
        /* --- General Layout and Typography --- */
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");

        :root {
          --header-height: 60px; /* Define a consistent height for calculations */
        }

        /* Message Box for alerts */
        .alert-message-box {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          padding: 15px 30px;
          border-radius: 8px;
          font-weight: 600;
          z-index: 3000;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          animation: fadeInOut 3s forwards;
        }
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
          }
          10%,
          90% {
            opacity: 1;
          }
        }

        body {
          margin: 0;
          font-family: "Inter", sans-serif;
          /* Updated Background to warm gradient */
          background: linear-gradient(135deg, #fff5e0 0%, #ffebeb 100%);
          overflow-y: scroll; /* Allow body to scroll */
          overflow-x: hidden;
          color: #1a1a1a;
        }

        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh; /* Ensure container covers full height */
          overflow: hidden;
        }

        /* --- Logo Styles (MODIFIED) --- */
        .stylish-logo {
          font-family: "Inter", sans-serif;
          font-weight: 900;
          letter-spacing: -1px;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        }

        .stylish-logo.header-logo-text {
          /* NEW STYLE for name next to logo */
          color: #dc3545; /* Red for header logo name */
          font-size: 28px;
          font-weight: 800;
        }

        .stylish-logo.footer-logo-text {
          color: white; /* White for footer logo on dark background */
        }

        /* Grouping for Image + Text Logo (MODIFIED) */
        .logo-name-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-image-logo {
          height: 40px; /* Fixed height for the logo image */
          width: auto;
          object-fit: contain;
        }

        /* --- Header Styles --- */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 30px;
          background-color: #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08); /* Stronger shadow for contrast */
          position: sticky;
          top: 0;
          z-index: 100; /* Increased z-index for sticky header */
          height: var(--header-height);
          box-sizing: border-box; /* Include padding in height calculation */
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .main-nav-links {
          display: flex;
          gap: 20px;
        }
        .header-link {
          display: flex;
          align-items: center;
          color: #333;
          font-weight: 500;
          text-decoration: none;
          padding: 5px 0;
        }
        .nav-item {
          color: #1a1a1a;
          font-weight: 700;
          transition: color 0.2s, border-bottom 0.2s;
          position: relative;
        }
        .nav-item:hover {
          color: #dc3545;
        }
        .nav-item.active {
          color: #dc3545; /* Active color: Red */
          border-bottom: 2px solid #dc3545; /* Underline the active link */
          padding-bottom: 5px; /* Add padding to lift the text slightly */
        }

        /* Sign Up Button Styling (Requirement 1) */
        .sign-up-button-link {
          background-color: #17a2b8; /* Blue for Sign Up/User action */
          color: white !important;
          border-radius: 8px;
          padding: 8px 15px;
          font-size: 14px;
          font-weight: 700;
          transition: background-color 0.2s, transform 0.1s;
          box-shadow: 0 4px 8px rgba(23, 162, 184, 0.3);
          border-bottom: none !important; /* Remove underline/border */
        }
        .sign-up-button-link:hover {
          background-color: #138496;
          transform: translateY(-2px);
        }

        .header-button,
        .cart-toggle-button {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background-color: #fff;
          cursor: pointer;
          transition: background-color 0.2s;
          color: #555;
        }
        .login-btn {
          background-color: #dc3545;
          color: white;
          border-color: #dc3545;
        }
        .login-btn:hover {
          background-color: #c82333;
        }

        /* --- Hero Banner Styles --- */
        .hero-banner {
          position: relative;
          width: 100%;
          height: 400px; /* Large initial size */
          overflow: hidden;
        }
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(60%); /* Darken image for text readability */
        }
        .main-intro {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 80%;
          z-index: 10;
        }
        .main-title {
          font-size: 52px;
          font-weight: 900;
          color: white;
          margin: 0 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
        }
        .main-subtitle {
          font-size: 20px;
          color: #ccc;
          margin: 0;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
        }

        /* --- Main Layout --- */
        .main-layout {
          display: block;
          flex-grow: 1;
          overflow-x: hidden;
          padding: 30px 40px; /* Combined padding from main-content */
        }
        .main-content {
          flex-grow: 1;
          padding: 0;
          overflow-y: visible;
          background-color: transparent;
          position: relative;
          z-index: 20;
        }
        .section-heading {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 30px;
          margin-bottom: 20px;
        }

        /* --- Rest of the existing CSS remains below --- */

        .offers-page-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 40px;
        }

        .page-heading {
          font-size: 32px;
          font-weight: 900;
          color: #dc3545;
          text-align: center;
          margin-bottom: 10px;
        }

        .page-subheading {
          font-size: 18px;
          color: #6a6a6a;
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .service-page-layout {
          max-width: 1000px;
          margin: 0 auto;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          padding: 30px 0;
        }

        .service-card {
          background-color: #ffffff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-top: 4px solid #17a2b8;
          transition: transform 0.3s;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .service-card-title {
          font-size: 22px;
          font-weight: 800;
          color: #dc3545;
          margin-top: 0;
          margin-bottom: 15px;
        }

        .service-card-description {
          font-size: 15px;
          color: #555;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .service-list {
          list-style: none;
          padding-left: 0;
          margin-top: 15px;
          border-top: 1px dashed #eee;
          padding-top: 15px;
        }

        .service-list li {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
          padding-left: 1.5em;
          position: relative;
        }

        .service-list li::before {
          content: "✅";
          position: absolute;
          left: 0;
        }

        .auth-page-layout {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(
            100vh - var(--header-height) - 150px
          ); /* Account for header/footer height */
          padding-top: 40px;
          padding-bottom: 40px;
        }

        .auth-card {
          background-color: #ffffff;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .auth-title {
          font-size: 28px;
          font-weight: 900;
          color: #dc3545;
          margin-bottom: 25px;
        }

        .auth-toggle {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          border-bottom: 2px solid #eee;
        }

        .auth-toggle button {
          flex: 1;
          padding: 10px 0;
          background: none;
          border: none;
          color: #888;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: color 0.2s, border-bottom 0.2s;
          margin-bottom: -2px;
        }

        .auth-toggle button.active {
          color: #dc3545;
          border-bottom: 3px solid #dc3545;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .auth-form input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .auth-form input:focus {
          outline: none;
          border-color: #17a2b8;
          box-shadow: 0 0 5px rgba(23, 162, 184, 0.3);
        }

        .auth-main-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
          box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
          margin-top: 5px;
        }

        .auth-main-btn:hover {
          background-color: #c82333;
        }

        .auth-separator {
          text-align: center;
          color: #aaa;
          font-size: 14px;
          margin: 5px 0;
          position: relative;
        }

        .auth-separator::before,
        .auth-separator::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: #eee;
        }

        .auth-separator::before {
          left: 0;
        }

        .auth-separator::after {
          right: 0;
        }

        .auth-google-btn {
          background-color: #fff;
          color: #4a4a4a;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .auth-google-btn:hover {
          background-color: #f5f5f5;
        }

        .auth-footer-text {
          margin-top: 20px;
          font-size: 14px;
          color: #6a6a6a;
        }

        .auth-toggle-link {
          color: #dc3545;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          margin-left: 5px;
        }

        .general-food-bar-wrapper,
        .cuisine-bar-wrapper,
        .restaurant-bar-wrapper {
          margin-bottom: 30px;
          position: relative;
        }

        .general-food-bar-title-section,
        .cuisine-bar-title-section,
        .restaurant-bar-title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-right: 70px; /* Space for buttons */
        }

        .general-food-bar-title-text,
        .cuisine-bar-title-text,
        .restaurant-bar-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          color: #1a1a1a;
        }

        .scroll-controls {
          position: absolute;
          right: 0;
          top: -5px; /* Adjust position relative to the wrapper */
          display: flex;
          gap: 10px;
        }

        .scroll-btn {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
          color: #4a4a4a;
        }

        .scroll-btn:hover {
          background-color: #fff0f0;
          border-color: #dc3545;
          color: #dc3545;
        }

        .general-food-bar-container,
        .cuisine-bar-container,
        .restaurant-bar-container {
          padding: 10px 0;
          overflow: hidden; /* Hide default scrollbar */
        }

        .general-food-bar,
        .cuisine-bar,
        .restaurant-bar {
          display: flex;
          gap: 25px;
          padding-bottom: 10px;
          overflow-x: scroll;
          white-space: nowrap;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .general-food-bar::-webkit-scrollbar,
        .cuisine-bar::-webkit-scrollbar,
        .restaurant-bar::-webkit-scrollbar {
          display: none;
        }

        .general-food-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
          flex-shrink: 0;
          width: 80px;
          text-align: center;
        }
        .general-food-item:hover {
          transform: scale(1.05);
        }
        .general-food-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 8px;
          border: 2px solid transparent;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
        }
        .general-food-item.active .general-food-icon-wrapper {
          border-color: #17a2b8; /* Unique color for this bar's active state */
          background-color: #e0f7fa;
          box-shadow: 0 0 15px rgba(23, 162, 184, 0.3);
        }
        .general-food-name {
          font-size: 13px;
          font-weight: 600;
          color: #4a4a4a;
        }
        .general-food-item.active .general-food-name {
          color: #17a2b8;
        }

        .cuisine-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
          flex-shrink: 0;
          width: 80px;
          text-align: center;
        }

        .cuisine-item:hover {
          transform: scale(1.05);
        }

        .cuisine-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #ffffff; /* Consistent light background */
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 8px;
          border: 2px solid transparent;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
        }

        .cuisine-item.active .cuisine-icon-wrapper {
          border-color: #dc3545;
          background-color: #fff0f0;
          box-shadow: 0 0 15px rgba(220, 53, 69, 0.3);
        }

        .cuisine-name {
          font-size: 13px;
          font-weight: 600;
          color: #4a4a4a;
          white-space: normal; /* Allow wrap for long names */
          line-height: 1.2;
          height: 30px; /* Fixed height for consistent layout */
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .cuisine-item.active .cuisine-name {
          color: #dc3545;
        }

        .category-details-display {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 40px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid #ddd;
        }

        .details-title {
          font-size: 24px;
          font-weight: 800;
          color: #1a1a1a;
          margin-top: 0;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .details-description {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
          line-height: 1.5;
          border-left: 4px solid #f0ad4e;
          padding-left: 15px;
        }

        .featured-dishes-title {
          font-size: 20px;
          font-weight: 700;
          color: #17a2b8;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .featured-dishes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .clear-category-button {
          background-color: #f0f0f0;
          color: #dc3545;
          border: 1px solid #dc3545;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
        }

        .clear-category-button:hover {
          background-color: #ffebeb;
        }

        .restaurant-bar-container {
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
        }
        .restaurant-item {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          flex-shrink: 0;
          background-color: #ffffff;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .restaurant-item:hover {
          border-color: #dc3545;
        }
        .restaurant-item.active {
          background-color: #dc3545;
          color: white;
          border-color: #dc3545;
          font-weight: 600;
        }
        .restaurant-item.active .restaurant-name {
          color: white;
        }
        .restaurant-item .restaurant-name {
          font-size: 14px;
          color: #4a4a4a;
        }
        .restaurant-item.active .restaurant-name {
          color: white;
        }
        .dish-type-filter-bar-container {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          margin-top: -10px; /* Pull up slightly closer to the heading */
        }
        .dish-type-btn {
          display: flex;
          align-items: center;
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid #ddd;
          background-color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
          color: #4a4a4a;
        }
        .dish-type-btn:hover {
          background-color: #f5f5f5;
        }
        .dish-type-btn.active {
          background-color: var(--active-color);
          color: white;
          border-color: var(--active-color);
        }
        .food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }
        .food-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
          padding: 15px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
        }
        .food-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .food-card img {
          width: calc(100% + 30px);
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin: -15px -15px 15px -15px;
        }
        .card-info {
          flex-grow: 1;
          width: 100%;
          text-align: left;
        }
        .card-category {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          color: white;
          margin-bottom: 8px;
          display: inline-block;
        }
        .veg-tag {
          background-color: #008000;
        }
        .non-veg-tag {
          background-color: #dc3545;
        }
        .card-info h4 {
          margin: 8px 0 5px;
          color: #1a1a1a;
          font-size: 18px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .restaurant-name-tag {
          font-size: 12px;
          color: #6a6a6a;
          margin-top: 5px;
          font-weight: 500;
        }
        .image-url-tag {
          margin-top: 5px;
          margin-bottom: 0;
          line-height: 1;
        }
        .price {
          font-weight: 800;
          color: #dc3545;
          font-size: 22px;
          margin-bottom: 10px;
        }
        .offer-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #17a2b8;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .add-button {
          background-color: #008000;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          width: 100%;
          transition: background-color 0.2s, transform 0.1s;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .add-button:hover {
          background-color: #006400;
          transform: translateY(-2px);
        }
        .offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .offer-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: flex-start; /* FIX: Align content elements to the top */
          padding: 15px;
          position: relative;
          border: 2px solid #f0f0f0;
          transition: border-color 0.2s;
          cursor: pointer;
        }

        .offer-details {
          flex-grow: 1;
          padding-right: 15px; /* Reduced padding slightly */
          display: flex;
          flex-direction: column;
          justify-content: space-between; /* Distribute space vertically */
          min-height: 100px; /* FIX: Enforce minimum height to prevent shifting */
        }

        .offer-card .add-button {
          width: 80px;
          padding: 8px 0;
          font-size: 14px;
          align-self: flex-end; /* FIX: Forces the button to the bottom */
          margin-left: 10px;
        }

        .offer-card h5 {
          font-size: 20px;
          color: #dc3545;
          margin: 0 0 5px 0;
          font-weight: 700;
        }

        .offer-card .price {
          font-size: 20px;
          color: #1a1a1a;
          margin-bottom: 5px; /* Added margin for consistency */
        }

        .customization-info {
          font-size: 13px;
          color: #008000;
          font-weight: 600;
          margin-top: 5px; /* Added margin for consistency */
        }

        .offer-size {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 4px 8px;
          background-color: #17a2b8;
          color: white;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .offer-card:hover {
          border-color: #dc3545;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Slight elevation on hover */
        }
        .offer-card img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .modal-veg-tag.offer-tag {
          background-color: #17a2b8; /* Blue for Offers */
        }

        .shopping-cart {
          position: fixed;
          top: var(--header-height);
          right: 0;
          height: calc(100vh - var(--header-height));
          bottom: 0;
          width: 380px;
          background-color: #ffffff;
          padding: 25px;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .shopping-cart.open {
          transform: translateX(0%);
        }
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        .cart-close-btn {
          background: none;
          border: none;
          color: #777;
          cursor: pointer;
          padding: 5px;
          transition: color 0.2s;
        }
        .cart-close-btn:hover {
          color: #dc3545;
        }
        .cart-header h3 {
          margin-top: 0;
        }
        .cart-items {
          flex-grow: 1;
          overflow-y: auto;
          margin-bottom: 20px;
          min-height: 50px;
          padding-right: 10px;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px dashed #eee;
        }
        .cart-item-name {
          font-weight: 600;
          color: #333;
          max-width: 40%;
          font-size: 15px;
        }
        .item-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .cart-price {
          color: #dc3545;
          font-weight: 700;
          font-size: 18px;
        }
        .quantity-stepper {
          display: flex;
          align-items: center;
          border: 1px solid #dc3545;
          border-radius: 5px;
          overflow: hidden;
        }
        .quantity-stepper button {
          background-color: #fff0f0;
          color: #dc3545;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.1s;
        }
        .quantity-stepper button:hover {
          background-color: #dc3545;
          color: white;
        }
        .quantity-stepper span {
          padding: 0 12px;
          color: #333;
          font-weight: normal;
        }
        .cart-summary-container {
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }
        .cart-summary {
          display: flex;
          justify-content: space-between;
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #1a1a1a;
        }
        .total-price {
          color: #dc3545;
        }
        .checkout-button {
          width: 100%;
          padding: 18px;
          background-color: #008000;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(0, 128, 0, 0.3);
        }
        .checkout-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          box-shadow: none;
        }
        .empty-cart-message {
          text-align: center;
          color: #888;
          margin-top: 50px;
          font-style: italic;
        }
        .checkout-message {
          text-align: center;
          padding: 10px;
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          border-radius: 5px;
          margin-bottom: 15px;
          font-weight: bold;
          animation: fadeOut 4s forwards;
          pointer-events: none;
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .app-footer {
          background-color: #171a29; /* Dark footer background */
          color: #ccc;
          padding: 40px 60px;
          font-size: 14px;
          margin-top: 40px; /* Separator from main content */
          flex-shrink: 0;
        }
        .footer-content-wrapper {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr) 1.5fr;
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-logo-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .copyright-text {
          color: #777;
          font-size: 12px;
          margin: 0;
        }
        .footer-column h4 {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-column ul li {
          margin-bottom: 8px;
        }
        .footer-column ul li a {
          color: #ccc;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-column ul li a:hover {
          color: #dc3545; /* Highlight on hover */
        }
        .footer-social-links {
          display: flex;
          gap: 15px;
          margin-bottom: 25px !important;
        }
        .footer-social-links a {
          color: #fff !important;
          padding: 5px;
          border: 1px solid #fff;
          border-radius: 4px;
          line-height: 0;
        }
        .footer-social-links a:hover {
          background-color: #dc3545;
          border-color: #dc3545;
        }
        .footer-legal-links li {
          margin-bottom: 5px;
        }

        .dish-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }
        .dish-modal-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        .dish-modal-content {
          background-color: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 20px;
          transform: scale(0.95);
          transition: transform 0.3s;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
        }
        .dish-modal-overlay.open .dish-modal-content {
          transform: scale(1);
        }
        .modal-close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          font-weight: 300;
          color: #333;
          cursor: pointer;
          line-height: 1;
          z-index: 10;
          padding: 5px;
          border-radius: 50%;
          transition: background-color 0.1s;
        }
        .modal-close-btn:hover {
          background-color: #f0f0f0;
        }
        .modal-dish-image {
          width: calc(100% + 40px);
          height: 250px;
          object-fit: cover;
          border-radius: 8px;
          margin: -20px -20px 20px -20px;
        }
        .modal-details {
          padding: 0 10px;
        }
        .modal-dish-name {
          font-size: 28px;
          font-weight: 900;
          color: #dc3545;
          margin: 0;
        }
        .modal-dish-price {
          font-size: 24px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 15px;
        }
        .modal-dish-description {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .modal-restaurant-tag {
          font-size: 14px;
          color: #888;
          margin-bottom: 30px;
        }
        .modal-add-btn {
          background-color: #008000;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 700;
          width: 100%;
          transition: background-color 0.2s, transform 0.1s;
        }
        .modal-add-btn:hover {
          background-color: #006400;
        }

        /* --- Responsive Adjustments --- */
        @media (max-width: 1024px) {
          .header-left {
            gap: 15px;
          }
          .main-nav-links {
            display: none;
          }
          .header {
            padding: 10px 20px;
          }
          .hero-banner {
            height: 300px;
          }
          .main-title {
            font-size: 40px;
          }
          .main-subtitle {
            font-size: 18px;
          }
          .shopping-cart {
            width: 320px;
            height: calc(100vh - var(--header-height));
            max-height: 100vh;
            bottom: 0;
            right: 0;
          }
          .main-layout {
            padding: 20px;
          }
          .app-footer {
            padding: 30px 20px;
          }
          .footer-content-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }
          .footer-logo-section {
            grid-column: 1 / 4;
            text-align: center;
          }
          .footer-social-links {
            justify-content: center;
          }
          .footer-column:nth-child(5) {
            /* Legal & Social column */
            grid-column: 1 / 4;
            text-align: center;
          }
          .footer-legal-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px 20px;
          }
          .featured-dishes-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .header {
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .header-left {
            width: 50%;
          }
          .header-right {
            width: 50%;
            justify-content: flex-end;
            gap: 8px;
          }
          .sign-up-button-link {
            padding: 6px 10px;
          }

          .main-title {
            font-size: 30px;
          }
          .main-subtitle {
            font-size: 14px;
          }
          .hero-banner {
            height: 250px;
          }
          .section-heading {
            font-size: 20px;
          }

          .shopping-cart {
            width: 100%; /* Full width overlay */
          }

          .dish-modal-content {
            max-width: 95%;
            padding: 15px;
          }
          .modal-dish-image {
            margin: -15px -15px 15px -15px;
          }
          .modal-dish-name {
            font-size: 24px;
          }

          .footer-content-wrapper {
            grid-template-columns: 1fr;
          }
          .footer-logo-section {
            grid-column: auto;
          }
          .footer-column {
            margin-bottom: 20px;
          }
          .footer-column:nth-child(5) {
            /* Legal & Social column */
            grid-column: auto;
          }
          .scroll-controls {
            display: none; /* Hide buttons on smallest screens */
          }
          .featured-dishes-grid {
            grid-template-columns: 1fr;
          }

          .offers-page-layout {
            padding: 20px 0;
          }

          .page-heading {
            font-size: 28px;
          }
          .page-subheading {
            font-size: 16px;
          }

          .service-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Pass navigation state and handler to Header */}
      <Header
        onToggleCart={toggleCart}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Render content based on current page state */}
      {renderPageContent()}

      {/* CartView is always an overlay, independent of page content */}
      <CartView
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
        checkoutMessage={checkoutMessage}
        isCartOpen={isCartOpen}
        onToggleCart={toggleCart}
      />

      {/* Dish Modal is conditionally rendered here */}
      {isModalOpen && selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={closeDishModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Footer is now outside the main-layout to stick to the bottom */}
      <AppFooter />
    </div>
  );
};

export default App;
