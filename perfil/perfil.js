// Configuración de la API
const API_BASE = 'http://localhost:3000/api/auth';
let currentToken = null;
let currentUser = null;

// Elementos del DOM
const loadingOverlay = document.getElementById('loadingOverlay');
const notificationsModal = document.getElementById('notificationsModal');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando perfil del usuario...');
    
    // Verificar autenticación
    await checkAuthentication();
    
    // Cargar datos del perfil
    await loadUserProfile();
    
    // Configurar eventos
    setupEventListeners();
    
    // Ocultar loading
    hideLoading();
    
    console.log('✅ Perfil cargado exitosamente');
});

// Verificar autenticación
async function checkAuthentication() {
    try {
        // Buscar token en localStorage
        const savedToken = localStorage.getItem('authToken');
        
        if (!savedToken) {
            console.warn('⚠️ No se encontró token de autenticación');
            redirectToLogin();
            return;
        }
        
        currentToken = savedToken;
        console.log('🔑 Token encontrado:', currentToken.substring(0, 20) + '...');
        
        // Verificar validez del token
        const isValid = await validateToken(currentToken);
        
        if (!isValid) {
            console.error('❌ Token inválido o expirado');
            redirectToLogin();
            return;
        }
        
        console.log('✅ Token válido');
        
    } catch (error) {
        console.error('❌ Error verificando autenticación:', error);
        redirectToLogin();
    }
}

// Validar token con el servidor
async function validateToken(token) {
    try {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user || data;
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error validando token:', error);
        return false;
    }
}

// Cargar perfil del usuario
async function loadUserProfile() {
    try {
        console.log('📊 Cargando datos del perfil...');
        
        // Si ya tenemos datos del usuario de la validación, usarlos
        if (currentUser) {
            displayUserInfo(currentUser);
            return;
        }
        
        // Si no, hacer una nueva petición
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user || data;
            displayUserInfo(currentUser);
        } else {
            throw new Error('No se pudieron cargar los datos del perfil');
        }
        
    } catch (error) {
        console.error('❌ Error cargando perfil:', error);
        showMessage('Error cargando el perfil del usuario', 'error');
    }
}

// Mostrar información del usuario en la interfaz
function displayUserInfo(user) {
    console.log('👤 Mostrando información del usuario:', user);
    
    // Actualizar elementos del DOM
    const userEmail = document.getElementById('userEmail');
    const userId = document.getElementById('userId');
    const userInitials = document.getElementById('userInitials');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const lastLogin = document.getElementById('lastLogin');
    
    if (userEmail && user.email) {
        userEmail.textContent = user.email;
    }
    
    if (userId && user.id) {
        userId.textContent = user.id;
    }
    
    if (userInitials && user.email) {
        // Generar iniciales del email
        const initials = user.email.substring(0, 2).toUpperCase();
        userInitials.textContent = initials;
    }
    
    if (welcomeMessage && user.email) {
        const userName = user.name || user.email.split('@')[0];
        welcomeMessage.textContent = `${userName}, es genial tenerte de vuelta!`;
    }
    
    if (tokenDisplay && currentToken) {
        tokenDisplay.textContent = currentToken;
    }
    
    if (lastLogin) {
        const now = new Date();
        lastLogin.textContent = now.toLocaleString('es-ES');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === notificationsModal) {
            closeNotifications();
        }
    });
    
    // Manejar tecla ESC para cerrar modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNotifications();
        }
    });
}

// Mostrar/ocultar loading
function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Funciones de navegación y acciones
function redirectToLogin() {
    console.log('🔄 Redirigiendo al login...');
    // Limpiar datos locales
    localStorage.removeItem('authToken');
    currentToken = null;
    currentUser = null;
    
    // Redirigir al login (ajusta la ruta según tu estructura)
    window.location.href = 'index.html';
}

// Función de logout
function logout() {
    console.log('🚪 Cerrando sesión...');
    
    // Mostrar confirmación
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar datos locales
        localStorage.removeItem('authToken');
        currentToken = null;
        currentUser = null;
        
        // Mostrar mensaje
        showMessage('Sesión cerrada exitosamente', 'success');
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            redirectToLogin();
        }, 1500);
    }
}

// Funciones de prueba de JWT
async function testProfile() {
    console.log('🧪 Probando perfil con token actual...');
    showLoading();
    
    if (!currentToken) {
        showMessage('No hay token disponible para probar', 'error');
        hideLoading();
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
            showMessage('✅ Token válido - Autenticación exitosa', 'success');
            console.log('✅ Perfil obtenido:', data);
        } else {
            showMessage('❌ Token inválido o expirado', 'error');
            console.error('❌ Error del servidor:', data);
        }
    } catch (error) {
        showMessage('❌ Error de conexión con el servidor', 'error');
        console.error('❌ Error de red:', error);
    } finally {
        hideLoading();
    }
}

