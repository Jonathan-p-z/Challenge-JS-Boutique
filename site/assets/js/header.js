document.addEventListener('DOMContentLoaded', function() {
    const marques = {
        "1": {
            nom: "Renault",
            description: "Renault est un constructeur automobile français fondé en 1899.",
            image: "renault.png"
        },
        "2": {
            nom: "BMW",
            description: "BMW est un constructeur automobile allemand réputé pour ses voitures sportives.",
            image: "bmw.png"
        },
        "4": {
            nom: "Audi",
            description: "Audi est un constructeur automobile allemand connu pour son design et sa technologie.",
            image: "audi.png"
        }
        // Ajoute ici d'autres marques facilement
    };

    const pathMatch = window.location.pathname.match(/^\/car\/(\d+)$/);
    if (pathMatch) {
        const marqueId = pathMatch[1];
        const marque = marques[marqueId];
        if (marque) {
            if (marqueId === "4") {
                document.body.classList.add('audi-page');
            }
            const contenu = `
                <h1>Page de la marque : ${marque.nom}</h1>
                <p>ID de la marque : ${marqueId}</p>
                <p>${marque.description}</p>
                ${marque.image ? `<img src="../assets/img/marques/${marque.image}" alt="${marque.nom}" style="max-width:200px;">` : ""}
                <br>
                <button onclick="window.history.back()">Retour</button>
            `;
            const container = document.getElementById('marque-content');
            if(container){
                container.innerHTML = contenu;
            }
        } else {
            const container = document.getElementById('marque-content');
            if(container){
                container.innerHTML = `<h1>Marque inconnue</h1><button onclick="window.history.back()">Retour</button>`;
            }
        }
    }
});