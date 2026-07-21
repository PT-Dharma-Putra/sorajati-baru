/**
 * Watermarking Script
 * Adds a watermark text and logo to images.
 */

export function applyWatermark(images) {
  if (typeof images === 'string') {
      images = document.querySelectorAll(images);
  } else if (images instanceof HTMLImageElement) {
      images = [images];
  }
  
  const logoSrc = '/images/logo-sora.svg'; // Or generic logo if preferred

  images.forEach(async (img) => {
    if (img.dataset.watermarked || img.closest('.watermark-wrapper')) return;

    try {
      // Ensure image is loaded
      if (!img.complete) {
        await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
        });
      }

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      // Skip tiny images
      if (originalWidth < 100 || originalHeight < 100) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = originalWidth;
      canvas.height = originalHeight;

      // Draw original image
      ctx.drawImage(img, 0, 0, originalWidth, originalHeight);

      // --- 1. Load Logo ---
      const logo = new Image();
      logo.src = logoSrc;
      logo.crossOrigin = "Anonymous"; 

      await new Promise((resolve) => {
        logo.onload = resolve;
        logo.onerror = () => resolve();
      });

      // --- 2. Draw Centered Watermark (Logo + Text) ---
      ctx.save();
      ctx.globalAlpha = 0.6; // subtle watermark transparency for center placement
      
      const fontSize = Math.max(16, Math.floor(originalWidth * 0.045)); 
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; 
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 4;

      const text = "Sorajati Dharma Biru";
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      
      const centerY = originalHeight / 2;

      if (logo.complete && logo.naturalWidth > 0) {
        const logoWidth = originalWidth * 0.12;
        const logoHeight = (logo.naturalHeight / logo.naturalWidth) * logoWidth;
        const gap = originalWidth * 0.02;
        const totalWidth = logoWidth + gap + textWidth;
        const startX = (originalWidth - totalWidth) / 2;

        ctx.drawImage(
          logo, 
          startX, 
          centerY - (logoHeight / 2), 
          logoWidth, 
          logoHeight
        );

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, startX + logoWidth + gap, centerY);
      } else {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, originalWidth / 2, centerY);
      }
      ctx.restore();

      // Use PNG if we want to preserve transparency, otherwise JPEG for efficiency
      // Actually, let's check extension or just default to PNG for better quality if it's a content image
      const isPng = img.src.toLowerCase().split('?')[0].endsWith('.png');
      const watermarkedUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', isPng ? 1.0 : 0.9);

      // --- DOM MANIPULATION (Robust Background Image Strategy) ---
      // 1. Create wrapper (div)
      // 2. Set original img as BACKGROUND for visually clean display
      // 3. Add single <img> (Watermarked) as foreground with ultra-low opacity for SAVES
      
      const wrapper = document.createElement('div');
      wrapper.classList.add('watermark-wrapper');
      wrapper.className = img.className; 
      wrapper.style.position = 'relative';
      wrapper.style.display = window.getComputedStyle(img).display === 'block' ? 'block' : 'inline-block';
      wrapper.style.overflow = 'hidden';

      // Capture original fit and position
      const originalStyle = window.getComputedStyle(img);
      const fit = originalStyle.objectFit || 'cover';
      const position = originalStyle.objectPosition || 'center';

      // Display the clean image as background-image
      wrapper.style.backgroundImage = `url("${img.src}")`;
      wrapper.style.backgroundSize = fit === 'cover' ? 'cover' : fit === 'contain' ? 'contain' : '100% 100%';
      wrapper.style.backgroundPosition = position;
      wrapper.style.backgroundRepeat = 'no-repeat';

      // Create the ONLY downloadable image (Watermarked)
      const watermarkedImg = new Image();
      watermarkedImg.src = watermarkedUrl;
      watermarkedImg.style.display = 'block';
      watermarkedImg.style.width = '100%';
      watermarkedImg.style.height = '100%';
      watermarkedImg.style.objectFit = fit;
      watermarkedImg.style.opacity = '0.01'; // Invisible enough but detectable for "Save As"
      watermarkedImg.style.cursor = 'inherit';
      watermarkedImg.alt = img.alt;
      watermarkedImg.dataset.watermarked = "true";

      // Replace target
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(watermarkedImg);
      img.remove();

    } catch (e) {
      console.error('Error watermarking image:', e);
    }
  });
}
