
const appData = { categories: [], products: [] };
function loadAppData() {
  const raw = localStorage.getItem('ecomData');
  if (raw) Object.assign(appData, JSON.parse(raw));
}
function saveAppData() {
  localStorage.setItem('ecomData', JSON.stringify(appData));
}

let filteredCategories = [];
let currentCategoryPage = 1;
const categoriesPerPage = 3;

const totalCategoriesEl = document.getElementById('totalCategories');
const totalProductsEl = document.getElementById('totalProducts');
const categoriesBody = document.getElementById('categoriesTableBody');
const productsBody = document.getElementById('productsTableBody');
const paginationEl = document.getElementById('categoriesPagination');
const statusFilterEl = document.querySelector('.select_filter');
const categoryFilterEl = document.querySelector('.select_cat');
const searchInputEl = document.querySelector('.input_search');

function renderStatistics() {
  totalCategoriesEl.textContent = 'Tổng danh mục: ' + appData.categories.length;
  totalProductsEl.textContent = 'Tổng sản phẩm: ' + appData.products.length;
}


let itemToDeleteId = null;
let itemType = '';
let itemNameToDelete = '';

// Gọi khi click nút xoá
function requestDeleteItem(id, name, type) {
  itemToDeleteId = id;
  itemType = type;
  itemNameToDelete = name;

  document.getElementById('itemName').textContent = `"${name}"`;
  // Bật modal
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'flex';
}


// Huỷ thao tác xoá
function cancelDelete() {
  itemToDeleteId = null;
  itemType = '';
  itemNameToDelete = '';
  document.getElementById('deleteModal').style.display = 'none';
}

// Xác nhận xoá
function confirmDelete() {
  handleDelete(itemType, itemToDeleteId);
  cancelDelete();
}


function handleDelete(type, id) {
  if (type === 'category') {
    const category = appData.categories.find(cat => cat.id === id);
    if (!category) {
      alert("Danh mục không tồn tại.");
      return;
    }

    const hasProducts = appData.products.some(product => product.category === category.name);
    if (hasProducts) {
      alert(`Danh mục "${category.name}" đang được sử dụng bởi sản phẩm. Không thể xóa.`);
      return;
    }

    appData.categories = appData.categories.filter(cat => cat.id !== id);
    saveAppData();
    applyFilters(); // render lại danh sách danh mục
    showToast(`xóa danh mục thành công`);

  } else if (type === 'product') {
    const product = appData.products.find(p => p.id === id);
    if (!product) {
      alert("Sản phẩm không tồn tại.");
      return;
    }

    appData.products = appData.products.filter(p => p.id !== id);
    saveAppData();
    renderProductTable();
    renderStatistics();
    showToast(`xóa sản phẩm thành công`);
  }
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
              <button onclick="requestDeleteItem('${c.id}', '${c.name}', 'category')">🗑️</button>

            </td>
          </tr>`);
  });
  renderPagination(totalPages);
}

let currentProductPage = 1;
const productsPerPage = 3;


function renderPagination(totalPages) {
  paginationEl.innerHTML = '';
  if (totalPages <= 1) return;
  if (currentCategoryPage > 1) paginationEl.insertAdjacentHTML('beforeend', `<button class="btn btn-primary" onclick="changeCategoryPage(${currentCategoryPage - 1})">« Prev</button>`);
  for (let i = 1; i <= totalPages; i++) {
    paginationEl.insertAdjacentHTML('beforeend', `<button class="btn btn-primary" class="${i === currentCategoryPage ? 'active' : ''}" onclick="changeCategoryPage(${i})">${i}</button>`);
  }
  if (currentCategoryPage < totalPages) paginationEl.insertAdjacentHTML('beforeend', `<button class="btn btn-primary" onclick="changeCategoryPage(${currentCategoryPage + 1})">Next »</button>`);
}

function changeCategoryPage(p) { currentCategoryPage = p; renderCategoryTable(); }

function renderProductTable() {
  productsBody.innerHTML = '';

  const totalItems = appData.products.length;
  const totalPages = Math.ceil(totalItems / productsPerPage) || 1;
  if (currentProductPage > totalPages) currentProductPage = totalPages;

  const start = (currentProductPage - 1) * productsPerPage;
  const pageItems = appData.products.slice(start, start + productsPerPage);

  pageItems.forEach(p => {
    productsBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price.toLocaleString()}₫</td>
            <td>${p.quantity}</td>
            <td>${p.discount}%</td>
            <td>
              <span class="status-badge ${p.status === 'active' ? 'status-active' : 'status-inactive'}">
                ${p.status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
              </span>
            </td>
            <td><img src="${p.image}" alt="${p.name}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;"></td>
            <td>
              <button onclick="editProductById('${p.id}')">✏️</button>
              <button onclick="requestDeleteItem('${p.id}', '${p.name}', 'product')">🗑️</button>


            </td>
          </tr>`);
  });

  renderProductPagination(totalPages);
}

function renderProductPagination(totalPages) {
  const paginationProductEl = document.getElementById('productsPagination');
  if (!paginationProductEl) return;
  paginationProductEl.innerHTML = '';

  if (totalPages <= 1) return;

  if (currentProductPage > 1)
    paginationProductEl.insertAdjacentHTML('beforeend', `<button class="btn btn-primary" onclick="changeProductPage(${currentProductPage - 1})">« Prev</button>`);

  for (let i = 1; i <= totalPages; i++) {
    paginationProductEl.insertAdjacentHTML('beforeend', `<button class="btn btn-primary" class="${i === currentProductPage ? 'active' : ''}" onclick="changeProductPage(${i})">${i}</button>`);
  }

  if (currentProductPage < totalPages)
    paginationProductEl.insertAdjacentHTML('beforeend', `<button class="btn btn-primary" onclick="changeProductPage(${currentProductPage + 1})">Next »</button>`);
}
function changeProductPage(p) {
  currentProductPage = p;
  renderProductTable();
}



