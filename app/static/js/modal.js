const Modal = (function () {


    function vaciarModal() //Completa los campos del modal con el producto pasado por parametro
    {
        const preUnitario = document.getElementById('punit');
        const preTotal = document.getElementById('total-price');
        const cantidad = document.getElementById('quantity');
        const select = document.getElementById('select-prod');

            select.value="";;
            cantidad.value=""
            preUnitario.value="";
            preTotal.innerHTML = "";

      
    }
    /**
     * Abre el modal
     **/

     
    function open($modal) {
        const editTitle = document.getElementById('edit-title');
        const preUnitario = document.getElementById('field_preUnitario');
        const select = document.getElementById('select-prod');
        const saveTitle = document.getElementById('save-title');
        const editButton = document.getElementById('edit-button');
        const saveButton = document.getElementById('save-button');
        const cantidad= document.getElementById('quantity');
        $modal.classList.add('is-active');


        vaciarModal();
        select.disabled = false;
        saveTitle.classList.remove('is-hidden');
        saveButton.classList.remove('is-hidden');
        cantidad.removeAttribute("onkeyup");
        preUnitario.classList.add('is-hidden');
        editButton.classList.add('is-hidden');
        editTitle.classList.add('is-hidden');
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


        return {
            close: close.bind(null, $modal),
            open: open.bind(null, $modal)
        }
    }

    return {
        init
    }
})();

