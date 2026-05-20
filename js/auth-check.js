const API_BASE = 'http://localhost:8080';

(async function () {
  try {
    const res = await fetch(`${API_BASE}/api/me`, { credentials: 'include' });
    if (!res.ok) {
      window.location.href = 'login.html';
      return;
    }
    const data = await res.json();
    const el = document.getElementById('nav-username');
    if (el) el.textContent = data.username + '님';
  } catch (e) {
    // 백엔드 미연결 시 개발 편의용 - 프로덕션에서는 아래 주석 해제
    // window.location.href = 'login.html';
    const el = document.getElementById('nav-username');
    if (el) el.textContent = 'admin님';
  }
})();

async function logout() {
  try {
    await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' });
  } catch (e) {}
  window.location.href = 'login.html';
}
