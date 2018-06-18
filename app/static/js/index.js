(function () {
    const $totalPrice = document.querySelector("#total-price");
    // Estado de la aplicacion
    const state = {
        products: API.getProducts(),
        selectedProduct: null,
        quantity: 0,
        order: API.getOrder()
    };
    window.onProductSelect = seleccionarProducto;
    window.cantidad = vaciarCantidad;
    const refs = {};

    /**
     * Actualiza el valor del precio total
     **/
    function updateTotalPrice() {
        try {
            const totalPrice = state.selectedProduct.price * state.quantity;
            $totalPrice.innerHTML = "Precio total: " + totalPrice;
        } catch (e) {
            $totalPrice.innerHTML = "";
        }
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

    function onEditProduct() {
        API.editProduct(1, state.selectedProduct.id, state.quantity)
            .then(function (r) {
                API.getOrder().then(function (data) {
                    refs.table.update(data);
                });

                refs.modal.close();
            });
    }

    /**
     * Agrega un producto a una orden
     *
     **/
    function onAddProduct() {
        return API.addProduct(1, state.selectedProduct, state.quantity)
            .then(function (r) {
                if (r.error) {
                    return Promise.reject({
                        msg: "No puede existir 2 productos iguales en una orden"
                    });
                }

                API.getOrder().then(function (data) {
                    refs.table.update(data);
                });

                refs.modal.close();
            })
            .catch(function (err) {
                if (err.msg) {
                    return Promise.reject(err);
                }
                return Promise.reject({
                    msg: "Seleccione un producto"
                });
            });
    }

    function onDeleteProduct(productId) {


        const nombre= document.getElementById("select-prod").options[productId].innerText;

        API.deleteProduct(1, productId)
            .then(function (r) {
                if (r.error) {
                    console.error(r.error);
                } else {
                    API.getOrder().then(function (data) {
                        refs.table.update(data);
                        alert("El producto" + nombre + " ha sido actualizado!")
                    });
                }
            });
    }

    function onDeleteProduct() {
     
        const idProducto = document.getElementById("select-prod").value;
        const nombre= document.getElementById("select-prod").options[idProducto].innerText;

        API.deleteProduct(1, idProducto).then(function (r) {
            if (r.error) {
                console.error(r.error);
            } else {
                API.getOrder().then(function (data) {
                    refs.table.update(data);
                    alert("El producto" + nombre + " ha sido eliminado!");
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
            el: "#modal",
            products: state.products,
            onProductSelect: onProductSelect,
            onChangeQunatity: onChangeQunatity,
            onAddProduct: onAddProduct,
            onEditProduct: onEditProduct
        });

        // Inicializamos la tabla
        refs.table = Table.init({
            el: "#orders",
            data: state.order
        });

        refs.global = {
            onDeleteProduct
        };
    }

    init();
    window.refs = refs;
    
})();

