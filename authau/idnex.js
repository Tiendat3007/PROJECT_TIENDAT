let itemList = [];
let itemProductsList = [];

document.addEventListener('DOMContentLoaded', () => {
  function loadData() {
    const raw = localStorage.getItem('ecomData');
    return raw ? JSON.parse(raw) : {
      categories: itemList,
      products: itemProductsList
    };
  }

  function saveData() {
    localStorage.setItem('ecomData', JSON.stringify(data));
  }

  const data = loadData();

  function editCategory(id) {
    const cat = data.categories.find(c => c.id === id);
    const newName = prompt('Sửa tên danh mục:', cat.name);
    if (newName) {
      cat.name = newName;
      saveData();
      renderCategories();
      renderStats();
    }
  }

  function deleteCategory(id) {
    if (confirm('Bạn có chắc muốn xoá danh mục này?')) {
      data.categories = data.categories.filter(c => c.id !== id);
      saveData();
      renderCategories();
      renderStats();
    }
  }

  function editProduct(id) {
    const prod = data.products.find(p => p.id === id);
    const newName = prompt('Sửa tên sản phẩm:', prod.name);
    const newPrice = parseInt(prompt('Sửa giá sản phẩm:', prod.price), 10);
    if (newName && !isNaN(newPrice)) {
      prod.name = newName;
      prod.price = newPrice;
      saveData();
      renderProducts();
      renderStats();
    }
  }

  function deleteProduct(id) {
    if (confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      data.products = data.products.filter(p => p.id !== id);
      saveData();
      renderProducts();
      renderStats();
    }
  }

  function renderStats() {
    document.getElementById('stats').innerHTML = `
      <h2>Trang Thống kê</h2>
      <p>Tổng danh mục: ${data.categories.length}</p>
      <p>Tổng sản phẩm: ${data.products.length}</p>
    `;
  }

  function renderCategories(list = data.categories) {
    const tbody = document.querySelector('#cats tbody');
    tbody.innerHTML = '';
    for (let cat of list) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td><span class="status ${cat.status}">` +
          (cat.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động') +
        `</span></td>
        <td>
          <span class="btn_edit" data-id="${cat.id}">✏️</span>
          <span class="btn_delete" data-id="${cat.id}">🗑️</span>
        </td>`;
      tbody.appendChild(tr);
    }

    document.querySelectorAll('#cats .btn_edit')
      .forEach(el => el.addEventListener('click', () => editCategory(el.dataset.id)));
    document.querySelectorAll('#cats .btn_delete')
      .forEach(el => el.addEventListener('click', () => deleteCategory(el.dataset.id)));
  }

  function renderProducts() {
    const tbody = document.querySelector('#prods tbody');
    tbody.innerHTML = '';
    for (let p of data.products) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price.toLocaleString()}₫</td>
        <td>
          <span class="btn_edit" data-id="${p.id}">✏️</span>
          <span class="btn_delete" data-id="${p.id}">🗑️</span>
        </td>`;
      tbody.appendChild(tr);
    }

    document.querySelectorAll('#prods .btn_edit')
      .forEach(el => el.addEventListener('click', () => editProduct(el.dataset.id)));
    document.querySelectorAll('#prods .btn_delete')
      .forEach(el => el.addEventListener('click', () => deleteProduct(el.dataset.id)));
  }

  const tabs = document.querySelectorAll('.menu_item');
  const contents = document.querySelectorAll('.tab-content');
  for (let tab of tabs) {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tgt = tab.dataset.target;
      contents.forEach(c => c.style.display = c.id === tgt ? 'block' : 'none');
      if (tgt === 'stats') renderStats();
      if (tgt === 'cats') renderCategories();
      if (tgt === 'prods') renderProducts();
    });
  }

  document.getElementById('addCatBtn').addEventListener('click', () => {
    const name = prompt('Tên danh mục mới:');
    if (name) {
      const id = 'MA' + String(data.categories.length + 1).padStart(3, '0');
      data.categories.push({ id, name, status: 'active' });
      saveData();
      renderCategories();
      renderStats();
    }
  });

  document.getElementById('addProdBtn').addEventListener('click', () => {
    const name = prompt('Tên sản phẩm:');
    const price = parseInt(prompt('Giá sản phẩm:'), 10);
    if (name && !isNaN(price)) {
      const id = 'SP' + String(data.products.length + 1).padStart(3, '0');
      data.products.push({ id, name, price });
      saveData();
      renderProducts();
      renderStats();
    }
  });
  renderStats();
  renderCategories();
  renderProducts();
});
function filtercategories(index) {
    const filterBox = document.querySelectorAll(".select_filter")[index];
  
    const statusValue = filterBox.querySelector(".select_filter").value;
    const categoryValue = filterBox.querySelector(".select_category").value.trim().toLowerCase();
    const keyword = filterBox.querySelector(".input_search").value.trim().toLowerCase();
  
    const filtered = data.categories.filter(cat => {
      const matchStatus = statusValue === "all" || cat.status === statusValue;
      const matchCategory = categoryValue === "" || cat.name.toLowerCase().includes(categoryValue);
      const matchKeyword = cat.name.toLowerCase().includes(keyword);
      return matchStatus && matchCategory && matchKeyword;
    });
  
    renderCategories(filtered);
  }