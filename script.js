const API_BASE = 'http://localhost:3000/api/auth';
        let currentToken = null;

        // Elementos del DOM
        const loginForm = document.getElementById('loginForm');
        const dashboard = document.getElementById('dashboard');
        const authForm = document.getElementById('authForm');
        const messageDiv = document.getElementById('message');

        // Función para mostrar mensajes
        function showMessage(message, type = 'error') {
            messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
        }

        // Función de login
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // ✅ LOGIN EXITOSO
                    currentToken = data.token;
                    localStorage.setItem('authToken', currentToken);

                    console.log('🔑 TOKEN JWT:', currentToken);
                    
                    // Guardar token
                    localStorage.setItem('authToken', currentToken);
                    
                    // Mostrar perfil.html
                    showMessage('Autenticación exitosa', 'success');
                    window.location.href = 'perfil.html';

                    
                } else {
                    // ❌ LOGIN FALLIDO
                    showMessage('Credenciales incorrectas. Ingrese nuevamente.', 'error');
                    currentToken = null;
                }
                
            } catch (error) {
                showMessage('Error de conexión con el servidor', 'error');
            }
        });

        // Mostrar dashboard
        function showDashboard(user, token) {
            loginForm.style.display = 'none';
            dashboard.classList.add('active');
            
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userId').textContent = user.id;
            document.getElementById('tokenDisplay').textContent = token;
        }

        // Función para probar el perfil
        async function testProfile() {
            if (!currentToken) {
                showMessage('No hay token disponible', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('Autenticación exitosa', 'success');
                } else {
                    showMessage('Credenciales incorrectas. Ingrese nuevamente.', 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        }

        // Función para renovar token
        async function testRefresh() {
            try {
                const response = await fetch(`${API_BASE}/refresh`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    currentToken = data.token;
                    localStorage.setItem('authToken', currentToken);
                    document.getElementById('tokenDisplay').textContent = currentToken;
                    console.log('🔑 TOKEN JWT:', currentToken);
                    showMessage('Autenticación exitosa', 'success');
                } else {
                    showMessage('Credenciales incorrectas. Ingrese nuevamente.', 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        }

        // Función para probar token inválido
        async function testInvalidToken() {
            const fakeToken = 'token.invalido.fake';
            
            try {
                const response = await fetch(`${API_BASE}/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${fakeToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                showMessage('Credenciales incorrectas. Ingrese nuevamente.', 'error');
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        }

        // Función de logout
        function logout() {
            currentToken = null;
            localStorage.removeItem('authToken');
            
            loginForm.style.display = 'block';
            dashboard.classList.remove('active');
            
            showMessage('Cerrando sesión', 'success');
        }

        // Verificar si hay token guardado al cargar la página
        window.addEventListener('load', () => {
            const savedToken = localStorage.getItem('authToken');
            if (savedToken) {
                currentToken = savedToken;
            }
        });