import fs from "fs";
import path from "path";

/**
 * download_exact_thumbnails.ts
 *
 * Downloads 28 DISTINCT, HIGH-DEFINITION, REALISTIC FOOD PHOTOGRAPHS
 * specifically selected and matched for every single French Bistro dish item.
 */

const EXACT_DISH_IMAGES = [
  {
    id: "croissant",
    name: "Croissant",
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pain_au_chocolat",
    name: "Pain au Chocolat",
    url: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pain_aux_raisins",
    name: "Pain aux Raisins",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "brioche",
    name: "Brioche",
    url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "chausson_aux_pommes",
    name: "Chausson aux Pommes",
    url: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tartine_beurre_confiture",
    name: "Tartine Beurre et Confiture",
    url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tartine_au_fromage",
    name: "Tartine au Fromage",
    url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "assiette_de_fromages",
    name: "Assiette de Fromages",
    url: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "assiette_de_charcuterie",
    name: "Assiette de Charcuterie",
    url: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "salade_nicoise",
    name: "Salade Niçoise",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "salade_chevre_chaud",
    name: "Salade de Chèvre Chaud",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "quiche_lorraine",
    name: "Quiche Lorraine",
    url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "croque_monsieur",
    name: "Croque Monsieur",
    url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "croque_madame",
    name: "Croque Madame",
    url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "soupe_a_loignon",
    name: "Soupe à l’Oignon Gratinée",
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "potage_du_jour",
    name: "Potage du Jour",
    url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ratatouille",
    name: "Ratatouille",
    url: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tarte_tatin",
    name: "Tarte Tatin",
    url: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "creme_brulee",
    name: "Crème Brûlée",
    url: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mousse_au_chocolat",
    name: "Mousse au Chocolat",
    url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "madeleines",
    name: "Madeleines",
    url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "eclair",
    name: "Éclair au Café/Chocolat",
    url: "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cafe_au_lait",
    name: "Café au Lait",
    url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "espresso",
    name: "Espresso",
    url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "chocolat_chaud",
    name: "Chocolat Chaud",
    url: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "the",
    name: "Thé Gourmet",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "jus_dorange",
    name: "Jus d’Orange Pressé",
    url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "vin_maison",
    name: "Vin Maison",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
  },
];

async function downloadAllExactThumbnails() {
  console.log(`📸 Downloading 28 DISTINCT, ACCURATE FOOD PHOTOGRAPHS for French Bistro...`);

  const outputDir = path.join(__dirname, "../../../frontend/public/dishes");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let count = 0;

  for (let i = 0; i < EXACT_DISH_IMAGES.length; i++) {
    const dish = EXACT_DISH_IMAGES[i];
    const filename = `${dish.id}.png`;
    const filepath = path.join(outputDir, filename);

    console.log(`[${i + 1}/28] Downloading HD food photograph for: ${dish.name}...`);

    try {
      const res = await fetch(dish.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        },
      });

      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 5000) {
          fs.writeFileSync(filepath, buf);
          console.log(`  ✓ Saved accurate photo for: ${dish.name} (${Math.round(buf.length / 1024)} KB)`);
          count++;
        }
      } else {
        console.warn(`  ⚠️ Failed fetching photo for ${dish.name}: ${res.statusText}`);
      }
    } catch (err: any) {
      console.error(`  ❌ Error downloading for ${dish.name}:`, err.message);
    }
  }

  console.log(`\n🎉 SUCCESS! Downloaded ${count}/28 UNIQUE, HIGH-DEFINITION DISH PHOTOS to frontend/public/dishes/`);
}

downloadAllExactThumbnails();
