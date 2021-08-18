const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");

const traitValues = {
  hair: [
    "Beanie",
    "Pilot Helmet",
    "Tiara",
    "Orange Side",
    "Pigtails",
    "Pink With Hat",
    "Top Hat",
    "Blonde Short",
    "Wild White Hair",
    "Cowboy Hat",
    "Wild Blonde",
    "Straight Hair Blonde",
    "Half Shaved",
    "Vampire Hair",
    "Red Mohawk",
    "Blonde Bob",
    "Clown Hair Green",
    "Straight Hair Dark",
    "Straight Hair",
    "Dark Hair",
    "Purple Hair",
    "Tassle Hat",
    "Fedora",
    "Police Cap",
    "Cap Forward",
    "Hoodie",
    "Shaved Head",
    "Do-rag",
    "Peak Spike",
    "Cap",
    "Headband",
    "Crazy Hair",
    "Knitted Cap",
    "Mohawk Dark",
    "Mohawk Thin",
    "Mohawk",
    "Frumpy Hair",
    "Wild Hair",
    "Messy Hair",
    "Stringy Hair",
    "Bandana",
  ],

  eyes: [
    "Welding Goggles",
    "Purple Eye Shadow",
    "Blue Eye Shadow",
    "Green Eye Shadow",
    "3D Glasses",
    "Eye Mask",
    "VR",
    "Small Shades",
    "Clown Eyes Green",
    "Clown Eyes Blue",
    "Eye Patch",
    "Classic Shades",
    "Regular Shades",
    "Big Shades",
    "Horned Rim Glasses",
    "Nerd Glasses",
  ],
  beard: [
    "Big Beard",
    "Front Beard Dark",
    "Handlebars",
    "Front Beard",
    "Chinstrap",
    "Luxurious Beard",
    "Mustache",
    "Normal Beard Black",
    "Normal Beard",
    "Goat",
    "Muttonchops",
    "Shadow Beard",
  ],
  mouth: ["Medical Mask", "Vape", "Pipe", "Cigarette"],
  lips: ["Black Lipstick", "Purple Lipstick", "Hot Lipstick"],
  neck: ["Choker", "Silver Chain", "Gold Chain"],
  emotion: ["Smile", "Frown"],
  face: ["Spots", "Mole"],
  ears: ["Earring"],
  nose: ["Clown Nose"],
  cheeks: ["Rosy Cheeks "],
  teeth: ["Buck Teeth"],
};

const traitMapping = {};
for (const t in traitValues) {
  traitValues[t].forEach((v) => {
    traitMapping[v] = t;
  });
}

async function main() {
  const cvsFiles = fs
    .readdirSync(path.join(__dirname, "original"))
    .filter((f) => f.endsWith(".csv"));

  let rows = [];
  for (const f of cvsFiles) {
    const file = path.join(__dirname, "original", f);
    if (!fs.statSync(file).isFile()) continue;
    const converter = csvtojson({
      trim: true,
      checkType: true,
    });

    const json = await converter.fromFile(file);
    json.forEach((r) => {
      if (typeof r.accessories === "string") {
        const attrs = r.accessories.split(/ \/ /);
        const accessories = {};
        for (a of attrs) {
          const traitType = traitMapping[a];
          accessories[traitType] = a;
        }
        r.accessories = accessories;
      }
    });
    rows = rows.concat(json);
  }

  console.log(JSON.stringify(rows, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