function applyFilters() {
  const status = statusFilterEl.value;
  const catVal = categoryFilterEl.value.toLowerCase();
  const kw = searchInputEl.value.toLowerCase();
  const sortSelectEl = document.getElementById('sort_select');
  filteredCategories = appData.categories.filter(c =>
    (status === 'all' || c.status === status) &&
    (!catVal || c.name.toLowerCase() === catVal) &&
    (!kw || c.name.toLowerCase().includes(kw))
  );
  const sortType = sortSelectEl.value;
  if (sortType === 'asc') {
    filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === 'desc') {
    filteredCategories.sort((a, b) => b.name.localeCompare(a.name));
  }

  currentCategoryPage = 1;
  renderCategoryTable();
}

function filterCategoryList() { applyFilters(); }

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
      if (tab.dataset.target === 'stats')
        renderStatistics();
    };
  });
});

function openCategoryForm() {
  document.getElementById('categoryIdInput').value = '';
  document.getElementById('categoryNameInput').value = '';
  document.getElementById('categoryModalTitle').textContent = 'Thêm danh mục';
  document.getElementById('categoryModal').style.display = 'flex';
}

function editCategoryById(id) {
  const cat = appData.categories.find(c => c.id === id);
  if (!cat) return alert('Không tìm thấy danh mục!');
  document.getElementById('categoryIdInput').value = cat.id;
  document.getElementById('categoryNameInput').value = cat.name;
  document.getElementById('categoryModalTitle').textContent = 'Sửa danh mục';
  document.getElementById('categoryModal').style.display = 'flex';
}

function saveCategory() {
  const id = document.getElementById('categoryIdInput').value;
  const name = document.getElementById('categoryNameInput').value.trim();
  const status = document.querySelector('input[name="status"]:checked').value;

  if (!name) return alert('Nhập tên danh mục');

  // ✅ Kiểm tra trùng tên
  const isDuplicate = appData.categories.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== id);
  if (isDuplicate) {
    alert('Tên danh mục đã tồn tại!');
    return;
  }




  if (id) {

    const cat = appData.categories.find(c => c.id === id);
    if (cat) {
      cat.name = name;
      cat.status = status;
    }
  } else {
    const newId = 'DM' + String(appData.categories.length + 1).padStart(3, '0');
    appData.categories.push({ id: newId, name, status });
  }

  saveAppData();
  closeModal('categoryModal');
  alert("Thêm mới thành công");
  applyFilters();
}




function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}
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
  const product = appData.products.find(p => p.id === id);
  if (!product) return alert('Không tìm thấy sản phẩm!');

  const modal = document.getElementById('productModal');

  // Điền thông tin sản phẩm vào các trường trong modal
  modal.querySelector('#productIdInput').value = product.id;
  modal.querySelector('#productNameInput').value = product.name;
  modal.querySelector('#categorySelect').value = product.category;
  modal.querySelector(`input[name="status"][value="${product.status}"]`).checked = true;
  modal.querySelector('#quantityInput').value = product.quantity;
  modal.querySelector('#productPriceInput').value = product.price;
  modal.querySelector('#discountInput').value = product.discount;
  modal.querySelector('#imageInput').value = product.image;
  modal.querySelector('#descriptionInput').value = product.description;

  // Thay đổi tiêu đề modal
  modal.querySelector('#productModalTitle').textContent = 'Sửa sản phẩm';
 
  // Hiển thị modal
  modal.style.display = 'flex';
  
}



function saveProduct() {
  const modal = document.getElementById('productModal');

  const id = modal.querySelector('#productIdInput').value;
  const name = modal.querySelector('#productNameInput').value.trim();
  const category = modal.querySelector('#categorySelect').value;
  const status = modal.querySelector('input[name="status"]:checked').value;
  const quantity = parseInt(modal.querySelector('#quantityInput').value, 10) || 0;
  const price = parseInt(modal.querySelector('#productPriceInput').value, 10) || 0;
  const discount = parseInt(modal.querySelector('#discountInput').value, 10) || 0;
  const image = modal.querySelector('#imageInput').value.trim();
  const description = modal.querySelector('#descriptionInput').value.trim();

  if (!name || !price || !image) {
    alert('Vui lòng nhập đủ Tên, Giá và Ảnh sản phẩm!');
    return;
  }

  if (id) {
    // Sửa sản phẩm
    const p = appData.products.find(x => x.id === id);
    if (p) {
      Object.assign(p, { name, category, status, quantity, price, discount, image, description });
    }
  } else {
    // Thêm mới
    const newId = 'SP' + String(appData.products.length + 1).padStart(3, '0');
    appData.products.push({ id: newId, name, category, status, quantity, price, discount, image, description });
  }

  saveAppData();
  modal.style.display = 'none';
  alert("sửa sản phẩm thành công")
  renderProductTable();
  renderStatistics();
}


document.addEventListener('DOMContentLoaded', () => {
  const toast = document.querySelector('#toastContainer .toast_success');
  const closeBtn = toast.querySelector('.toast_close');

  // Bấm "×" thì ẩn toast ngay
  closeBtn.addEventListener('click', () => {
    toast.style.display = 'none';
  });

  // Hàm show toast với nội dung tuỳ ý
  window.showToast = function (message, duration = 2000) {
    // Cập nhật message
    const messageDiv = toast.querySelector('.toast_text > div');
    messageDiv.textContent = message;

    // Hiển thị toast (flex để giữ alignment)
    toast.style.display = 'flex';

    // Tự ẩn sau duration
    setTimeout(() => {
      toast.style.display = 'none';
    }, duration);
  };
});


