const Modal = (function () {


   
    /**
     * Abre el modal
     **/

     
    function open($modal,idProducto,tipo) {
        
        const preUnitario = document.getElementById('field_preUnitario');
        
        const select = document.getElementById('select-prod');
        
        const saveTitle = document.getElementById('save-title');
        const saveButton = document.getElementById('save-button');
        const editTitle = document.getElementById('edit-title');
        const editButton = document.getElementById('edit-button');
        const deleteTitle = document.getElementById('delete-title')
        const deleteButton = document.getElementById('delete-button')
        const cantidad= document.getElementById('quantity');
        
        $modal.classList.add('is-active');

        preUnitario.classList.add('is-hidden');
        editButton.classList.add('is-hidden');
        editTitle.classList.add('is-hidden');
        saveTitle.classList.add('is-hidden');
        saveButton.classList.add('is-hidden');
        deleteTitle.classList.add('is-hidden');
        deleteButton.classList.add('is-hidden');
        select.disabled = true;
        cantidad.disabled = false;
       


        switch(tipo) {
            case "agregar":
                vaciarModal();
                select.disabled = false;
                saveTitle.classList.remove('is-hidden');
                saveButton.classList.remove('is-hidden');
                cantidad.removeAttribute("onkeyup");
                
                window.cantidad();
                break;
            case "editar":
                
                //cantidad.setAttribute("onkeyup","actualizarTotal(this.value)");
                preUnitario.classList.remove('is-hidden');
                editTitle.classList.remove('is-hidden');
                editButton.classList.remove('is-hidden');
                
                llenarModal(idProducto);
                API.getOrderProduct(1,idProducto).then(function(r){window.onProductSelect(r);});
                break;

            case "delete":
                deleteButton.classList.remove('is-hidden');
                deleteTitle.classList.remove('is-hidden');
                preUnitario.classList.remove('is-hidden');
                cantidad.disabled = true;
                llenarModal(idProducto);

                break;
            default:
                console.log("error")
        }
        
        
    
    }

    /**
     * Cierra el modal
     **/
    function close($modal) {
        $modal.classList.remove('is-active');
    }

    /**
     * Inicializa el modal de agregar producto
     **/
    function init(config) {
        const $modal = document.querySelector(config.el);

        // Inicializamos el select de productos
        Select.init({
            el: '#select',
            data: config.products,
            onSelect: config.onProductSelect
        });

        // Nos ponemos a escuchar cambios en el input de cantidad
        $modal.querySelector('#quantity')
            .addEventListener('input', function () {
                config.onChangeQunatity(this.value);
            });

        $modal.querySelector('#save-button')
            .addEventListener('click', config.onAddProduct);

        $modal.querySelector('#edit-button')
            .addEventListener('click', config.onEditProduct);

        $modal.querySelector('#delete-button')
            .addEventListener('click', config.onDeleteProduct);


        return {
            close: close.bind(null, $modal),
            open: open.bind(null, $modal),

        }
    }

    return {
        init
    }

    function vaciarModal() //Vacia los campos del modal 
    {
        const preUnitario = document.getElementById('punit');
        const preTotal = document.getElementById('total-price');
        const cantidad = document.getElementById('quantity');
        const select = document.getElementById('select-prod');

            select.value="";
            cantidad.value="";
            preUnitario.value="";
            preTotal.innerHTML = "";

      
    }

    function llenarModal(idProducto) //Completa los campos del modal con el producto pasado por parametro
    {
        const preUnitario = document.getElementById('punit');
        const preTotal = document.getElementById('total-price');
        const cantidad = document.getElementById('quantity');
        const select = document.getElementById('select-prod');
        API.getOrderProduct(1,idProducto).then(function (result)
        {
            select.value=idProducto;
            cantidad.value=result["quantity"];
            preUnitario.value=result["price"];
            preTotal.innerHTML = "Precio total: $ "+ result['totalPrice'];

        });
    }



})();

