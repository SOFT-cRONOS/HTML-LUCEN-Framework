
/**
 * lucen UI Framework - Complemento para Bootstrap 5
 * Versión 1.0.0
 * 
 * Este framework proporciona componentes con estilo lucen Design (Windows 11)
 * que complementan Bootstrap 5, usando solo HTML, CSS y JS.
 */

const lucenUI = (function() {
    'use strict';
    
    // Variables globales
    let toastTimeout;
    
    // Métodos públicos
    return {
        /**
         * Inicializa todos los componentes lucen UI
         */
        init: function() {
            this.initSidebar();
            this.initTooltips();
            this.initTabs();
            this.initModals();
            this.initDropdownArrows();
            this.initCollapsibles();
        },
        
        /**
         * Inicializa el sidebar con funcionalidad de toggle
         */
        initSidebar: function() {
            const sidebar = document.getElementById('sidebar');
            const sidebarCollapseBtn = document.getElementById('sidebarCollapse');
            const container = document.querySelector('.lucen-container');
            
            sidebarCollapseBtn.addEventListener('click', () => {
              sidebar.classList.toggle('collapsed');
              container.classList.toggle('sidebar-collapsed');
            
              const icon = sidebarCollapseBtn.querySelector('i');
              icon.classList.toggle('bi-chevron-double-left');
              icon.classList.toggle('bi-chevron-double-right');
            });
        },
        
        /**
         * Inicializa los menús colapsables del sidebar con altura dinámica
         */
        initCollapsibles: function() {
            document.querySelectorAll('.lucen-nav-item > .lucen-nav-link').forEach(toggle => {
                const href = toggle.getAttribute('href');

                // Solo procesar enlaces que tengan un ID válido después del #
                if (href && href.startsWith('#') && href.length > 1) {
                    const submenuId = href;
                    const submenu = document.querySelector(submenuId);
                    const arrow = toggle.querySelector('.lucen-nav-arrow');

                    if (submenu) {
                        // Inicializar estilo en cero
                        submenu.style.height = '0px';
                        submenu.style.overflow = 'hidden';
                        submenu.style.transition = 'height 0.3s ease';

                        toggle.addEventListener('click', function(e) {
                            e.preventDefault();

                            const isOpen = submenu.classList.contains('show');

                            // Cerrar otros submenús
                            const parentNav = this.closest('.lucen-nav');
                            if (parentNav) {
                                parentNav.querySelectorAll('.lucen-nav-submenu').forEach(menu => {
                                    if (menu !== submenu) {
                                        menu.classList.remove('show');
                                        menu.style.height = '0px';
                                        const otherArrow = menu.previousElementSibling?.querySelector('.lucen-nav-arrow');
                                        if (otherArrow) otherArrow.classList.remove('rotate');
                                    }
                                });
                            }

                            if (isOpen) {
                                // Cerrar submenu
                                submenu.style.height = submenu.scrollHeight + 'px'; // Forzar a su altura actual
                                requestAnimationFrame(() => {
                                    submenu.style.height = '0px';
                                });
                                submenu.classList.remove('show');
                                if (arrow) arrow.classList.remove('rotate');
                                toggle.setAttribute('aria-expanded', 'false');
                            } else {
                                // Abrir submenu
                                submenu.classList.add('show');
                                const totalHeight = Array.from(submenu.children).reduce((acc, el) => {
                                    const style = window.getComputedStyle(el);
                                    const marginTop = parseInt(style.marginTop) || 0;
                                    const marginBottom = parseInt(style.marginBottom) || 0;
                                    return acc + el.offsetHeight + marginTop + marginBottom;
                                }, 0);
                                submenu.style.height = totalHeight + 'px';
                                if (arrow) arrow.classList.add('rotate');
                                toggle.setAttribute('aria-expanded', 'true');
                            }
                        });
                    }
                }
            });
        },

        /**
         * Inicializa los tooltips
         */
        initTooltips: function() {
            document.querySelectorAll('[data-lucen-tooltip]').forEach(el => {
                const tooltipText = el.getAttribute('data-lucen-tooltip');
                const placement = el.getAttribute('data-lucen-placement') || 'top';
        
                // Crear elemento tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'lucen-tooltip';
                tooltip.textContent = tooltipText;
        
                // Crear contenedor para posicionamiento relativo
                const tooltipContainer = document.createElement('div');
                tooltipContainer.className = 'lucen-tooltip-container';
                tooltipContainer.setAttribute('data-lucen-placement', placement);
                tooltipContainer.style.position = 'relative';
                tooltipContainer.style.display = 'inline-block';
        
                // Insertar tooltip en el contenedor
                tooltipContainer.appendChild(tooltip);
        
                // Insertar contenedor en el DOM antes del elemento original
                el.parentNode.insertBefore(tooltipContainer, el);
                // Mover el elemento original dentro del contenedor
                tooltipContainer.appendChild(el);
        
                // Ocultar tooltip inicialmente
                tooltip.classList.remove('show');
        
                // Eventos para mostrar y ocultar tooltip
                el.addEventListener('mouseenter', () => {
                    // Limpiar estilos por si acaso
                    tooltip.style.top = '';
                    tooltip.style.bottom = '';
                    tooltip.style.left = '';
                    tooltip.style.right = '';
                    tooltip.style.marginTop = '';
                    tooltip.style.marginBottom = '';
                    tooltip.style.marginLeft = '';
                    tooltip.style.marginRight = '';
        
                    // Posicionar tooltip según el placement
                    switch (placement) {
                        case 'top':
                            tooltip.style.bottom = '100%';
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translateX(-50%)';
                            tooltip.style.marginBottom = '8px';
                            break;
                        case 'bottom':
                            tooltip.style.top = '100%';
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translateX(-50%)';
                            tooltip.style.marginTop = '8px';
                            break;
                        case 'left':
                            tooltip.style.top = '50%';
                            tooltip.style.right = '100%';
                            tooltip.style.transform = 'translateY(-50%)';
                            tooltip.style.marginRight = '8px';
                            break;
                        case 'right':
                            tooltip.style.top = '50%';
                            tooltip.style.left = '100%';
                            tooltip.style.transform = 'translateY(-50%)';
                            tooltip.style.marginLeft = '8px';
                            break;
                    }
        
                    tooltip.classList.add('show');
                });
        
                el.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('show');
                });
            });
        },
        
        /**
         * Inicializa el sistema de tabs
         */
        initTabs: function() {
            document.querySelectorAll('.lucen-tabs-btn').forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    const tabsContainer = this.closest('.lucen-tabs');
                    
                    // Remover clase active de todos los botones
                    tabsContainer.querySelectorAll('.lucen-tabs-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Añadir clase active al botón clickeado
                    this.classList.add('active');
                    
                    // Ocultar todos los paneles
                    tabsContainer.querySelectorAll('.lucen-tabs-pane').forEach(pane => {
                        pane.classList.remove('active');
                    });
                    
                    // Mostrar el panel correspondiente
                    document.getElementById(tabId).classList.add('active');
                });
            });
        },
        
        /**
         * Inicializa los modales
         */
        initModals: function() {
            // Cerrar modal al hacer clic fuera del contenido (si NO es static)
            document.querySelectorAll('.lucen-modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    const isStatic = modal.getAttribute('data-bs-backdrop') === 'static';
                    if (!isStatic && e.target === modal) {
                        lucenUI.hideModal(`#${modal.id}`);
                    }
                });
            });

            // Cerrar modal con tecla ESC (si NO está deshabilitado)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const openModal = document.querySelector('.lucen-modal.show');
                    if (openModal) {
                        const keyboardDisabled = openModal.getAttribute('data-bs-keyboard') === 'false';
                        if (!keyboardDisabled) {
                            lucenUI.hideModal(`#${openModal.id}`);
                        }
                    }
                }
            });

            // Manejar los modales que usan data-bs-toggle de Bootstrap
            document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
                button.addEventListener('click', function() {
                    const modalId = this.getAttribute('data-bs-target');
                    lucenUI.showModal(modalId);
                });
            });

            // Manejar los botones de cierre de Bootstrap
            document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
                button.addEventListener('click', function() {
                    const modal = this.closest('.lucen-modal');
                    if (modal) {
                        lucenUI.hideModal(`#${modal.id}`);
                    }
                });
            });
        },

        /**
         * Muestra un modal
         * @param {string} modalId - ID del modal a mostrar (incluyendo el #)
         */
        showModal: function(modalId) {
            const modal = document.querySelector(modalId);
            if (modal) {
                // Cerrar cualquier modal abierto primero
                document.querySelectorAll('.lucen-modal.show').forEach(m => {
                    m.classList.remove('show');
                });
                
                modal.classList.add('show');
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                modal.removeAttribute('aria-hidden');
                
                // Enfocar el primer elemento interactivo
                setTimeout(() => {
                    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusable) {
                        focusable.focus();
                    }
                }, 100);
            }
        },

        /**
         * Oculta un modal
         * @param {string} modalId - ID del modal a ocultar (incluyendo el #)
         */
        hideModal: function(modalId) {
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                
                // Opcional: Reenfocar el botón que abrió el modal
                const opener = document.querySelector(`[data-bs-target="${modalId}"], [onclick*="${modalId}"]`);
                if (opener) {
                    opener.focus();
                }
            }
        },
        
        /**
         * Muestra un toast notification
         * @param {string} message - Mensaje a mostrar
         * @param {string} type - Tipo de toast (success, error, etc.)
         */
        showToast: function(message, type = '') {
            // Eliminar toast anterior si existe
            const existingToast = document.querySelector('.lucen-toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            // Crear nuevo toast
            const toast = document.createElement('div');
            toast.className = 'lucen-toast';
            // Añadir clase según el tipo
        if (type === 'success') {
          toast.classList.add('lucen-toast-success');
          toast.innerHTML = `<i class="bi bi-check-circle"></i><span>${message}</span>`;
      } else if (type === 'error') {
          toast.classList.add('lucen-toast-error');
          toast.innerHTML = `<i class="bi bi-x-circle"></i><span>${message}</span>`;
      } else {
          toast.innerHTML = `<i class="bi bi-info-circle"></i><span>${message}</span>`;
      }
      
      document.body.appendChild(toast);
      
      // Mostrar toast
      setTimeout(() => {
          toast.classList.add('show');
      }, 10);
      
      // Ocultar toast después de 5 segundos
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => {
              toast.remove();
          }, 300);
      }, 5000);
  },
  
  /**
   * Inicializa las flechas de los dropdowns
   */
  initDropdownArrows: function() {
      document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
          toggle.addEventListener('click', function() {
              const arrow = this.querySelector('.lucen-nav-arrow');
              if (arrow) {
                  arrow.classList.toggle('rotate');
              }
          });
      });
  }
};
})();

