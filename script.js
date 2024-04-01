const PostURL = 'https://jsonplaceholder.typicode.com/posts';
const postsPerPage = 8;
let allPostsData = [];

const getpostData = async () => {
    try {
        let response = await fetch(PostURL);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        let data = await response.json();
        allPostsData = data;
        displayPostsData(data, 1);
        createPagination(data);
    } catch (error) {
        console.error(error);
    }
}

getpostData();

const displayPostsData = (jsonData, currentPage) => {
    const tableData = document.querySelector('#tableData tbody');
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = jsonData.slice(startIndex, endIndex);

    const rowsHTML = postsToShow.map((data, index) => `
        <tr>
            <td>${startIndex + index + 1}</td>
            <td>${data.userId}</td>
            <td>${data.id}</td>
            <td>${data.title}</td>
            <td>${data.body}</td>
        </tr>
    `);

    const tableHTML = rowsHTML.join('');
    tableData.innerHTML = tableHTML;
}

const createPagination = (data) => {
    const paginationContainer = document.getElementById('pagination');
    const numPages = Math.ceil(data.length / postsPerPage);

    for (let i = 1; i <= numPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', (event) => {
            displayPostsData(data, parseInt(event.target.textContent));
        });
        paginationContainer.appendChild(pageButton);
    }
}


function sortTable(columnIndex) {
    const table = document.getElementById("tableData");
    const rows = Array.from(table.getElementsByTagName("tr"));

    rows.shift(); 

    rows.sort((a, b) => {
        const aValue = a.getElementsByTagName("td")[columnIndex].textContent;
        const bValue = b.getElementsByTagName("td")[columnIndex].textContent;
        return aValue.localeCompare(bValue);
    });

    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    rows.forEach(row => {
        tbody.appendChild(row);
    });
}

function sortTable(columnIndex) {
    const table = document.getElementById("tableData");
    const rows = Array.from(table.getElementsByTagName("tr"));
    rows.shift();

    const sortIcon = document.getElementById(`sortIcon${columnIndex}`);
    if (sortIcon.classList.contains("up")) {
        sortIcon.classList.remove("up");
        sortIcon.classList.add("down");
    } else {
        sortIcon.classList.remove("down");
        sortIcon.classList.add("up");
    }

    rows.sort((a, b) => {
        const aValue = a.getElementsByTagName("td")[columnIndex].textContent;
        const bValue = b.getElementsByTagName("td")[columnIndex].textContent;
        return aValue.localeCompare(bValue);
    });

    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    rows.forEach(row => {
        tbody.appendChild(row);
    });
}
const handleSearch = () => {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const filteredData = allPostsData.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.body.toLowerCase().includes(searchTerm) ||
        post.userId.toString().includes(searchTerm) || // Convert to string for comparison
        post.id.toString().includes(searchTerm)
    );
    displayPostsData(filteredData, 1);
}


const handleColumnFilter = (columnIndex) => {
    const searchTerm = document.getElementsByClassName('column-filter')[columnIndex - 1].value.trim().toLowerCase();
    const filteredData = allPostsData.filter(post =>
        post[getColumnProperty(columnIndex)].toString().toLowerCase().includes(searchTerm)
    );
    displayPostsData(filteredData, 1);
}

const getColumnProperty = (columnIndex) => {
    switch (columnIndex) {
        case 1:
            return 'userId';
        case 2:
            return 'id';
        case 3:
            return 'title';
        case 4:
            return 'body';
        default:
            return '';
    }
}
