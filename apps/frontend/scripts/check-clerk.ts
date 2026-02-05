
try {
    const path = require.resolve('@clerk/nextjs');
    console.log('Resolved @clerk/nextjs at:', path);
} catch (e) {
    console.error('Failed to resolve @clerk/nextjs:', e.message);
}

try {
    const pathServer = require.resolve('@clerk/nextjs/server');
    console.log('Resolved @clerk/nextjs/server at:', pathServer);
} catch (e) {
    console.error('Failed to resolve @clerk/nextjs/server:', e.message);
}
