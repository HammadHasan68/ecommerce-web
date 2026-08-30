const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'tttggg444';

export async function POST(req) {
    try {
        const body = await req.json();
        const { username = '', password = '' } = body || {};

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            // set a simple auth cookie
            const headers = new Headers();
            headers.set('Set-Cookie', 'admin_auth=1; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict');
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ success: true }), { status: 200, headers });
        }

        return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error('Login error:', err);
        return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
}
