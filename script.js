// funçao anonima para reduzir o uso de query.Selector()
let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


// lista as pizzas

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

// adicionar as informaçoes da pizza (imagem, nome, descriçao, preço)

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();

// buscar informaçoes no modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key; 

//  preencher as informaçoes da pizza (nome, descriçao, imagem, preço, info as pizzas) no model quando houver o click
    
    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    c('.pizzaInfo--size.selected').classList.remove('selected');
    cs('.pizzaInfo--size').forEach((size, sizeIndex) => {

//  açao para deixar o item"Grande" selecionado
        if(sizeIndex == 2){
            size.classList.add('selected');
        }
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c('.pizzaInfo--qt').innerHTML = modalQt;

// abrir o modal colocando display flex, opacidade e animaçao

    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=> {
        c('.pizzaWindowArea').style.opacity = 1;
    }, 200);
 });


    c('.pizza-area').append( pizzaItem )
});

// Eventos do modal (Criar uma funçao que ao fechar o modal e aplicar ao botao de "cancelar" e "voltar")
function closeModal(){
    // fazer animaçao a sair
    c('.pizzaWindowArea').style.opacity = 0;
     setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);

};

// fechar o modal (cancelar)
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// inserir açoes nos butoes + e -
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
    
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// açao de clique nos tamanhos das pizzas 
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

// carrinho de compras (qual pizza (add variavel modalKey), tamanho (acessar o valor do data-key), quantidade(modalQt) )

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

// verificaçoes para adicionar diferentes pizzas

    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > - 1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();

});

// menu-openner

c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
    
});
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

// Carrinho de pizza II - tornar carrinho visivel atualizado

function updateCart(){
// adicionar quantidades de pizzas no mobile carrinho 
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
//  variaveis para aplicar os valores
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){ // qual pizza (id)

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 3:
                    pizzaSizeName = 'G'
                    break;
                    
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

// adicionar açao nos botoes dos itens

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {

        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    };
};


