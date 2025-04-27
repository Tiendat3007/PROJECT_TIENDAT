
// Data & Storage
const appData = { categories: [], products: [] };
function loadAppData() {
  const raw = localStorage.getItem('ecomData');
  if (raw) Object.assign(appData, JSON.parse(raw));
}
function saveAppData() {
  localStorage.setItem('ecomData', JSON.stringify(appData));
}

// Filters & Paging
let filteredCategories = [];
let currentCategoryPage = 1;
const categoriesPerPage = 3;

// DOM refs
const totalCategoriesEl = document.getElementById('totalCategories');
const totalProductsEl = document.getElementById('totalProducts');
const categoriesBody = document.getElementById('categoriesTableBody');
const productsBody = document.getElementById('productsTableBody');
const paginationEl = document.getElementById('categoriesPagination');
const statusFilterEl = document.querySelector('.select_filter');
const categoryFilterEl = document.querySelector('.select_cat');
const searchInputEl = document.querySelector('.input_search');

// Render
function renderStatistics() {
  totalCategoriesEl.textContent = 'Tổng danh mục: ' + appData.categories.length;
  totalProductsEl.textContent = 'Tổng sản phẩm: ' + appData.products.length;
}
function renderCategoryTable() {
  categoriesBody.innerHTML = '';
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / categoriesPerPage) || 1;
  if (currentCategoryPage > totalPages) currentCategoryPage = totalPages;
  const start = (currentCategoryPage - 1) * categoriesPerPage;
  const pageItems = filteredCategories.slice(start, start + categoriesPerPage);
  pageItems.forEach(c => {
    categoriesBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
         <td>
      <span class="status-badge ${c.status === 'active' ? 'status-active' : 'status-inactive'}">
        <span class="dot"></span>
        ${c.status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
      </span>
    </td>

            <td>
              <span onclick="editCategoryById('${c.id}')"><button>✏️</button></span>
              <span onclick="deleteCategoryById('${c.id}')"><button>🗑️</button></span>
            </td>
          </tr>`);
  });
  renderPagination(totalPages);
}
function renderPagination(totalPages) {
  paginationEl.innerHTML = '';
  if (totalPages <= 1) return;
  if (currentCategoryPage > 1) paginationEl.insertAdjacentHTML('beforeend', `<button onclick="changeCategoryPage(${currentCategoryPage - 1})">« Prev</button>`);
  for (let i = 1; i <= totalPages; i++) paginationEl.insertAdjacentHTML('beforeend', `<button class="${i === currentCategoryPage ? 'active' : ''}" onclick="changeCategoryPage(${i})">${i}</button>`);
  if (currentCategoryPage < totalPages) paginationEl.insertAdjacentHTML('beforeend', `<button onclick="changeCategoryPage(${currentCategoryPage + 1})">Next »</button>`);
}
function changeCategoryPage(p) { currentCategoryPage = p; renderCategoryTable(); }
function renderProductTable() {
  productsBody.innerHTML = '';
  appData.products.forEach(p => {
    productsBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${p.id}</td><td>${p.name}</td><td>${p.price.toLocaleString()}₫</td>
            <td>
              <span onclick="editProductById('${p.id}')"><button>✏️</button></span>
              <span onclick="deleteProductById('${p.id}')"><button>🗑️</button></span>
            </td>
          </tr>`);
  });
}

// Filters
function applyFilters() {
  const status = statusFilterEl.value;
  const catVal = categoryFilterEl.value.toLowerCase();
  const kw = searchInputEl.value.toLowerCase();
  filteredCategories = appData.categories.filter(c =>
    (status === 'all' || c.status === status) &&
    (!catVal || c.name.toLowerCase() === catVal) &&
    (!kw || c.name.toLowerCase().includes(kw))
  );
  currentCategoryPage = 1;
  renderCategoryTable();
}
function filterCategoryList() { applyFilters(); }


// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  loadAppData();
  filteredCategories = [...appData.categories];
  applyFilters();
  renderProductTable();
  document.querySelectorAll('.menu_item').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.menu_item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      document.getElementById(tab.dataset.target).style.display = 'block';
      if (tab.dataset.target === 'stats') renderStatistics();
    };
  });
});
// Modal controls
function openCategoryForm() {
  document.getElementById('categoryIdInput').value = '';
  document.getElementById('categoryNameInput').value = '';
  document.getElementById('categoryModalTitle').textContent = 'Thêm danh mục';
  document.getElementById('categoryModal').style.display = 'flex';
}
function editCategoryById(id) {
  const cat = appData.categories.find(c => c.id === id);
  document.getElementById('categoryIdInput').value = cat.id;
  document.getElementById('categoryNameInput').value = cat.name;
  document.getElementById('categoryModalTitle').textContent = 'Sửa danh mục';
  document.getElementById('categoryModal').style.display = 'flex';
}
function saveCategory() {
  const id = document.getElementById('categoryIdInput').value;
  const name = document.getElementById('categoryNameInput').value.trim();
  if (!name) return alert('Nhập tên danh mục');
  if (id) {
    const cat = appData.categories.find(c => c.id === id); cat.name = name;
  } else {
    const newId = 'DM' + String(appData.categories.length + 1).padStart(3, '0');
    appData.categories.push({ id: newId, name, status: 'active' });
  }
  saveAppData(); closeModal('categoryModal'); applyFilters(); renderStatistics();
}
function deleteCategoryById(id) { if (confirm('Xóa danh mục?')) { appData.categories = appData.categories.filter(c => c.id !== id); saveAppData(); applyFilters(); renderStatistics(); } }

function openProductForm() {
  document.getElementById('productIdInput').value = '';
  document.getElementById('productNameInput').value = '';
  document.getElementById('categorySelect').value = '';
  document.querySelector('input[name="status"][value="active"]').checked = true;
  document.getElementById('quantityInput').value = '1';
  document.getElementById('productPriceInput').value = '';
  document.getElementById('discountInput').value = '0';
  document.getElementById('imageInput').value = '';
  document.getElementById('descriptionInput').value = '';
  document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm';
  document.getElementById('productModal').style.display = 'flex';
}
function editProductById(id) {
  const p = appData.products.find(x => x.id === id);
  if (!p) return alert('Không tìm thấy sản phẩm!');
  document.getElementById('productIdInput').value = p.id;
  document.getElementById('productNameInput').value = p.name;
  document.getElementById('categorySelect').value = p.category;
  document.querySelector(`input[name="status"][value="${p.status}"]`).checked = true;
  document.getElementById('quantityInput').value = p.quantity;
  document.getElementById('productPriceInput').value = p.price;
  document.getElementById('discountInput').value = p.discount;
  document.getElementById('imageInput').value = p.image;
  document.getElementById('descriptionInput').value = p.description;
  document.getElementById('productModalTitle').textContent = 'Sửa sản phẩm';
  document.getElementById('productModal').style.display = 'flex';
}

function saveProduct() {
  const id = document.getElementById('productIdInput').value;
  const name = document.getElementById('productNameInput').value.trim();
  const category = document.getElementById('categorySelect').value;
  const status = document.querySelector('input[name="status"]:checked').value;
  const quantity = parseInt(document.getElementById('quantityInput').value, 10) || 0;
  const price = parseInt(document.getElementById('productPriceInput').value, 10) || 0;
  const discount = parseInt(document.getElementById('discountInput').value, 10) || 0;
  const image = document.getElementById('imageInput').value.trim();
  const description = document.getElementById('descriptionInput').value.trim();

  if (!name || !price || !image) {
    alert('Vui lòng nhập đủ Tên, Giá và Ảnh sản phẩm!');
    return;
  }

  if (id) {
    // Sửa sản phẩm
    const p = appData.products.find(x => x.id === id);
    if (p) {
      p.name = name;
      p.category = category;
      p.status = status;
      p.quantity = quantity;
      p.price = price;
      p.discount = discount;
      p.image = image;
      p.description = description;
    }
  } else {
    // Thêm mới
    const newId = 'SP' + String(appData.products.length + 1).padStart(3, '0');
    appData.products.push({
      id: newId,
      name,
      category,
      status,
      quantity,
      price,
      discount,
      image,
      description
    });
  }

  saveAppData();
  closeModal('productModal');
  renderProductTable();
  renderStatistics();
}

function deleteProductById(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    appData.products = appData.products.filter(x => x.id !== id);
    saveAppData();
    renderProductTable();
    renderStatistics();
  }
}


function closeModal(mid) { document.getElementById(mid).style.display = 'none'; }
