const fs = require('fs');
const path = require('path');

const imgRoot = path.join(__dirname, '../data/img');
const jsonPath = path.join(__dirname, '../data/brandCar.json');

// Stocker l'ID actuel dans un fichier séparé
const idPath = path.join(__dirname, '../data/currentId.json');

// Charger l'ID actuel
let currentId = 1;
if (fs.existsSync(idPath)) {
    currentId = JSON.parse(fs.readFileSync(idPath, 'utf-8')).currentId;
}

function generateCarData(imageName) {
    return {
        id: currentId++, // utiliser currentId puis incrémenter
        prix: Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000,
        promo: Math.floor(Math.random() * (40 - 5 + 1)) + 5,
        isLike: false,
        stock: Math.floor(Math.random() * (50 - 1 + 1)) + 1,
        isPanier: false,
        imageUrl: `/data/${imageName}`
    };
}

function updateBrandCarJson() {
    const carData = {};

    const brands = fs.readdirSync(imgRoot, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

    brands.forEach(brand => {
        const brandName = brand.name.toLowerCase();
        carData[brandName] = {};

        const brandDir = path.join(imgRoot, brand.name);
        const images = fs.readdirSync(brandDir);

        images.forEach(image => {
            const ext = path.extname(image).toLowerCase();
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
                const carName = path.basename(image, ext).toLowerCase();
                const fullCarName = `${brandName}_${carName}`;
                carData[brandName][fullCarName] = generateCarData(`${brand.name}/${image}`);
            }
        });
    });

    fs.writeFileSync(jsonPath, JSON.stringify(carData, null, 2));
    fs.writeFileSync(idPath, JSON.stringify({ currentId })); // sauvegarder l'ID
    console.log('✅ brandCar.json généré avec des ID uniques');
}

module.exports = updateBrandCarJson;
