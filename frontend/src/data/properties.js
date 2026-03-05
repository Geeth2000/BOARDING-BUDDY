/**
 * Mock Property Data
 * Sample properties for student accommodation in Sri Lanka
 * All prices are in LKR (Sri Lankan Rupees)
 */
export const properties = [
  {
    id: 1,
    title: "Modern Apartment Near Colombo University",
    location: "123 Galle Road, Colombo 03",
    price: 65000,
    description:
      "Experience comfortable living in this modern apartment located near the University of Colombo. This well-designed space features large windows with good natural light, air conditioning, and an open-concept layout. The building offers amenities including rooftop access, security, and 24-hour water supply.",
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
    amenities: ["WiFi", "Security", "Hot Water", "Parking", "AC"],
  },
  {
    id: 2,
    title: "Cozy Studio Near Moratuwa University",
    location: "45 Katubedda, Moratuwa",
    price: 18000,
    description:
      "Perfect for engineering students! This cozy studio apartment is just a 5-minute walk from University of Moratuwa campus. Features include a fully equipped kitchenette, built-in storage, high-speed WiFi ready, and attached bathroom. The building has secure entry. Utilities included in rent.",
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
    amenities: ["WiFi", "Security", "Utilities Included"],
  },
  {
    id: 3,
    title: "Spacious House in Nugegoda",
    location: "78 High Level Road, Nugegoda",
    price: 85000,
    description:
      "Beautiful house in a quiet residential area of Nugegoda. This spacious property features a large garden, updated kitchen, tiled floors throughout, parking space, and a separate utility area. Close to shops, restaurants, and public transport. Ideal for a group of students.",
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
    amenities: ["Garden", "Parking", "Kitchen", "Hot Water"],
  },
  {
    id: 4,
    title: "Premium Apartment in Colombo 7",
    location: "100 Wijerama Mawatha, Colombo 07",
    price: 120000,
    description:
      "Premium apartment living in the heart of Colombo 7. This well-appointed apartment offers city views from every room. Features include a modern kitchen with quality appliances, tiled bathrooms, air conditioning, and a balcony. Building amenities include gym, swimming pool, and 24-hour security.",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&auto=format&fit=crop",
    ],
    featured: true,
    type: "Apartment",
    amenities: ["Pool", "Gym", "Security", "AC", "Balcony"],
  },
  {
    id: 5,
    title: "Single Room Near Peradeniya University",
    location: "12 Galaha Road, Peradeniya",
    price: 12000,
    description:
      "Affordable single room ideal for Peradeniya University students. This comfortable room includes attached bathroom, cupboard space, study table, and good ventilation. Kitchen facilities available. Quiet neighborhood perfect for studying. Walking distance to university main gate.",
    bedrooms: 1,
    bathrooms: 1,
    area: 200,
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&auto=format&fit=crop",
    ],
    featured: false,
    type: "Room",
    amenities: ["WiFi", "Study Table", "Attached Bath"],
  },
  {
    id: 6,
    title: "Shared Room Near Kelaniya University",
    location: "56 Dalugama, Kelaniya",
    price: 8000,
    description:
      "Budget-friendly shared room ideal for Kelaniya University students. This clean space features two beds, shared bathroom facilities, common kitchen area, and good ventilation. Building has security gate. Close to bus routes and university. Perfect for students on a budget.",
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop",
    ],
    featured: false,
    type: "Shared",
    amenities: ["WiFi", "Kitchen", "Security"],
  },
  {
    id: 7,
    title: "Annex Near SLIIT Malabe",
    location: "89 New Kandy Road, Malabe",
    price: 35000,
    description:
      "Well-maintained annex near SLIIT campus in Malabe. Direct access from main road, this unit offers bedroom, living area, kitchen, and bathroom. Features include tiled floors, good natural light, covered parking, and private entrance. Walking distance to SLIIT and shopping centers.",
    bedrooms: 2,
    bathrooms: 1,
    area: 800,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
    ],
    featured: true,
    type: "Annex",
    amenities: ["Parking", "Kitchen", "Hot Water", "Private Entrance"],
  },
  {
    id: 8,
    title: "Girls Hostel Near Colombo Campus",
    location: "32 Reid Avenue, Colombo 07",
    price: 15000,
    description:
      "Safe and comfortable girls-only hostel near Colombo university area. This unit features furnished room, attached bathroom, common kitchen, and study area. Building has 24-hour security, CCTV, and warden. Utilities included in rent. Ideal for female students seeking secure accommodation.",
    bedrooms: 1,
    bathrooms: 1,
    area: 250,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop",
    ],
    featured: false,
    type: "Hostel",
    amenities: ["Security", "CCTV", "WiFi", "Utilities Included"],
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
