// BEYOND THE RIFT — vanilla JavaScript interactions.

// Mobile menu: toggle visibility and keep the accessibility state in sync.
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const opened = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Set the footer year automatically.
document.getElementById('year').textContent = new Date().getFullYear();

/*
 * Image editor:
 * Each input replaces one image preview. The image data is saved in
 * localStorage so it survives a reload in the same browser.
 * RESET restores the original image URL.
 */
const imageSlots = [
  { input: 'heroUpload', image: 'heroImage', key: 'btr_hero_image', name: 'hero character' },
  { input: 'forestUpload', image: 'forestImage', key: 'btr_forest_image', name: 'forest artwork' },
  { input: 'villageUpload', image: 'villageImage', key: 'btr_village_image', name: 'village artwork' },
  { input: 'hellUpload', image: 'hellImage', key: 'btr_hell_image', name: 'hell artwork' }
];

imageSlots.forEach(slot => {
  const input = document.getElementById(slot.input);
  const image = document.getElementById(slot.image);
  const originalSource = image.getAttribute('src');

  // Restore the visitor's last selected image, if browser storage allows it.
  try {
    const saved = localStorage.getItem(slot.key);
    if (saved) image.src = saved;
  } catch (error) {
    console.warn('Could not restore saved image:', error);
  }

  // Add a reset button beside each upload control.
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'image-reset';
  reset.textContent = 'RESET';
  reset.setAttribute('aria-label', `Reset ${slot.name}`);
  input.insertAdjacentElement('afterend', reset);

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result;
      try {
        localStorage.setItem(slot.key, reader.result);
      } catch (error) {
        alert('This image may be too large for browser storage. Try a smaller image.');
      }
    };
    reader.readAsDataURL(file);
  });

  reset.addEventListener('click', () => {
    image.src = originalSource;
    input.value = '';
    try { localStorage.removeItem(slot.key); } catch (error) {
      console.warn('Could not clear saved image:', error);
    }
  });
});
