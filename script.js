document.addEventListener('DOMContentLoaded', () => {
    // Global variables to store the selected values
    let selectedCityValue = 'sehir'; // Default to a neutral value
    let selectedBrandValue = 'marka'; // Default to a neutral value

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

        // Function to update global state and display
        function updateSelection(text, value) {
            if (dataAttributeName === 'sehir-deger') {
                selectedCityValue = value;
                if (selectedDisplay) {
                    selectedDisplay.textContent = text;
                }
            } else if (dataAttributeName === 'marka-deger') {
                selectedBrandValue = value;
                // Note: Brand uses a different display mechanism, handled in setupBrandLightbox
            }
            console.log(`Selected ${dataAttributeName} Value:`, value);
        }

        // --- 1. Lightbox Open/Close Handlers ---
        if (pickerButton) {
            pickerButton.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                searchInput.value = '';
                filterList(''); // Reset the list display
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
                    const selectedValue = e.target.getAttribute(dataAttributeName);

                    // Update the display text and global state
                    updateSelection(selectedText, selectedValue);

                    // Close the lightbox
                    lightbox.style.display = 'none';
                }
            });
        }

        // --- 3. Search Bar Filter Handler & Function ---
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

        // Expose the filterList for external use (like pre-selection)
        return {
            updateSelection,
            listItems
        };
    }


    // --- CITY GEOLOCATION AND PRE-SELECTION LOGIC ---

    // Function to handle the initial city detection and selection
    async function detectAndPreSelectCity(cityUtils) {
        try {
            // Use a free IP geolocation API
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            // The API returns the city name in the 'city' field
            const detectedCity = data.city ? data.city.toLowerCase() : null;

            if (detectedCity) {
                // Find the city in the list and select it
                for (const item of cityUtils.listItems) {
                    const itemText = item.textContent.toLowerCase();
                    
                    // Simple check for city inclusion (e.g., 'istanbul' includes 'istanbul')
                    if (itemText === detectedCity || detectedCity.includes(itemText)) {
                        const selectedText = item.textContent;
                        const selectedValue = item.getAttribute('sehir-deger');
                        
                        // Update the display and global state
                        cityUtils.updateSelection(selectedText, selectedValue);
                        
                        console.log(`Auto-detected and selected City: ${selectedText}`);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('City detection failed, falling back to default:', error);
            // Fallback: Keep the default 'Şehir' text
        }
    }


    // --- Setup City Picker ---
    const cityPickerUtils = setupLightbox(
        'city-picker-button',
        'city-lightbox',
        'close-lightbox',
        'city-search',
        'city-list',
        'selected-city-display',
        'sehir-deger'
    );
    
    // Call the pre-selection logic after setup
    detectAndPreSelectCity(cityPickerUtils);

    // --- Setup Brand Picker (Slightly Modified for Logo Grid Selection) ---
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

        // Find the element holding the display text (the <p> of the table row)
        // NOTE: This function is not used since the Brand selection uses the logo grid in index.html
        // We only use this function's structure to capture the selection and update the global state.
        
        // --- 1. Lightbox Open/Close Handlers (KEEP these, though not used in HTML for Brand) ---
        // Brand selection is now handled by the logo grid click listener in index.html
    }

    // Since the brand selection in the HTML is done via a grid of images,
    // we need to update the global `selectedBrandValue` in the existing logo click logic in `index.html`.
    
    // --- Brand Logo Grid Selection Logic (Added to handle Brand state) ---
    // NOTE: This is redundant if you keep the script block in index.html, 
    // but essential if you want all logic in script.js
    const logoItems = document.querySelectorAll('.logo-item');
            
    logoItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove 'selected' class from all other items
            logoItems.forEach(i => {
                if (i !== this) {
                    i.classList.remove('selected');
                }
            });
            
            // Toggle 'selected' class
            this.classList.toggle('selected');
            
            // Update the global state
            if (this.classList.contains('selected')) {
                selectedBrandValue = this.getAttribute('data-brand').toLowerCase();
                console.log('Selected Brand:', selectedBrandValue);
            } else {
                selectedBrandValue = 'marka'; // Deselected
                console.log('Selected Brand: None (Deselected)');
            }
        });
    });


    // --- Kombi Servislerini Listele Button Handler ---
    // *** FIX: Changed selector to use the new explicit ID on the button. ***
    const listServicesButton = document.getElementById('list-services-button'); 
    const serviceListDefaultBaseUrl = '#'; // Example URL

    if (listServicesButton) {
        listServicesButton.addEventListener('click', () => {
            const cityParam = selectedCityValue !== 'sehir' ? selectedCityValue : 'all';
            const brandParam = selectedBrandValue !== 'marka' ? selectedBrandValue : 'all';

            // Construct the final URL
            const finalUrl = `${serviceListDefaultBaseUrl}?sehir=${cityParam}&kombi=${brandParam}`;
            
            console.log('Navigating to:', finalUrl);
            
            // Perform the navigation
            window.location.href = finalUrl;
            
            // If you need the URL to be relative to the current host:
            // window.location.href = `/${finalUrl}`;
        });
    }
});
