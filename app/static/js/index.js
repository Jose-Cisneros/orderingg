(function () {
    const $totalPrice = document.querySelector('#total-price');
    // Estado de la aplicacion
    const state = {
        products: API.getProducts(),
        selectedProduct: null,
        quantity: 0,
        order: API.getOrder()
    }
    window.onProductSelect=seleccionarProducto;
    window.cantidad=vaciarCantidad;
    const refs = {}

    /**
     * Actualiza el valor del precio total
     **/
    function updateTotalPrice() {
        const totalPrice = state.selectedProduct.price * state.quantity;
        $totalPrice.innerHTML = `Precio total: $ ${totalPrice}`;
    }

    /**
     * Dispara la actualizacion del precio total del producto
     * al cambiar el producto seleccionado
     **/
    function onProductSelect(selectedProduct) {
        state.selectedProduct = selectedProduct;
        updateTotalPrice();
    }
    function seleccionarProducto(selectedProduct) {
        state.selectedProduct = selectedProduct;
    }
    function vaciarCantidad() {
        state.quantity = 0;
    }
    /**
     * Dispara la actualizacion del precio total del producto
     * al cambiar la cantidad del producto
     **/
    function onChangeQunatity(quantity) {
        state.quantity = quantity;
        updateTotalPrice();
    }

    /**
     * Agrega un producto a una orden
     *
     **/
    function onAddProduct() {
        API.addProduct(1, state.selectedProduct, state.quantity)
            .then(function (r) {
                if (r.error) {
                    console.error(r.error);
                } else {
                    API.getOrder().then(function (data) {
                        refs.table.update(data);
                    });

                    refs.modal.close();
                }
            });
    }


    /**
     * Edita el producto de una orden
     *
     **/
    function onEditProduct() {
     
        const cantidad = document.getElementById('quantity').value;
        const idProducto = document.getElementById('select-prod').value;
        const nombre= document.getElementById('select-prod').options[idProducto].innerText;
        API.editProduct(1,idProducto, cantidad,API.getOrderProduct(1,idProducto))
            .then(function (r) {
                if (r.error) {
                    console.error(r.error);
                } else {
                    API.getOrder().then(function (data) {
                        refs.table.update(data);
                        alert(nombre+" actualizada!")
                    });

                    refs.modal.close();
                }
            });
    }

    /**
     * Inicializa la aplicacion
     **/
    function init() {
        refs.modal = Modal.init({
            el: '#modal',
            products: state.products,
            onProductSelect: onProductSelect,
            onChangeQunatity: onChangeQunatity,
            onAddProduct: onAddProduct,      
            onEditProduct: onEditProduct,        
        })
        ;
        // Inicializamos la tabla
        refs.table = Table.init({
            el: '#orders',
            data: state.order
        });
        //const $botonEditar = document.querySelector("");
    }

    init();
    window.refs = refs;
})()

