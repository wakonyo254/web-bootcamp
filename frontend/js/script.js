const messageDiv = document.getElementById('message');
const userSection = document.getElementById('userSection');
const userNameSpan = document.getElementById('userName');
const userEmailSpan = document.getElementById('userEmail');
const logoutButton = document.getElementById('logoutButton');

function showMessage(type, text){
    messageDiv.style.display = 'block';
    if(type == 'success'){
      messageDiv.style.color = 'green';
    } else {
      messageDiv.style.color = 'red';
    }
    messageDiv.textContent = text;
///timeout to return form to default* remove the display after 3 secs
    setTimeout( () => {
        messageDiv.style.display = 'none';
    }, 3000);
}


//registration form submit
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    //transmit data
    const response = await fetch('/telemedicine/api/users/register', {
        method: 'POST',
        headers: {
            'content-Type' : 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    //capture results
    const result = await response.json();

    if(response.satus === 201){
        showMessage('success', result.message)
    } else {
        showMessage('failed', result.message);
    }
});

//login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    //transmit data
    const response = await fetch('/telemedicine/api/users/login', {
        method: 'POST',
        headers: {
            'content-Type' : 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    //capture results
    const result = await response.json();

    if(response.satus === 200){
        showMessage('success', result.message)
        getUser();
    } else {
        showMessage('failed', result.message);
    }
});

//fetch user details
async function getUser(){
    const response =  await fetch('/telemedicine/api/users/individual', {
        method: 'GET'
    });

    if(response.status === 200){
        const result = await response.json();
        userNameSpan.textContent = result.user.name;
        userEmailSpan.textContent = result.user.email;
        userSection.style.display= 'block';
    } else {
        showMessage('failed', result.message);
    }
 }

 //edit user
 document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = docement.getElementById('editName').value;
    const email = docement.getElementById('editEmail').value;
    const password = docement.getElementById('editPassword').value;

    //transmit data
    const response = await fetch('/telemedicine/api/users/individual/edit', {
        method: 'PUT',
        headers: {
            'content-Type' : 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    //capture results
    const result = await response.json();

    if(response.satus === 200){
        showMessage('success', result.message)
        getUser();
    } else {
        showMessage('failed', result.message);
    }
});

//logout
logoutButton.addEventListener('click', async () =>{
    const response = await fetch('/telemedicine/api/users/logout', {
        method: 'GET'
    });
    
    if(response.status === 200){
        const result = response.json();
        showMessage('success', result.message);
        userSection.style.display= 'none';
    } else {
        showMessage('failed', result.message);
    }
});



