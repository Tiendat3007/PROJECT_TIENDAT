
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
            <td>${c.id}</td><td>${c.name}</td><td>${c.status}</td>
            <td>
              <span onclick="editCategoryById('${c.id}')">✏️</span>
              <span onclick="deleteCategoryById('${c.id}')">🗑️</span>
            </td>
          </tr>`);
      });
      renderPagination(totalPages);
    }
    function renderPagination(totalPages) {
      paginationEl.innerHTML = '';
      if (totalPages <= 1) return;
      if (currentCategoryPage > 1) paginationEl.insertAdjacentHTML('beforeend', `<button onclick="changeCategoryPage(${currentCategoryPage-1})">« Prev</button>`);
      for (let i=1;i<=totalPages;i++) paginationEl.insertAdjacentHTML('beforeend', `<button class="${i===currentCategoryPage?'active':''}" onclick="changeCategoryPage(${i})">${i}</button>`);
      if (currentCategoryPage < totalPages) paginationEl.insertAdjacentHTML('beforeend', `<button onclick="changeCategoryPage(${currentCategoryPage+1})">Next »</button>`);
    }
    function changeCategoryPage(p) { currentCategoryPage = p; renderCategoryTable(); }
    function renderProductTable() {
      productsBody.innerHTML = '';
      appData.products.forEach(p => {
        productsBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${p.id}</td><td>${p.name}</td><td>${p.price.toLocaleString()}₫</td>
            <td>
              <span onclick="editProductById('${p.id}')">✏️</span>
              <span onclick="deleteProductById('${p.id}')">🗑️</span>
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
        (status==='all'||c.status===status) &&
        (!catVal||c.name.toLowerCase()===catVal) &&
        (!kw||c.name.toLowerCase().includes(kw))
      );
      currentCategoryPage = 1;
      renderCategoryTable();
    }
    function filterCategoryList() { applyFilters(); }

    // Modal controls
    function openCategoryForm() {
      document.getElementById('categoryIdInput').value = '';
      document.getElementById('categoryNameInput').value = '';
      document.getElementById('categoryModalTitle').textContent = 'Thêm danh mục';
      document.getElementById('categoryModal').style.display = 'flex';
    }
    function editCategoryById(id) {
      const cat = appData.categories.find(c=>c.id===id);
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
        const cat = appData.categories.find(c=>c.id===id); cat.name = name;
      } else {
        const newId='DM'+String(appData.categories.length+1).padStart(3,'0');
        appData.categories.push({id:newId,name,status:'active'});
      }
      saveAppData(); closeModal('categoryModal'); applyFilters(); renderStatistics();
    }
    function deleteCategoryById(id) { if(confirm('Xóa danh mục?')){ appData.categories=appData.categories.filter(c=>c.id!==id); saveAppData(); applyFilters(); renderStatistics(); }}

    function openProductForm() {
      document.getElementById('productIdInput').value='';
      document.getElementById('productNameInput').value='';
      document.getElementById('productPriceInput').value='';
      document.getElementById('productModalTitle').textContent='Thêm sản phẩm';
      document.getElementById('productModal').style.display='flex';
    }
    function editProductById(id) {
      const p=appData.products.find(x=>x.id===id);
      document.getElementById('productIdInput').value=p.id;
      document.getElementById('productNameInput').value=p.name;
      document.getElementById('productPriceInput').value=p.price;
      document.getElementById('productModalTitle').textContent='Sửa sản phẩm';
      document.getElementById('productModal').style.display='flex';
    }
    function saveProduct() {
      const id=document.getElementById('productIdInput').value;
      const name=document.getElementById('productNameInput').value.trim();
      const price=parseInt(document.getElementById('productPriceInput').value,10);
      if(!name||isNaN(price)) return alert('Nhập đủ tên và giá');
      if(id){ const p=appData.products.find(x=>x.id===id); p.name=name; p.price=price; }
      else{ const newId='SP'+String(appData.products.length+1).padStart(3,'0'); appData.products.push({id:newId,name,price}); }
      saveAppData(); closeModal('productModal'); renderProductTable(); renderStatistics();
    }
    function deleteProductById(id){ if(confirm('Xóa sản phẩm?')){ appData.products=appData.products.filter(x=>x.id!==id); saveAppData(); renderProductTable(); renderStatistics(); }}

    function closeModal(mid){ document.getElementById(mid).style.display='none'; }

    // Khởi tạo
    document.addEventListener('DOMContentLoaded', ()=> {
      loadAppData();
      filteredCategories=[...appData.categories];
      applyFilters();
      renderProductTable();
      document.querySelectorAll('.menu_item').forEach(tab=>{
        tab.onclick=()=>{
          document.querySelectorAll('.menu_item').forEach(t=>t.classList.remove('active'));
          tab.classList.add('active');
          document.querySelectorAll('.tab-content').forEach(c=>c.style.display='none');
          document.getElementById(tab.dataset.target).style.display='block';
          if(tab.dataset.target==='stats') renderStatistics();
        };
      });
    });