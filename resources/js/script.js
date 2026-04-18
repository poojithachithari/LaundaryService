document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("newsletterForm");
    const message = document.getElementById("newsletterMessage");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // stop page reload

        const name = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;

        // Simulating success message (no backend)
        try {
            // If both fields have SOME value → success
            if (name && email) {
                message.textContent = "Thank you! You have successfully subscribed.";
                message.className = "text-green-600 text-xl mt-4 text-center max-w-6xl mx-auto";
            } else {
                message.textContent = "Subscription failed. Please try again.";
                message.className = "text-red-600 text-xl mt-4 text-center max-w-6xl mx-auto";
            }
        } catch (error) {
            message.textContent = "Something went wrong. Please try later.";
            message.className = "text-red-600 text-xl mt-4 text-center max-w-6xl mx-auto";
        } 
        finally{
             document.getElementById("newsletterForm").reset();
        }
    });
});


        emailjs.init('WuqAIGdEh-oXKiqYS'); // Replace with your EmailJS public key

        let cart = [];

        // Render buttons for all services
        function renderButtons() {
            const services = document.querySelectorAll('.service-item');
            services.forEach(service => {
                const id = service.dataset.id;
                const buttonContainer = service.querySelector('.button-container');
                const isInCart = cart.some(item => item.id === id);
                
                if (isInCart) {
                    buttonContainer.innerHTML = `
                        <button onclick="removeFromCart('${id}')" class="text-red-500 bg-red-200 rounded-2xl px-5 py-2 hover:text-red-700 flex items-center space-x-2 font-medium">
                            <span>Remove Item</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                    `;
                } else {
                    buttonContainer.innerHTML = `
                        <button onclick="addToCart('${id}')" class="text-blue-500 bg-gray-100 rounded-2xl px-5 py-2 hover:text-blue-800 flex items-center space-x-2 font-medium">
                            <span>Add Item</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                    `;
                }
            });
        }

        // Update cart display
        function updateCart() {
            const emptyCart = document.getElementById('emptyCart');
            const cartList = document.getElementById('cartList');
            const cartItemsList = document.getElementById('cartItemsList');
            const totalAmount = document.getElementById('totalAmount');

            if (cart.length === 0) {
                emptyCart.classList.remove('hidden');
                cartList.classList.add('hidden');
                totalAmount.textContent = '0.00';
            } else {
                emptyCart.classList.add('hidden');
                cartList.classList.remove('hidden');
                
                cartItemsList.innerHTML = cart.map((item, index) => `
                    <div class="flex justify-between py-2 border-b border-gray-100 text-gray-700">
                        <span>${index + 1}</span>
                        <span>${item.name}</span>
                        <span>₹${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                `).join('');

                const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
                totalAmount.textContent = total.toFixed(2);
            }
        }

        // Add to cart
        function addToCart(id) {
            const service = document.querySelector(`.service-item[data-id="${id}"]`);
            const item = {
                id: service.dataset.id,
                name: service.dataset.name,
                price: service.dataset.price
            };
            cart.push(item);
            renderButtons();
            updateCart();
        }

        // Remove from cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            renderButtons();
            updateCart();
        }

        // Handle form submission
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Please add at least one service to your cart before booking.');
                return;
            }

            const fullName = document.getElementById('fullName').value;
            const emailId = document.getElementById('emailId').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const totalAmount = document.getElementById('totalAmount').textContent;

            const servicesList = cart.map((item, index) => 
                `${index + 1}. ${item.name} - ₹${parseFloat(item.price).toFixed(2)}`
            ).join('\n');

            // Email parameters (you will receive this email)
            const templateParams = {
                customer_name: fullName,
                customer_email: emailId,
                customer_phone: phoneNumber,
                services_list: servicesList,
                total_amount: totalAmount
            };

            const bookNowBtn = document.getElementById('bookNowBtn');
            bookNowBtn.textContent = 'Booking...';
            bookNowBtn.disabled = true;

            // Send email to you (business owner)
            emailjs.send('service_sd0qbzq', 'template_br43uof', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response);
                    document.getElementById('successMessage').classList.remove('hidden');
                    document.getElementById('bookingForm').reset();
                    bookNowBtn.textContent = 'Book now';
                    bookNowBtn.disabled = false;
                    
                    setTimeout(() => {
                        cart = [];
                        renderButtons();
                        updateCart();
                        document.getElementById('successMessage').classList.add('hidden');
                    }, 3000);
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Failed to send booking. Please try again.');
                    bookNowBtn.textContent = 'Book now';
                    bookNowBtn.disabled = false;
                });
        });

        // Initial render
        renderButtons();