/**
* Reemplaza el codigo escrito
*/
function styeCode() {
    document.querySelectorAll('.lucen-code-block code').forEach(block => {
        // Obtener el código del atributo data-code
        const rawCode = block.getAttribute('data-code');
        // Limpiar y formatear el código (eliminar espacios iniciales comunes)
        const formattedCode = formatCode(rawCode);
        // Aplicar el resaltado de sintaxis
        const highlightedCode = hljs.highlightAuto(formattedCode).value
        // Insertar el código resaltado
        block.innerHTML = highlightedCode;
        
    });
}

/**
* Formatea el código eliminando espacios iniciales comunes
*/
 function formatCode(code) {
    if (!code) return '';
    
    // Dividir en líneas
    const lines = code.split('\n');
    
    // Encontrar el mínimo espacio inicial (ignorando líneas vacías)
    let minSpaces = Infinity;
    lines.forEach(line => {
        if (line.trim().length === 0) return;
        const leadingSpaces = line.match(/^\s*/)[0].length;
        if (leadingSpaces < minSpaces) minSpaces = leadingSpaces;
    });
    
    // Recortar espacios iniciales comunes
    return lines.map(line => line.slice(minSpaces)).join('\n');
}


// Inicializar lucen UI cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {

    lucenUI.init();
                  
            
});

// Hacer accesible lucenUI desde el objeto window
window.lucenUI = lucenUI;


