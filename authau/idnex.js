
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
    const categoriesPerPage = 7;

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
      for (let i = 1; i <= totalPages; i++) {
        paginationEl.insertAdjacentHTML('beforeend', `<button class="${i === currentCategoryPage ? 'active' : ''}" onclick="changeCategoryPage(${i})">${i}</button>`);
      }
      if (currentCategoryPage < totalPages) paginationEl.insertAdjacentHTML('beforeend', `<button onclick="changeCategoryPage(${currentCategoryPage + 1})">Next »</button>`);
    }

    function changeCategoryPage(p) { currentCategoryPage = p; renderCategoryTable(); }

    function renderProductTable() {
      productsBody.innerHTML = '';
      appData.products.forEach(p => {
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
              <button onclick="deleteProductById('${p.id}')">🗑️</button>
            </td>
          </tr>`);
      });
    }

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
  const id = document.getElementById('categoryIdInput').value; // Lấy ID
  const name = document.getElementById('categoryNameInput').value.trim(); // Lấy tên và loại bỏ khoảng trắng
  const status = document.querySelector('input[name="status"]:checked').value; // Lấy trạng thái

  if (!name) return alert('Nhập tên danh mục'); // Kiểm tra tên có hợp lệ không

  if (id) {
    // Nếu có ID, cập nhật danh mục
    const cat = appData.categories.find(c => c.id === id);
    if (cat) {
      cat.name = name;
      cat.status = status; // Cập nhật trạng thái
    }
  } else {
    // Nếu không có ID, thêm danh mục mới
    const newId = 'DM' + String(appData.categories.length + 1).padStart(3, '0'); // Tạo ID mới
    appData.categories.push({ id: newId, name, status }); // Thêm danh mục mới vào danh sách
  }

  saveAppData(); // Lưu dữ liệu vào localStorage
  closeModal('categoryModal'); // Đóng modal
  alert("thêm mới thành công")
  applyFilters(); // Cập nhật bảng danh mục
}
function deleteCategoryById(id) {
  if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
    appData.categories = appData.categories.filter(c => c.id !== id);
    saveAppData();
    applyFilters(); // Cập nhật bảng danh mục
  }
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
  modal.querySelector('#productIdInput').value       = product.id;
  modal.querySelector('#productNameInput').value     = product.name;
  modal.querySelector('#categorySelect').value       = product.category;
  modal.querySelector(`input[name="status"][value="${product.status}"]`).checked = true;
  modal.querySelector('#quantityInput').value        = product.quantity;
  modal.querySelector('#productPriceInput').value    = product.price;
  modal.querySelector('#discountInput').value        = product.discount;
  modal.querySelector('#imageInput').value           = product.image;
  modal.querySelector('#descriptionInput').value     = product.description;

  // Thay đổi tiêu đề modal
  modal.querySelector('#productModalTitle').textContent = 'Sửa sản phẩm';
  
  // Hiển thị modal
  modal.style.display = 'flex';
}
function deleteProductById(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    appData.products = appData.products.filter(p => p.id !== id);
    saveAppData();         // Lưu lại sau khi xóa
    renderProductTable();  // Cập nhật lại bảng sản phẩm
    renderStatistics();    // Cập nhật lại thống kê
  }
}


function saveProduct() {
  const modal = document.getElementById('productModal');

  const id          = modal.querySelector('#productIdInput').value;
  const name        = modal.querySelector('#productNameInput').value.trim();
  const category    = modal.querySelector('#categorySelect').value;
  const status      = modal.querySelector('input[name="status"]:checked').value;
  const quantity    = parseInt(modal.querySelector('#quantityInput').value, 10) || 0;
  const price       = parseInt(modal.querySelector('#productPriceInput').value, 10) || 0;
  const discount    = parseInt(modal.querySelector('#discountInput').value, 10) || 0;
  const image       = modal.querySelector('#imageInput').value.trim();
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
  renderProductTable();
  renderStatistics();
}