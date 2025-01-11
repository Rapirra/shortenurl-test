document
 .getElementById('shortenUrlForm')
 .addEventListener('submit', async function (event) {
  event.preventDefault();

  const originalUrl = document.getElementById('originalUrl').value;
  const alias = document.getElementById('alias').value;
  if (originalUrl) {
   try {
    const response = await fetch('http://127.0.0.1:8090/shorten', {
     method: 'POST',
     headers: {
      'Content-Type': 'application/json',
     },
     body: JSON.stringify({
      originalUrl: originalUrl,
      expiresAt: '2025-01-12T00:00:00.000Z',
      alias: alias ? alias : undefined,
     }),
    });

    if (response.ok) {
     const data = await response.json();
     const linkElement = document.getElementById('shortenUrl');
     linkElement.href = `http://127.0.0.1:8090/${data.shortenUrl}`;
     linkElement.textContent = `Redirect to the received ${data.shortenUrl} link`;
    } else {
     alert(response.errored.message);
    }
   } catch (error) {
    console.error('Error:', error);
    alert(error.message);
   }
  } else {
   alert('Please enter a URL');
  }
 });
