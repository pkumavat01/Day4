export default async function decorate(block) {
  const anchor = block.querySelector('a');

  if (!anchor) {
    console.error('No <a> tag with JSON link found inside the block.');
    return;
  }
  anchor.classList.add('hidden-link');
  const jsonUrl = anchor.href;
  const resp = await fetch(jsonUrl);
  const json = await resp.json();
  const columns = json.columns;
  const rows = json.data;

  const rowsPerPage = 5;
  let currentPage = 1;

  // Create table elements
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Build table head
  const headerRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  table.appendChild(tbody);

  // Pagination buttons container
  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = true;

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = rows.length <= rowsPerPage;

  pagination.appendChild(prevBtn);
  pagination.appendChild(nextBtn);

  block.appendChild(table);
  block.appendChild(pagination);

  // Function to render a page
  function renderPage(page) {
    tbody.innerHTML = ''; // Clear current rows
    const start = (page - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, rows.length);
    for (let i = start; i < end; i++) {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = rows[i][col];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
    // Update buttons state
    prevBtn.disabled = page === 1;
    nextBtn.disabled = end >= rows.length;
  }

  // Button event listeners
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if ((currentPage * rowsPerPage) < rows.length) {
      currentPage++;
      renderPage(currentPage);
    }
  });

  // Initial render
  renderPage(currentPage);
}
