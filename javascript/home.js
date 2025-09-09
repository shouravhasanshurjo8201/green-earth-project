const allCategories = () => {
    showPlantSpinner();
    const url = "https://openapi.programming-hero.com/api/categories"
    fetch(url)
        .then(res => res.json())
        .then(data => Categories(data.categories));
        const Categories = (data) => {
        hiddenPlantSpinner();
        const Element = document.getElementById("Categories");
        Element.innerHTML = "";
        data.forEach(content => {
            const div = document.createElement("div");
            div.innerHTML = `
            <button id="${content.id}" class="btn btn-active pl-0 hover:justify-center flex justify-start bg-[#e8f7ee] hover:bg-[#0aa342] hover:text-white text-[15px] font-bold border-none w-full mb-2 active">${content.category_name}</button>
            `
            Element.appendChild(div)
        });
    }
}
const plantsByCategories = (url) => {
    fetch(url)
    .then(res => res.json())
    .then(data => Plants(data.plants));
        const Plants = (data) => {
        const element = document.getElementById("content-id");
        element.innerHTML = "";
        data.forEach(content => {
            const div = document.createElement("div");
            div.innerHTML = `
            <div id="${content.id}" class="bg-white shadow-sm hover:shadow-lg rounded-xl p-2">
                <div><img class="w-full h-[200px] rounded-xl" src="${content.image}" alt=""></div>
                <div > 
                    <div>
                        <h1 class=" name cursor-pointer my-3 name font-bold" title="Check For Details">${content.name}</h1>
                        <dialog id="modal_${content.id}" class="modal w-full"></dialog>
                        <p class="text-[12px] line-clamp-3">${content.description}</p>
                    </div>
                    <div class="flex justify-between items-center p-2">
                        <div class="bg-[#DCFCE7] p-2 text-[10px] rounded-lg">${content.category}</div>
                        <div><i class="fa-solid fa-bangladeshi-taka-sign"></i><span class="price">${content.price}</span></div>
                    </div>
                </div>
                <div>
                    <button class="btn btn-active bg-[#15803D] text-white font-bold border-none w-full rounded-xl hover:bg-[#0aa342]">Add to Cart</button>
                </div>
            </div> 
            `
            element.appendChild(div)
        });
    }
}
const allPlants = () => {
    const url = "https://openapi.programming-hero.com/api/plants"
    plantsByCategories(url);
}
const showPlantSpinner = () => {
    document.getElementById("spinner").classList.remove("hidden")
}
const hiddenPlantSpinner = () => {
    document.getElementById("spinner").classList.add("hidden")
}
let cartData = [];
const cartLoad = () => {
    const cart = document.getElementById("cart");
    cart.innerHTML = "";
    totalTaka = 0;
    cartData.forEach(data => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div id=${data.id}  class="bg-emerald-50 py-4 px-2 flex justify-between items-center rounded-xl mb-3 ">
            <div>
                <h1 class="font-bold">${data.name}</h1>
                <span><i class="fa-solid fa-bangladeshi-taka-sign"></i>${data.price}</span>
            </div>
            <div>
                <i class="fa-solid fa-xmark cartData"></i>
            </div>
        </div>
        `;
        cart.appendChild(div);
        totalTaka = totalTaka + Number(data.price)
    })
    document.getElementById("total-taka").innerText = totalTaka;
}

document.getElementById("Categories").addEventListener("click", (e) => {
    if (e.target.nodeName === "BUTTON") {
        let id = e.target.id;
        let url = `https://openapi.programming-hero.com/api/category/${id}`
        plantsByCategories(url);
        let selectors = document.querySelectorAll(".active");
        selectors.forEach(active => {
            active.style.backgroundColor = "";
            active.style.justifyContent = "";
            active.style.color = "";
        })
        e.target.style.backgroundColor = "#15803D";
        e.target.style.justifyContent = "center";
        e.target.style.color = "white";
    }
})
document.getElementById("content-id").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        let card = e.target.parentNode.parentNode;
        let name = card.querySelector(".name").innerText;
        let price = Number(card.querySelector(".price").innerText);
        let id = Date.now();
        let content = { "id": id, "name": name, "price": price };
        cartData.push(content);
        cartLoad();
        alert(name + " has been added to the card");

    }
    if(e.target.classList.contains("name")) {
        let card = e.target.parentNode.parentNode.parentNode;
        let url = `https://openapi.programming-hero.com/api/plant/${card.id}`;
        fetch(url)
            .then(res => res.json())
            .then(data => modal(data.plants));
            const modal = (data) => {

            const modal = document.getElementById(`modal_${card.id}`);
            modal.innerHTML = `
            <section class="w-8/12 md:w-5/12 m-auto rounded-xl bg-white p-8">
                <h1 class="text-2xl font-bold mb-5">${data.name}</h1>
                <div><img src="${data.image}" class="w-full h-36 md:h-80 rounded-xl" alt=""></div>
                <h1 class="my-2 mt-5"><span class="font-bold">Category : </span>${data.category}</h1>
                <h1><span class="font-bold">Price : </span><i class="fa-solid fa-bangladeshi-taka-sign"></i> ${data.price}</h1>
                <p class="my-2"><span class="font-bold">Description : </span>${data.description}</p>
                <div class="modal-action bg-white">
                    <form method="dialog">
                        <button class="btn border-1 px-5 rounded-sm">Close</button>
                    </form>
                </div>
            </section>
            `;
            modal.showModal();
            }
    }
})
document.getElementById("cart").addEventListener("click", (e) => {
    if (e.target.classList.contains("cartData")) {
        const cartItem = e.target.parentNode.parentNode;
        let id = Number(cartItem.id);
        cartData = cartData.filter(item => item.id !== id);
        cartLoad();
    }
})

allCategories();
allPlants();