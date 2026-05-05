import bcrypt from "bcryptjs";
import slugify from "slugify";

import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";
import { Package } from "../models/Package.js";
import { Service } from "../models/Service.js";
import { Trek } from "../models/Trek.js";
import { Tour } from "../models/Tour.js";
import { Gallery } from "../models/Gallery.js";
import { ContactInfo } from "../models/ContactInfo.js";
import { Expert } from "../models/Expert.js";

async function seedAdmin() {
  const email = env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({ email: email.toLowerCase(), passwordHash });

  // eslint-disable-next-line no-console
  console.log(`[seed] admin created: ${email} / ${password}`);
}

async function seedContact() {
  const existing = await ContactInfo.findOne({ _singleton: "CONTACT_INFO_SINGLETON" });
  if (existing) return;

  await ContactInfo.create({
    phone: "9816142050",
    email: "tapobhumi@gmail.com",
    whatsapp: "9816142050",
    socialLinks: {
      instagram: "#",
      facebook: "#",
      youtube: "#",
    },
  });
}

async function seedCoreContent() {
  const any = await Package.exists({});
  if (any) return;

  await Package.insertMany([
    {
      title: "Spiritual Nepal",
      slug: slugify("Spiritual Nepal", { lower: true, strict: true }),
      duration: "6 Days · 5 Nights",
      category: "spiritual",
      featured: true,
      itinerary: [
        { day: 1, title: "Kathmandu Sacred Circuit", description: "Pashupatinath, Budhanilkantha, Swayambhunath, Basantapur Durbar Square, Patan." },
        { day: 2, title: "Drive to Pokhara", description: "Scenic mountain drive with the Manakamana Cable Car ride to the wish-fulfilling temple." },
        { day: 3, title: "Pokhara Wonders", description: "Sarangkot sunrise, Pumdikot Shiva, Gupteshwor Cave, Davis Falls, Tal Barahi boat ride." },
        { day: 4, title: "Drive to Muktinath", description: "Journey through the Mustang valley — landscapes that change with every turn." },
        { day: 5, title: "Muktinath Darshan", description: "Sacred 108 water spouts, eternal flame, the soul's pilgrimage. Return to Pokhara." },
        { day: 6, title: "Return to Kathmandu", description: "Quiet drive back, hearts a little lighter than when you arrived." },
      ],
      images: [],
    },
    {
      title: "Pokhara Retreat",
      slug: slugify("Pokhara Retreat", { lower: true, strict: true }),
      duration: "3 Days · 2 Nights",
      category: "tour",
      featured: true,
      itinerary: [
        { day: 1, title: "Lakeside Welcome", description: "Arrive Pokhara, evening boat ride on Phewa, Tal Barahi temple visit, lakeside dinner." },
        { day: 2, title: "Sunrise & Stillness", description: "Sarangkot sunrise, World Peace Pagoda, Begnas Lake afternoon, Majhikuna fish experience." },
        { day: 3, title: "Mountain Farewell", description: "Slow morning, café-hop along the lakeside, mountain view brunch, depart." },
      ],
      images: [],
    },
  ]);

  await Service.insertMany([
    { title: "Airport Pickup", description: "Smooth arrival transfers with a local driver." },
    { title: "Private Vehicle", description: "Comfortable jeeps/vans for flexible itineraries." },
    { title: "Temple Guide", description: "Respectful guidance for darshan and rituals." },
  ]);

  await Trek.insertMany([
    { name: "Annapurna Base Camp", description: "Classic Himalayan trek with diverse landscapes." },
    { name: "Ghorepani Poon Hill", description: "Short sunrise trek with panoramic views." },
  ]);

  await Tour.insertMany([
    { name: "Kathmandu Heritage Tour", route: "Pashupatinath → Swayambhu → Patan", description: "A day among UNESCO heritage sites." },
    { name: "Pokhara Highlights", route: "Sarangkot → Peace Pagoda → Lakeside", description: "Sunrise, viewpoints, and a lakeside evening." },
  ]);

  await Gallery.insertMany([
    { title: "Muktinath Temple", imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60" },
    { title: "Himalayan Sunrise", imageUrl: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=60" },
  ]);
}

async function seedExperts() {
  const any = await Expert.exists({});
  if (any) return;

  await Expert.insertMany([
    {
      name: "Rajib Rimal",
      phone: "9816142050",
      role: "Co-Founder",
      image: "/founders-images/founder2.jpeg",
    },
    {
      name: "Prabin Baral",
      phone: "9816142050",
      role: "Co-Founder",
      image: "/founders-images/founder1.jpeg",
    },
  ]);
}

async function main() {
  await connectDb();
  await seedAdmin();
  await seedContact();
  await seedCoreContent();
  await seedExperts();
  // eslint-disable-next-line no-console
  console.log("[seed] done");
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[seed] failed", err);
  process.exit(1);
});

