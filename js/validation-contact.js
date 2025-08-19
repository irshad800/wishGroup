$(document).ready(function(){
        $('#send_message').click(function(e){
            
            //Stop form submission & check the validation
            e.preventDefault();
            
            // Variable declaration
            var error = false;
            var name = $('#name').val();
            var email = $('#email').val();
            var phone = $('#phone').val();
            var message = $('#message').val();
            
            $('#name,#email,#phone,#message').click(function(){
                $(this).removeClass("error_input");
            });
            
            // Form field validation
            if(name.length == 0){
                var error = true;
                $('#name').addClass("error_input");
            }else{
                $('#name').removeClass("error_input");
            }
            if(email.length == 0 || email.indexOf('@') == '-1'){
                var error = true;
                $('#email').addClass("error_input");
            }else{
                $('#email').removeClass("error_input");
            }
            if(phone.length == 0){
                var error = true;
                $('#phone').addClass("error_input");
            }else{
                $('#phone').removeClass("error_input");
            }
            if(message.length == 0){
                var error = true;
                $('#message').addClass("error_input");
            }else{
                $('#message').removeClass("error_input");
            }
            
            // If there is no validation error, next to process the mail function
            if(error == false){
               // Disable submit button just after the form processed 1st time successfully.
                $('#send_message').attr({'disabled' : 'true', 'value' : 'Sending...' });
                
                /* Post Ajax function of jQuery to get all the data from the submission of the form as soon as the form sends the values to contact.php*/
                $.post("contact.php", $("#contact_form").serialize(),function(result){
                    //Check the result set from contact.php file.
                    if(result == 'sent'){
                        //If the email is sent successfully, remove the submit button
                         $('#contact_form_wrap').remove();
                        //Display the success message
                        $('#success_message').fadeIn(500);
                    }else{
                        //Display the error message
                        $('#mail_fail').fadeIn(500);
                        // Enable the submit button again
                        $('#send_message').removeAttr('disabled').attr('value', 'Send The Message');
                    }
                });
            }
        });    
    });











     document.addEventListener('DOMContentLoaded', function() {
        // Initialize the map with enhanced settings
        const map = L.map('world-map', {
            minZoom: 2,
            maxZoom: 6,
            zoomControl: false,
            tap: false,
            touchZoom: true,
            scrollWheelZoom: false,
            fadeAnimation: true,
            zoomAnimation: true
        }).setView([20, 0], 2);

        // Add ultra-dark tile layer
        const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            maxZoom: 6
        }).addTo(map);

        // Apply additional darkening filter
        darkTiles.getContainer().style.filter = 'brightness(0.5) contrast(1.3) saturate(0.7)';
        
        // Add custom overlay for colored regions
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
            maxZoom: 6
        }).addTo(map);

        // Mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Add zoom control with custom position
        L.control.zoom({
            position: isMobile ? 'bottomright' : 'topright'
        }).addTo(map);

        // Enhanced marker icon with pulse effect
        const markerIcon = L.divIcon({
            className: 'map-marker-icon pulse',
            iconSize: isMobile ? [20, 20] : [24, 24]
        });

        // Corrected locations with proper coordinates and enhanced descriptions
        const locations = [
            {
                id: "uae",
                name: "United Arab Emirates",
                coords: [23.4241, 53.8478],
                description: "<strong>Middle East Headquarters</strong><br>Our central hub for regional operations and strategic initiatives",
                zoom: 5
            },
            {
                id: "sri-lanka",
                name: "Sri Lanka",
                coords: [7.8731, 80.7718],
                description: "<strong>South Asia Operations Center</strong><br>Driving growth and innovation in the South Asian market",
                zoom: 6
            },
            {
                id: "maldives",
                name: "Maldives",
                coords: [3.2028, 73.2207],
                description: "<strong>Luxury Hospitality Division</strong><br>Managing our premium island resorts and tourism ventures",
                zoom: 7
            },
            {
                id: "malaysia",
                name: "Malaysia",
                coords: [4.2105, 101.9758],
                description: "<strong>Southeast Asia Regional Hub</strong><br>Coordinating operations across ASEAN markets",
                zoom: 5
            },
            {
                id: "ghana",
                name: "Ghana",
                coords: [7.9465, -1.0232],
                description: "<strong>West Africa Development Center</strong><br>Leading infrastructure and energy projects in the region",
                zoom: 6
            },
            {
                id: "south-africa",
                name: "South Africa",
                coords: [-30.5595, 22.9375],
                description: "<strong>African Continental Headquarters</strong><br>Overseeing pan-African operations and investments",
                zoom: 5
            },
            {
                id: "uk",
                name: "United Kingdom",
                coords: [51.5074, -0.1278],
                description: "<strong>European Corporate Office</strong><br>Managing European investments and partnerships",
                zoom: 5
            }
        ];

        // Store markers and country sections for later reference
        const markers = {};
        const countrySections = {};
        
        // Add markers with enhanced popups
        locations.forEach(location => {
            const marker = L.marker(location.coords, {
                icon: markerIcon,
                riseOnHover: true
            }).addTo(map);
            
            marker.bindPopup(location.description, {
                autoClose: false,
                closeOnClick: false,
                className: 'custom-popup',
                maxWidth: 300,
                minWidth: 200
            });
            
            if (isMobile) {
                marker.openPopup();
            }
            
            // Store marker reference
            markers[location.id] = marker;
            
            // Find corresponding country section
            countrySections[location.id] = document.getElementById(location.id);
            
            // Add click event to marker to scroll to country section
            marker.on('click', function() {
                highlightCountry(location.id);
                scrollToCountry(location.id);
            });
            
            // Add hover effect
            marker.on('mouseover', function() {
                this.openPopup();
            });
        });

        // Fit map to show all markers when loaded
        const bounds = L.latLngBounds(locations.map(loc => loc.coords));
        map.fitBounds(bounds, { padding: [50, 50] });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            map.invalidateSize();
            map.fitBounds(bounds, { padding: [50, 50] });
        });
        
        // Function to highlight a country
        function highlightCountry(countryId) {
            // Remove all highlights first
            document.querySelectorAll('.flag-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll('.country-group').forEach(section => {
                section.classList.remove('highlighted');
            });
            
            // Highlight selected country
            const flagItem = document.querySelector(`.flag-item[data-country="${countryId}"]`);
            if (flagItem) {
                flagItem.classList.add('active');
            }
            
            const countrySection = document.getElementById(countryId);
            if (countrySection) {
                countrySection.classList.add('highlighted');
                
                // Scroll to the section after a slight delay to allow highlight animation
                setTimeout(() => {
                    countrySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
        
        // Function to scroll to a country section
        function scrollToCountry(countryId) {
            const countrySection = document.getElementById(countryId);
            if (countrySection) {
                countrySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Function to zoom to a country on the map
        function zoomToCountry(countryId) {
            const location = locations.find(loc => loc.id === countryId);
            if (location) {
                map.setView(location.coords, location.zoom, {
                    animate: true,
                    duration: 1
                });
                
                // Open the marker popup
                markers[countryId].openPopup();
            }
        }
        
        // Add click event to flag items
        document.querySelectorAll('.flag-item').forEach(item => {
            item.addEventListener('click', function() {
                const countryId = this.getAttribute('data-country');
                highlightCountry(countryId);
                zoomToCountry(countryId);
            });
        });
        
        // Add click event to country headers to zoom to country on map
        document.querySelectorAll('.country-header').forEach(header => {
            header.addEventListener('click', function() {
                const countryId = this.parentElement.id;
                zoomToCountry(countryId);
            });
        });
    });