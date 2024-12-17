// Fetch and display posts
const getPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    displayPosts(posts);
  };
  
  const displayPosts = (posts) => {
    const postContainer = document.getElementById('posts');
    postContainer.innerHTML = posts
      .slice(0, 10)
      .map(
        (post) => `
          <div class="post" data-id="${post.id}">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `
      )
      .join('');
  };
  
  // Add a new post
  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
  
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ title, body }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
  
    const newPost = await response.json();
    const postContainer = document.getElementById('posts');
    postContainer.innerHTML += `
      <div class="post" data-id="${newPost.id}">
        <h2>${newPost.title}</h2>
        <p>${newPost.body}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
  
    // Reset the form
    document.getElementById('postForm').reset();
  });
  
  // Edit or delete posts
  document.getElementById('posts').addEventListener('click', async (e) => {
    const postElement = e.target.closest('.post');
    const postId = postElement.dataset.id;
  
    if (e.target.classList.contains('edit-btn')) {
      // Edit post
      if (e.target.innerText === 'Edit') {
        const currentTitle = postElement.querySelector('h2').innerText;
        const currentBody = postElement.querySelector('p').innerText;
  
        // Replace title and body with input fields for editing
        postElement.querySelector('h2').innerHTML = `<input type="text" value="${currentTitle}" class="edit-title" />`;
        postElement.querySelector('p').innerHTML = `<textarea class="edit-body">${currentBody}</textarea>`;
  
        // Change Edit button to Save
        e.target.innerText = 'Save';
      } else if (e.target.innerText === 'Save') {
        // Save updated post
        const updatedTitle = postElement.querySelector('.edit-title').value;
        const updatedBody = postElement.querySelector('.edit-body').value;
  
        await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
          method: 'PUT',
          body: JSON.stringify({ title: updatedTitle, body: updatedBody }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
  
        // Update the displayed title and body
        postElement.querySelector('h2').innerText = updatedTitle;
        postElement.querySelector('p').innerText = updatedBody;
  
        // Change Save button back to Edit
        e.target.innerText = 'Edit';
      }
    } else if (e.target.classList.contains('delete-btn')) {
      // Delete post
      await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE',
      });
  
      postElement.remove();
    }
  });
  
  window.onload = getPosts;
   