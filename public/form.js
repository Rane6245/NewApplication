document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const userTable = document.querySelector('#userTable tbody');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const userId = document.getElementById('userId').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;

        if (userId) {
            updateUser(userId, name, email, age);
        } else {
            createUser(name, email, age);
        }

        form.reset();
    });

    function createUser(name, email, age) {
        fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, age })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadUsers();
        })
        .catch(error => console.error('Error:', error));
    }

    function loadUsers() {
        fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(data => {
            userTable.innerHTML = '';
            data.forEach(user => {
                const row = userTable.insertRow();
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.age}</td>
                    <td>
                        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', ${user.age})">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
    }

    window.editUser = function(id, name, email, age) {
        document.getElementById('userId').value = id;
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        document.getElementById('age').value = age;
    };

    function updateUser(id, name, email, age) {
        fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, age })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadUsers();
        })
        .catch(error => console.error('Error:', error));
    }

    window.deleteUser = function(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadUsers();
            })
            .catch(error => console.error('Error:', error));
        }
    };

    loadUsers();
});
