const ModalEditar = (function () {

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
        $modal.classList.add('is-active');

        select.disabled = true;
        preUnitario.classList.remove('is-hidden');
        editTitle.classList.remove('is-hidden');
        editButton.classList.remove('is-hidden');

        saveTitle.classList.add('is-hidden');
        saveButton.classList.add('is-hidden');
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

        // Nos ponemos a escuchar cambios en el input de cantidad
        $modal.querySelector('#quantity')
            .addEventListener('input', function () {
                config.onChangeQunatity(this.value)
            });

        $modal.querySelector('#edit-button')
            .addEventListener('click', config.onAddProduct);

        return {
            close: close.bind(null, $modal),
            open: open.bind(null, $modal)
        }
    }

    return {
        init
    }
})();