async function testRefresh() {
    console.log('🔄 Renovando token...');
    showLoading();
    
    if (!currentToken) {
        showMessage('No hay token disponible para renovar', 'error');
        hideLoading();
        return;
    }
    
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
            // Actualizar token
            currentToken = data.token;
            localStorage.setItem('authToken', currentToken);
            
            // Actualizar UI
            const tokenDisplay = document.getElementById('tokenDisplay');
            if (tokenDisplay) {
                tokenDisplay.textContent = currentToken;
            }
            
            console.log('🔑 Nuevo token:', currentToken.substring(0, 20) + '...');
            showMessage('🔄 Token renovado exitosamente', 'success');
        } else {
            showMessage('❌ No se pudo renovar el token', 'error');
            console.error('❌ Error renovando token:', data);
        }
    } catch (error) {
        showMessage('❌ Error de conexión al renovar token', 'error');
        console.error('❌ Error de red:', error);
    } finally {
        hideLoading();
    }
}

async function testInvalidToken() {
    console.log('🧪 Probando con token inválido...');
    showLoading();
    
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZha2UgVG9rZW4iLCJpYXQiOjE1MTYyMzkwMjJ9.invalid_signature';
    
    try {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${fakeToken}`,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('⚠️ Advertencia: Token inválido fue aceptado', 'warning');
        } else {
            showMessage('✅ Correcto: Token inválido fue rechazado', 'success');
            console.log('✅ El servidor rechazó correctamente el token inválido');
        }
    } catch (error) {
        showMessage('❌ Error de conexión durante la prueba', 'error');
        console.error('❌ Error de red:', error);
    } finally {
        hideLoading();
    }
}

// Función para copiar token
function copyToken() {
    if (!currentToken) {
        showMessage('No hay token para copiar', 'error');
        return;
    }
    
    navigator.clipboard.writeText(currentToken).then(() => {
        showMessage('📋 Token copiado al portapapeles', 'success');
        console.log('📋 Token copiado');
    }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = currentToken;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showMessage('📋 Token copiado al portapapeles', 'success');
    });
}

// Funciones de modal de notificaciones
function toggleNotifications() {
    if (notificationsModal.style.display === 'block') {
        closeNotifications();
    } else {
        openNotifications();
    }
}

function openNotifications() {
    notificationsModal.style.display = 'block';
    console.log('🔔 Modal de notificaciones abierto');
}

function closeNotifications() {
    notificationsModal.style.display = 'none';
    console.log('🔔 Modal de notificaciones cerrado');
}

// Funciones de navegación (placeholders)
function openSettings() {
    showMessage('⚙️ Función de configuración próximamente', 'info');
    console.log('⚙️ Navegando a configuración...');
}

function viewProjects() {
    showMessage('📁 Función de proyectos próximamente', 'info');
    console.log('📁 Navegando a proyectos...');
}

function viewReports() {
    showMessage('📈 Función de reportes próximamente', 'info');
    console.log('📈 Navegando a reportes...');
}

function viewTeam() {
    showMessage('👥 Función de equipo próximamente', 'info');
    console.log('👥 Navegando a equipo...');
}

// Función para mostrar mensajes (mejorada)
function showMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `toast-message ${type}`;
    messageElement.innerHTML = message;
    
    // Estilos del toast
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: 500;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    // Colores según el tipo
    switch (type) {
        case 'success':
            messageElement.style.background = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #c3e6cb';
            break;
        case 'error':
            messageElement.style.background = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
            break;
        case 'warning':
            messageElement.style.background = '#fff3cd';
            messageElement.style.color = '#856404';
            messageElement.style.border = '1px solid #ffeaa7';
            break;
        case 'info':
        default:
            messageElement.style.background = '#d1ecf1';
            messageElement.style.color = '#0c5460';
            messageElement.style.border = '1px solid #bee5eb';
            break;
    }
    
    // Agregar al DOM
    document.body.appendChild(messageElement);
    
    // Animar entrada
    setTimeout(() => {
        messageElement.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        messageElement.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 4000);
    
    console.log(`💬 Mensaje mostrado: ${message}`);
}

// Función de utilidad para formatear fechas
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Función para manejar errores globales
window.addEventListener('error', (event) => {
    console.error('❌ Error global capturado:', event.error);
    showMessage('Ha ocurrido un error inesperado', 'error');
});

// Función para manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesa rechazada no manejada:', event.reason);
    showMessage('Error de conexión o servidor', 'error');
});

// Exportar funciones principales para debugging
window.debugProfile = {
    currentToken: () => currentToken,
    currentUser: () => currentUser,
    testProfile,
    testRefresh,
    testInvalidToken,
    logout
};

console.log('🔧 Funciones de debug disponibles en window.debugProfile');