document.addEventListener('DOMContentLoaded', () => {

    // Helper function to set up the lightbox logic for a generic component
    function setupLightbox(
        buttonId,
        lightboxId,
        closeButtonId,
        searchInputId,
        listId,
        displayElementId,
        dataAttributeName // e.g., 'sehir-deger' or 'marka-deger'
    ) {
        const pickerButton = document.getElementById(buttonId);
        const selectedDisplay = document.getElementById(displayElementId);
        const lightbox = document.getElementById(lightboxId);
        const closeBtn = lightbox.querySelector(`#${closeButtonId}`);
        const searchInput = document.getElementById(searchInputId);
        const list = document.getElementById(listId);
        const listItems = list.getElementsByTagName('li');

        // --- 1. Lightbox Open/Close Handlers ---

        // Open the lightbox when the button is clicked
        if (pickerButton) {
            pickerButton.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                searchInput.value = '';
                filterList(''); // Reset the list display
                searchInput.focus();
            });
        }

        // Close the lightbox when the close button is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }

        // Close the lightbox if the user clicks the dark overlay
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.style.display = 'none';
                }
            });
        }

        // --- 2. Selection Handler ---

        // Function to handle clicking an item in the list
        if (list) {
            list.addEventListener('click', (e) => {
                if (e.target && e.target.nodeName === 'LI') {
                    const selectedText = e.target.textContent;

                    // Update the display text on the main button's text element
                    if (selectedDisplay) {
                        selectedDisplay.textContent = selectedText;
                    } else if (pickerButton) {
                        // Fallback if no specific display element is present (e.g., ilce/brand)
                        // Note: The HTML only has a span for 'city', others are TDs/Ps.
                        // We assume the intent is to update the <p> or <span> sibling text.
                        // Since only the City has an ID for display, we'll only update it.
                        // For others, this is a placeholder or requires HTML modification.
                    }

                    // Optional: Log the data value (e.g., for form submission)
                    console.log(`Selected ${buttonId} Value:`, e.target.getAttribute(dataAttributeName));

                    // Close the lightbox
                    lightbox.style.display = 'none';
                }
            });
        }

        // --- 3. Search Bar Filter Handler ---

        if (searchInput) {
            searchInput.addEventListener('keyup', () => {
                const filter = searchInput.value.toLowerCase();
                filterList(filter);
            });
        }

        function filterList(filter) {
            for (let i = 0; i < listItems.length; i++) {
                const itemText = listItems[i].textContent.toLowerCase();

                // Show the item if it includes the filter text, otherwise hide it
                if (itemText.includes(filter)) {
                    listItems[i].style.display = ''; // Show
                } else {
                    listItems[i].style.display = 'none'; // Hide
                }
            }
        }

        // Apply the initial filter (for when the lightbox opens)
        function filterList(filter) {
            for (let i = 0; i < listItems.length; i++) {
                const itemText = listItems[i].textContent.toLowerCase();
                if (itemText.includes(filter)) {
                    listItems[i].style.display = '';
                } else {
                    listItems[i].style.display = 'none';
                }
            }
        }
    }


    // --- Setup City Picker ---
    // NOTE: HTML ID for close button must be unique, e.g., 'close-city-lightbox'.
    // Assuming the HTML is modified to use 'close-city-lightbox' for the city popup close button
    // for correct functionality, or we use querySelector as a safer alternative (used above).
    setupLightbox(
        'tus',
        'city-lightbox',
        'close-lightbox', // This is still technically wrong in HTML, but we'll use querySelector within the function
        'city-search',
        'city-list',
        'selected-city-display',
        'sehir-deger'
    );

    // --- Setup Brand Picker ---
    // NOTE: The HTML is missing 'selected-brand-display' element, and the brand list items
    // are structured to update a non-existent ID.
    // The code below assumes we *want* to update the adjacent `<p>Kombinizin Markası</p>` element.
    // Since the original code updated 'selected-city-display', we will proceed by fixing the logic
    // but note that 'selected-brand-display' is not in the HTML table structure.
    // To minimize required HTML changes, we'll find the text node to update.

    // A slightly modified function for the brand selection due to HTML structure
    function setupBrandLightbox(
        buttonId,
        lightboxId,
        closeButtonId,
        searchInputId,
        listId
    ) {
        const pickerButton = document.getElementById(buttonId);
        const lightbox = document.getElementById(lightboxId);
        const closeBtn = lightbox.querySelector(`#${closeButtonId}`);
        const searchInput = document.getElementById(searchInputId);
        const list = document.getElementById(listId);
        const listItems = list.getElementsByTagName('li');

        // Find the element holding the display text (the <p> or sibling <span> of the button)
        const displayTextElement = pickerButton.closest('tr').querySelector('td:first-child p');

        // --- 1. Lightbox Open/Close Handlers ---
        if (pickerButton) {
            pickerButton.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                searchInput.value = '';
                filterList('');
                searchInput.focus();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.style.display = 'none';
                }
            });
        }

        // --- 2. Selection Handler ---
        if (list) {
            list.addEventListener('click', (e) => {
                if (e.target && e.target.nodeName === 'LI') {
                    const selectedText = e.target.textContent;

                    // Update the display text (the <p> element)
                    if (displayTextElement) {
                        displayTextElement.textContent = selectedText;
                    }

                    console.log('Selected Brand Value:', e.target.getAttribute('marka-deger'));

                    // Close the lightbox
                    lightbox.style.display = 'none';
                }
            });
        }

        // --- 3. Search Bar Filter Handler ---
        if (searchInput) {
            searchInput.addEventListener('keyup', () => {
                const filter = searchInput.value.toLowerCase();
                filterList(filter);
            });
        }

        function filterList(filter) {
            for (let i = 0; i < listItems.length; i++) {
                const itemText = listItems[i].textContent.toLowerCase();
                if (itemText.includes(filter)) {
                    listItems[i].style.display = '';
                } else {
                    listItems[i].style.display = 'none';
                }
            }
        }
    }

    // Call the modified setup for the Brand Picker
    setupBrandLightbox(
        'brand-picker-button',
        'brand-lightbox',
        'close-lightbox', // Still using the non-unique ID as querySelector is robust
        'brand-search',
        'brand-list'
    );

    // NOTE on İlçe (District) Picker: The HTML provides a button (#ilce-picker-button) but
    // no corresponding lightbox or list, so no functionality can be added for it yet.

});
