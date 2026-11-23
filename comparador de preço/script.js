
/* =================================
   1. ELEMENTOS DA PÁGINA
================================= */

const searchInput = document.getElementById("product-search");
const searchButton = document.getElementById("search-button");
const results = document.getElementById("results");
const sortSelect = document.getElementById("sort-price");
const categoryList = document.getElementById("category-list");
const favoritesFilter = document.getElementById("favorites-filter");

/* =================================
   2. PRODUTOS DEMONSTRATIVOS
================================= */

const products = [
    {
        id: 1,
        name: "Mouse Logitech G203",
        category: "Periféricos",
        store: "Amazon",
        price: 89.90,
        oldPrice: 119.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=Mouse+G203",
        link: "https://www.amazon.com.br/"
    },
    {
        id: 2,
        name: "Teclado Mecânico Redragon",
        category: "Periféricos",
        store: "Mercado Livre",
        price: 189.90,
        oldPrice: 229.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=Teclado",
        link: "https://www.mercadolivre.com.br/"
    },
    {
        id: 3,
        name: "Headset HyperX Cloud Stinger",
        category: "Áudio",
        store: "KaBuM!",
        price: 249.90,
        oldPrice: 299.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=Headset",
        link: "https://www.kabum.com.br/"
    },
    {
        id: 4,
        name: "Monitor LG 24 polegadas",
        category: "Informática",
        store: "Magazine Luiza",
        price: 699.90,
        oldPrice: 799.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=Monitor",
        link: "https://www.magazineluiza.com.br/"
    },
    {
        id: 5,
        name: "Mousepad Gamer Grande",
        category: "Periféricos",
        store: "Amazon",
        price: 49.90,
        oldPrice: 69.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=Mousepad",
        link: "https://www.amazon.com.br/"
    },
    {
        id: 6,
        name: "Fone Bluetooth JBL",
        category: "Áudio",
        store: "Mercado Livre",
        price: 159.90,
        oldPrice: 199.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=Fone+JBL",
        link: "https://www.mercadolivre.com.br/"
    },
    {
        id: 7,
        name: "Cadeira de Escritório",
        category: "Casa",
        store: "Magazine Luiza",
        price: 499.90,
        oldPrice: 599.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=Cadeira",
        link: "https://www.magazineluiza.com.br/"
    },
    {
        id: 8,
        name: "SSD 480GB",
        category: "Informática",
        store: "KaBuM!",
        price: 219.90,
        oldPrice: 279.90,
        image: "https://placehold.co/400x300/f1f5f9/334155?text=SSD",
        link: "https://www.kabum.com.br/"
    }
];

/* =================================
   3. ESTADO DA APLICAÇÃO
================================= */

let selectedCategory = "Todos";
let showingFavorites = false;

let favorites = [];

try {
    favorites = JSON.parse(localStorage.getItem("precocerto-favorites")) || [];
} catch (error) {
    favorites = [];
}

/* =================================
   4. FORMATAÇÃO DE PREÇOS
================================= */

function formatPrice(price) {
    return price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* =================================
   5. ATUALIZAR INDICADORES
================================= */

function updateStats() {
    document.getElementById("total-products").textContent = products.length;

    const lowest = Math.min(...products.map(product => product.price));

    document.getElementById("lowest-price").textContent =
        formatPrice(lowest);

    document.getElementById("total-favorites").textContent =
        favorites.length;
}

/* =================================
   6. FILTRAR E ORDENAR PRODUTOS
================================= */

function getFilteredProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    let filtered = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "Todos" ||
            product.category === selectedCategory;

        const matchesFavorites =
            !showingFavorites || favorites.includes(product.id);

        return matchesName && matchesCategory && matchesFavorites;
    });

    const sortValue = sortSelect.value;

    if (sortValue === "asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === "desc") {
        filtered.sort((a, b) => b.price - a.price);
    } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
}

/* =================================
   7. EXIBIR PRODUTOS
================================= */

function displayProducts(productList) {
    results.innerHTML = "";

    document.getElementById("results-count").textContent =
        `${productList.length} ${productList.length === 1 ? "produto encontrado" : "produtos encontrados"}`;

    if (productList.length === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum produto encontrado</h3>
                <p>Tente mudar sua pesquisa ou selecionar outra categoria.</p>
            </div>
        `;
        return;
    }

    const lowestPrice = Math.min(...productList.map(product => product.price));

    productList.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        const isBestPrice = product.price === lowestPrice;

        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image-container">

                ${isBestPrice ? '<span class="best-badge">MENOR PREÇO</span>' : ""}

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                >
            </div>

            <span class="product-category">${product.category}</span>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-store">Loja: ${product.store}</p>
            </div>

            <div class="product-divider"></div>

            <div class="product-price-area">
                <span class="price-caption">Preço anunciado</span>
                <span class="product-price">${formatPrice(product.price)}</span>
                <span class="old-price">${formatPrice(product.oldPrice)}</span>
            </div>

            <div class="product-actions">
                <a
                    href="${product.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="offer-button"
                >
                    Ver oferta
                </a>

                <button
                    class="favorite-button ${isFavorite ? "active" : ""}"
                    data-favorite="${product.id}"
                    aria-label="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
                    title="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
                >
                    ${isFavorite ? "♥" : "♡"}
                </button>
            </div>
        `;

        results.appendChild(card);
    });
}

/* =================================
   8. ATUALIZAR A PÁGINA
================================= */

function renderProducts() {
    const filteredProducts = getFilteredProducts();

    displayProducts(filteredProducts);
    updateStats();
}

/* =================================
   9. PESQUISA
================================= */

function searchProducts() {
    renderProducts();
}

searchButton.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchProducts();
    }
});

searchInput.addEventListener("input", searchProducts);

/* =================================
   10. ORDENAÇÃO
================================= */

sortSelect.addEventListener("change", renderProducts);

/* =================================
   11. CATEGORIAS
================================= */

categoryList.addEventListener("click", function(event) {
    const button = event.target.closest(".category-button");

    if (!button) return;

    selectedCategory = button.dataset.category;
    showingFavorites = false;

    favoritesFilter.classList.remove("active");

    document.querySelectorAll(".category-button").forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts();
});

/* =================================
   12. FAVORITOS
================================= */

results.addEventListener("click", function(event) {
    const button = event.target.closest("[data-favorite]");

    if (!button) return;

    const productId = Number(button.dataset.favorite);

    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
    } else {
        favorites.push(productId);
    }

    try {
        localStorage.setItem(
            "precocerto-favorites",
            JSON.stringify(favorites)
        );
    } catch (error) {
        console.warn("Não foi possível salvar os favoritos.");
    }

    renderProducts();
});

favoritesFilter.addEventListener("click", function() {
    showingFavorites = !showingFavorites;

    favoritesFilter.classList.toggle("active", showingFavorites);

    document.querySelectorAll(".category-button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === "Todos" && !showingFavorites
        );
    });

    selectedCategory = "Todos";

    renderProducts();
});

/* =================================
   13. INICIALIZAÇÃO
================================= */

renderProducts();
