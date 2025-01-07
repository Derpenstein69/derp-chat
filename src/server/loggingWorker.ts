addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST') {
    const logData = await request.json();
    const logEntry = createLogEntry(logData);
    await storeLogEntry(logEntry);
    return new Response('Log entry stored', { status: 200 });
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}

function createLogEntry(data) {
  return {
    timestamp: new Date().toISOString(),
    level: data.level || 'info',
    message: data.message || '',
    context: data.context || {},
    error: data.error || null,
  };
}

async function storeLogEntry(entry) {
  const key = `log:${entry.timestamp}`;
  await LOGS.put(key, JSON.stringify(entry));
}
