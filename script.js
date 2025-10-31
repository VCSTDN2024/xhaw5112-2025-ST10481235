let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
  const itemsContainer = document.querySelector('.cart-items');
  const summaryContainer = document.querySelector('.cart-summary');

  if (!itemsContainer || !summaryContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<em>Your cart is empty.</em>';
    summaryContainer.innerHTML = '';
    return;
  }

  let html = '<ul style="list-style:none; padding:0;">';
  let total = 0;

  cart.forEach((item, index) => {
    html += `<li>${item.name} - R${item.price} 
      <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button></li>`;
    total += parseFloat(item.price);
  });

  html += '</ul>';
  itemsContainer.innerHTML = html;
  summaryContainer.innerHTML = `<p><strong>Total:</strong> R${total.toFixed(2)}</p>`;
}

function addToCart(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      addToCart({ id, name, price });
      alert(`${name} added to cart!`);
    });
  });

  document.getElementById('checkoutForm')?.addEventListener('submit', e => {
    e.preventDefault();
    alert("Thank you! Payment processed.");
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
  });

  document.getElementById('searchInput')?.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.course').forEach(course => {
      const name = course.querySelector('p strong')?.textContent.toLowerCase();
      course.style.display = name.includes(query) ? 'block' : 'none';
    });
  });

  updateCartUI();
});
