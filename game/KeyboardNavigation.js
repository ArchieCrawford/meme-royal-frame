// Keyboard Navigation Manager for Menu Screens
export class KeyboardNavigation {
  constructor() {
    this.enabled = false;
    this.currentScreen = null;
    this.focusableElements = [];
    this.currentIndex = 0;
    
    this.initKeyboardListeners();
  }
  
  initKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          this.navigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.navigateDown();
          break;
        case 'Enter':
          e.preventDefault();
          this.selectCurrent();
          break;
        case 'Escape':
          e.preventDefault();
          this.handleEscape();
          break;
      }
    });
  }
  
  enableForScreen(screenId) {
    this.enabled = true;
    this.currentScreen = screenId;
    this.updateFocusableElements();
    
    // Set initial focus to first element
    if (this.focusableElements.length > 0) {
      this.currentIndex = 0;
      this.updateFocus();
    }
    
    // Show keyboard hint
    this.showHint();
  }
  
  disable() {
    this.enabled = false;
    this.clearFocus();
    this.focusableElements = [];
    this.currentIndex = 0;
    
    // Hide keyboard hint
    this.hideHint();
  }
  
  showHint() {
    const hint = document.getElementById('keyboard-hint');
    if (hint) {
      hint.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (hint.style.display === 'block') {
          hint.style.opacity = '0';
          hint.style.transition = 'opacity 1s';
          setTimeout(() => {
            hint.style.display = 'none';
            hint.style.opacity = '1';
          }, 1000);
        }
      }, 5000);
    }
  }
  
  hideHint() {
    const hint = document.getElementById('keyboard-hint');
    if (hint) {
      hint.style.display = 'none';
    }
  }
  
  updateFocusableElements() {
    const screen = document.getElementById(this.currentScreen);
    if (!screen) return;
    
    // Find all interactive elements that are visible
    const selectors = 'button:not([disabled]), input:not([disabled]), .deck-tab, .available-card:not(.disabled)';
    const elements = Array.from(screen.querySelectorAll(selectors));
    
    // Filter out hidden elements
    this.focusableElements = elements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }
  
  navigateUp() {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.focusableElements.length - 1;
    }
    
    this.updateFocus();
  }
  
  navigateDown() {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex++;
    if (this.currentIndex >= this.focusableElements.length) {
      this.currentIndex = 0;
    }
    
    this.updateFocus();
  }
  
  updateFocus() {
    // Remove focus from all elements
    this.clearFocus();
    
    if (this.focusableElements.length === 0) return;
    
    const element = this.focusableElements[this.currentIndex];
    
    // Add keyboard-focused class for visual feedback
    element.classList.add('keyboard-focused');
    
    // Scroll element into view if needed
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }
  
  clearFocus() {
    document.querySelectorAll('.keyboard-focused').forEach(el => {
      el.classList.remove('keyboard-focused');
    });
  }
  
  selectCurrent() {
    if (this.focusableElements.length === 0) return;
    
    const element = this.focusableElements[this.currentIndex];
    
    // Handle different element types
    if (element.tagName === 'BUTTON') {
      element.click();
    } else if (element.tagName === 'INPUT') {
      element.focus();
      // Disable keyboard navigation while typing
      this.enabled = false;
      
      // Re-enable when input loses focus
      element.addEventListener('blur', () => {
        this.enabled = true;
      }, { once: true });
    } else {
      // For other clickable elements
      element.click();
    }
  }
  
  handleEscape() {
    // Handle escape key to close modals/screens
    const modals = [
      'settings-modal',
      'name-modal',
      'rename-deck-modal'
    ];
    
    for (const modalId of modals) {
      const modal = document.getElementById(modalId);
      if (modal && modal.style.display !== 'none') {
        // Find cancel/close button in modal
        const cancelBtn = modal.querySelector('.menu-btn.secondary') || 
                         modal.querySelector('#close-settings-btn') ||
                         modal.querySelector('#cancel-name-btn');
        if (cancelBtn) {
          cancelBtn.click();
          return;
        }
      }
    }
    
    // If in upgrade or deck builder screen, go back
    if (this.currentScreen === 'upgrade-screen') {
      document.getElementById('back-to-menu-btn')?.click();
    } else if (this.currentScreen === 'deck-builder-screen') {
      document.getElementById('back-from-deck-btn')?.click();
    } else if (this.currentScreen === 'achievements-screen') {
      document.getElementById('back-from-achievements-btn')?.click();
    }
  }
  
  // Method to refresh focusable elements (call after dynamic content changes)
  refresh() {
    if (!this.enabled) return;
    
    const previousElement = this.focusableElements[this.currentIndex];
    this.updateFocusableElements();
    
    // Try to maintain focus on the same element or similar position
    if (previousElement) {
      const newIndex = this.focusableElements.indexOf(previousElement);
      if (newIndex !== -1) {
        this.currentIndex = newIndex;
      } else {
        // Keep current index but clamp to valid range
        this.currentIndex = Math.min(this.currentIndex, this.focusableElements.length - 1);
      }
    }
    
    this.updateFocus();
  }
}
