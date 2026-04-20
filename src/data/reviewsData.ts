export interface Review {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
}

export const reviewsData: Review[] = [
  {
    id: 1,
    name: "Rahim Ahmed",
    role: "Top Reseller",
    image: "https://i.pravatar.cc/150?img=11", // Replace with actual images
    content:
      "ShopBase BD has completely transformed my side business. The zero investment model is a game-changer, and the product quality is excellent. Highly recommended for anyone starting out!",
  },
  {
    id: 2,
    name: "Fatima Hossain",
    role: "Entrepreneur",
    image: "https://i.pravatar.cc/150?img=5",
    content:
      "I've been using this platform for 6 months, and the instant payment feature is my favorite. The support team is also very helpful. It's the best dropshipping platform in Bangladesh.",
  },
  {
    id: 3,
    name: "Karimul Islam",
    role: "Student & Reseller",
    image: "https://i.pravatar.cc/150?img=33",
    content:
      "As a student, I wanted to earn some extra money. ShopBase BD made it so easy. I don't need to worry about inventory or delivery. I just focus on selling and earning.",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    role: "Online Seller",
    image: "https://i.pravatar.cc/150?img=45",
    content:
      "The variety of products is amazing. My customers love the clothing items. The platform is very user-friendly, and I can manage everything from my phone.",
  },
  {
    id: 5,
    name: "Sajid Hasan",
    role: "E-commerce Owner",
    image: "https://i.pravatar.cc/150?img=60",
    content:
      "Scaling my business was difficult until I found ShopBase BD. Their reliable delivery and quality products have helped me build trust with my customers. A fantastic partner!",
  },
];