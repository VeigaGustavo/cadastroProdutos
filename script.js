document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const table = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    const totalProductsSpan = document.getElementById('totalProducts');
    const priceInput = document.getElementById('productPrice');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('productImage');
    const selectFileBtn = document.querySelector('.select-file-btn');

    // Format price input to show R$ prefix
    priceInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value) / 100).toFixed(2);
            e.target.value = `R$ ${value}`;
        }
    });

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('dragover');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }

    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle file selection via button
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Handle files
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                fileInput.value = '';
            }
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('productName').value;
        const weight = document.getElementById('productWeight').value;
        const description = document.getElementById('productDescription').value;
        const price = document.getElementById('productPrice').value;
        const imageFile = document.getElementById('productImage').files[0];

        if (!imageFile) {
            alert('Por favor, selecione uma imagem para o produto.');
            return;
        }

        // Create image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create new row
            const row = table.insertRow();
            
            // Add cells with data
            row.insertCell(0).textContent = name;
            row.insertCell(1).textContent = `${weight} kg`;
            row.insertCell(2).textContent = description;
            row.insertCell(3).textContent = price;

            // Add image cell
            const imageCell = row.insertCell(4);
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'product-image';
            imageCell.appendChild(img);

            // Update product counter
            const currentTotal = parseInt(totalProductsSpan.textContent);
            totalProductsSpan.textContent = currentTotal + 1;

            // Reset form
            form.reset();
        };

        reader.readAsDataURL(imageFile);
    });
}); 