/**
 * Mock Property Data
 * Sample properties for the real estate listing
 */
export const properties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "123 Main Street, Manhattan, NY",
    price: 2500,
    description:
      "Experience luxury living in this stunning modern apartment located in the heart of downtown Manhattan. This beautifully designed space features floor-to-ceiling windows with breathtaking city views, high-end finishes throughout, and an open-concept layout perfect for entertaining. The building offers world-class amenities including a rooftop terrace, fitness center, and 24-hour concierge service.",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    ],
    featured: true,
    type: "Apartment",
    amenities: ["Gym", "Rooftop", "Concierge", "Parking", "Pool"],
  },
  {
    id: 2,
    title: "Cozy Studio Near Campus",
    location: "456 University Ave, Boston, MA",
    price: 1200,
    description:
      "Perfect for students! This cozy studio apartment is just a 5-minute walk from campus. Features include a fully equipped kitchenette, built-in storage solutions, high-speed internet ready, and in-unit laundry. The building has secure entry and on-site management. Utilities included in rent.",
    bedrooms: 0,
    bathrooms: 1,
    area: 450,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
    ],
    featured: false,
    type: "Studio",
    amenities: ["WiFi", "Laundry", "Security"],
  },
  {
    id: 3,
    title: "Spacious Family Home",
    location: "789 Oak Lane, Suburbs, LA",
    price: 3500,
    description:
      "Beautiful family home in a quiet suburban neighborhood. This spacious property features a large backyard perfect for kids and pets, updated kitchen with stainless steel appliances, hardwood floors throughout, attached two-car garage, and a finished basement. Excellent school district and close to parks.",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
    ],
    featured: true,
    type: "House",
    amenities: ["Garage", "Backyard", "Basement", "Central AC"],
  },
  {
    id: 4,
    title: "Luxury Penthouse Suite",
    location: "1000 Skyline Drive, Miami, FL",
    price: 8500,
    description:
      "Exclusive penthouse living at its finest. This stunning duplex penthouse offers panoramic ocean and city views from every room. Features include a private elevator, chef's kitchen with premium appliances, marble bathrooms, smart home technology, and a wrap-around terrace. Building amenities include infinity pool, spa, and private beach access.",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 3200,
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&auto=format&fit=crop",
    ],
    featured: true,
    type: "Penthouse",
    amenities: [
      "Pool",
      "Spa",
      "Beach Access",
      "Smart Home",
      "Private Elevator",
    ],
  },
  {
    id: 5,
    title: "Charming Victorian Townhouse",
    location: "234 Heritage Row, San Francisco, CA",
    price: 4200,
    description:
      "Step into history with this beautifully restored Victorian townhouse. Original architectural details blend seamlessly with modern updates. Features include restored hardwood floors, ornate fireplaces, updated kitchen and baths, private garden patio, and a charming bay window. Located in a historic neighborhood near shops and restaurants.",
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&auto=format&fit=crop",
    ],
    featured: false,
    type: "Townhouse",
    amenities: ["Garden", "Fireplace", "Historic"],
  },
  {
    id: 6,
    title: "Modern Loft Space",
    location: "567 Industrial Blvd, Brooklyn, NY",
    price: 2800,
    description:
      "Stunning converted warehouse loft in trendy Brooklyn. This unique space features soaring 14-foot ceilings, exposed brick walls, polished concrete floors, and oversized factory windows flooding the space with natural light. Open floor plan perfect for artists or remote workers. Building has freight elevator and rooftop access.",
    bedrooms: 1,
    bathrooms: 1,
    area: 1600,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop",
    ],
    featured: false,
    type: "Loft",
    amenities: ["Rooftop", "High Ceilings", "Exposed Brick"],
  },
  {
    id: 7,
    title: "Beachfront Condo",
    location: "890 Ocean Drive, San Diego, CA",
    price: 3800,
    description:
      "Wake up to stunning ocean views in this beautiful beachfront condo. Direct beach access, open floor plan with modern coastal decor, gourmet kitchen, and a spacious balcony perfect for watching sunsets. Resort-style amenities include pool, hot tub, fitness center, and on-site dining.",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
    ],
    featured: true,
    type: "Condo",
    amenities: ["Beach Access", "Pool", "Balcony", "Gym"],
  },
  {
    id: 8,
    title: "Quiet Garden Apartment",
    location: "321 Green Valley, Austin, TX",
    price: 1800,
    description:
      "Peaceful ground-floor apartment with private garden access. Perfect for nature lovers, this unit features large windows overlooking mature trees, updated appliances, in-unit washer/dryer, and a private patio. Pet-friendly community with walking trails and dog park nearby.",
    bedrooms: 2,
    bathrooms: 1,
    area: 950,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop",
    ],
    featured: false,
    type: "Apartment",
    amenities: ["Garden", "Pet-Friendly", "Patio", "Laundry"],
  },
];

/**
 * Get all properties
 */
export const getAllProperties = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(properties), 500);
  });
};

/**
 * Get property by ID
 */
export const getPropertyById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const property = properties.find((p) => p.id === parseInt(id));
      if (property) {
        resolve(property);
      } else {
        reject(new Error("Property not found"));
      }
    }, 300);
  });
};

/**
 * Get featured properties
 */
export const getFeaturedProperties = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(properties.filter((p) => p.featured));
    }, 500);
  });
};

export default properties;
