
// Dữ liệu & lưu trữ
const appData = { categories: [], products: [] };
function loadAppData() {
  const raw = localStorage.getItem('ecomData');
  if (raw) Object.assign(appData, JSON.parse(raw));
}
function saveAppData() {
  localStorage.setItem('ecomData', JSON.stringify(appData));
}

// Danh sách đã lọc và phân trang
let filteredCategories = [];
let currentCategoryPage = 1;
const categoriesPerPage = 3;

// DOM Elements
const totalCategoriesEl = document.getElementById('totalCategories');
const totalProductsEl   = document.getElementById('totalProducts');
const categoriesBody    = document.getElementById('categoriesTableBody');
const productsBody      = document.getElementById('productsTableBody');
const paginationEl      = document.getElementById('categoriesPagination');
const statusFilterEl    = document.querySelector('.select_filter');
const categoryFilterEl  = document.querySelector('.select_cat');
const searchInputEl     = document.querySelector('.input_search');

// Render thống kê
function renderStatistics() {
  totalCategoriesEl.textContent = 'Tổng danh mục: ' + appData.categories.length;
  totalProductsEl.textContent   = 'Tổng sản phẩm: ' + appData.products.length;
}

// Render bảng danh mục
function renderCategoryTable() {
  categoriesBody.innerHTML = '';
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / categoriesPerPage) || 1;
  if (currentCategoryPage > totalPages) currentCategoryPage = totalPages;
  const startIndex = (currentCategoryPage - 1) * categoriesPerPage;
  const pageItems = filteredCategories.slice(startIndex, startIndex + categoriesPerPage);
  pageItems.forEach(item => {
    categoriesBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</td>
        <td>
          <span onclick="editCategoryById('${item.id}')">✏️</span>
          <span onclick="deleteCategoryById('${item.id}')">🗑️</span>
        </td>
      </tr>`);
  });
  renderCategoryPaginationControls(totalPages);
}

// Render phân trang
function renderCategoryPaginationControls(totalPages) {
  paginationEl.innerHTML = '';
  if (totalPages <= 1) return;
  if (currentCategoryPage > 1) {
    paginationEl.insertAdjacentHTML('beforeend', `<button class="prev" onclick="changeCategoryPage(${currentCategoryPage - 1})">« Prev</button>`);
  }
  for (let i = 1; i <= totalPages; i++) {
    paginationEl.insertAdjacentHTML('beforeend', `<button class="${i === currentCategoryPage ? 'active' : ''}" onclick="changeCategoryPage(${i})">${i}</button>`);
  }
  if (currentCategoryPage < totalPages) {
    paginationEl.insertAdjacentHTML('beforeend', `<button class="next" onclick="changeCategoryPage(${currentCategoryPage + 1})">Next »</button>`);
  }
}

function changeCategoryPage(page) {
  currentCategoryPage = page;
  renderCategoryTable();
}

// Render bảng sản phẩm
function renderProductTable() {
  productsBody.innerHTML = '';
  appData.products.forEach(p => {
    productsBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price.toLocaleString()}₫</td>
        <td>
          <span onclick="editProductById('${p.id}')">✏️</span>
          <span onclick="deleteProductById('${p.id}')">🗑️</span>
        </td>
      </tr>`);
  });
}

// Chỉnh sửa & xóa danh mục
function editCategoryById(id) {
  const cat = appData.categories.find(c => c.id === id);
  const newName = prompt('Sửa tên danh mục:', cat.name);
  if (newName) {
    cat.name = newName;
    saveAppData(); applyFilters(); renderStatistics();
  }
}
function deleteCategoryById(id) {
  if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
    appData.categories = appData.categories.filter(c => c.id !== id);
    saveAppData(); applyFilters(); renderStatistics();
  }
}

// Chỉnh sửa & xóa sản phẩm
function editProductById(id) {
  const prod = appData.products.find(p => p.id === id);
  const newName = prompt('Sửa tên sản phẩm:', prod.name);
  const newPrice = parseInt(prompt('Sửa giá sản phẩm:', prod.price), 10);
  if (newName && !isNaN(newPrice)) {
    prod.name = newName;
    prod.price = newPrice;
    saveAppData(); renderProductTable(); renderStatistics();
  }
}
function deleteProductById(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    appData.products = appData.products.filter(p => p.id !== id);
    saveAppData(); renderProductTable(); renderStatistics();
  }
}

// Lọc và reset phân trang
function applyFilters() {
  const status = statusFilterEl.value;
  const catValue = categoryFilterEl.value.toLowerCase();
  const kw = searchInputEl.value.toLowerCase();
  filteredCategories = appData.categories.filter(c =>
    (status === 'all' || c.status === status) &&
    (!catValue || c.name.toLowerCase() === catValue) &&
    (!kw || c.name.toLowerCase().includes(kw))
  );
  currentCategoryPage = 1;
  renderCategoryTable();
}
function filterCategoryList() {
  applyFilters();
}

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
  loadAppData();
  filteredCategories = [...appData.categories];
  renderStatistics();
  renderCategoryTable();
  renderProductTable();

  document.getElementById('addCategoryButton').onclick = () => {
    const name = prompt('Tên danh mục mới:');
    if (name) {
      const id = 'MA' + String(appData.categories.length + 1).padStart(3, '0');
      appData.categories.push({ id, name, status: 'active' });
      saveAppData(); applyFilters(); renderStatistics();
    }
  };

  document.getElementById('addProductButton').onclick = () => {
    const name = prompt('Tên sản phẩm:');
    const price = parseInt(prompt('Giá sản phẩm:'), 10);
    if (name && !isNaN(price)) {
      const id = 'SP' + String(appData.products.length + 1).padStart(3, '0');
      appData.products.push({ id, name, price });
      saveAppData(); renderProductTable(); renderStatistics();
    }
  };

  // Chuyển tab
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