/**
 * Canvas Personalization Engine v3.3 (Clean Typography)
 * Handles both fixed templates and free-form custom creations
 */

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

const PLACEHOLDER_BG = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1080&q=80';

const getAvatarUrl = (user) => {
  if (user?.profilePicUrl) return user.profilePicUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff&bold=true`;
};

/**
 * Renders a personalized greeting with full dynamic control
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} config - { backgroundUrl, layers, user }
 */
export const renderDynamicCanvas = async (canvas, config) => {
  if (!canvas || !config) return;

  const ctx = canvas.getContext('2d');
  const { backgroundUrl, layers, user } = config;
  
  try {
    // 1. Load background
    let bgImage;
    try {
      bgImage = await loadImage(backgroundUrl || PLACEHOLDER_BG);
    } catch (err) {
      bgImage = await loadImage(PLACEHOLDER_BG);
    }
    
    const targetWidth = 1080;
    const targetHeight = (bgImage.height / bgImage.width) * targetWidth;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(bgImage, 0, 0, targetWidth, targetHeight);

    // 2. Process Layers
    for (const layer of layers) {
      if (!layer.enabled) continue;

      ctx.save();
      
      const x = (layer.xPercent / 100) * targetWidth;
      const y = (layer.yPercent / 100) * targetHeight;

      if (layer.type === 'text' || layer.type === 'name') {
        const fontSize = layer.fontSize || 40;
        ctx.fillStyle = layer.color || '#ffffff';
        ctx.font = `${layer.fontWeight || 'bold'} ${fontSize}px "${layer.fontFamily || 'Plus Jakarta Sans'}", sans-serif`;
        ctx.textAlign = layer.align || 'center';
        
        // Robust shadow for readability without background boxes
        if (layer.shadow !== false) {
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        const textContent = layer.type === 'name' ? (user?.name || 'YOUR NAME') : layer.text;
        const lines = (textContent || '').split('\n');
        let currentY = y;
        lines.forEach(line => {
          ctx.fillText(line, layer.align === 'center' ? targetWidth / 2 : x, currentY);
          currentY += fontSize * 1.5;
        });
      }

      if (layer.type === 'avatar') {
        try {
          const avatarImg = await loadImage(getAvatarUrl(user));
          const size = (layer.sizePercent / 100) * targetWidth;
          const radius = size / 2;
          const centerX = x + radius;
          const centerY = y + radius;

          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 15;
          
          if (layer.borderWidth > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + layer.borderWidth / 2, 0, Math.PI * 2);
            ctx.strokeStyle = layer.borderColor || '#ffffff';
            ctx.lineWidth = layer.borderWidth;
            ctx.stroke();
          }
          
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(avatarImg, x, y, size, size);
        } catch (err) {
          console.warn('Avatar layer failed', err);
        }
      }

      if (layer.type === 'banner') {
        const height = (layer.heightPercent / 100) * targetHeight;
        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, layer.color || 'rgba(0,0,0,0.7)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, targetWidth, height);
      }

      ctx.restore();
    }
  } catch (err) {
    console.error('Dynamic render error', err);
  }
};

/**
 * Legacy compatibility: Maps old template schema to new dynamic layers
 * Simplified: Removed background banners for clean typography look
 */
export const renderPreview = (canvas, template, user, overrides = {}) => {
  const layers = [];
  
  // Base Positions from Template
  const bannerY = template.overlayConfig?.nameBanner?.enabled 
    ? (template.overlayConfig.nameBanner.yPercent + (overrides.nameYOffset || 0)) 
    : null;

  const avatarX = template.overlayConfig?.avatar?.enabled 
    ? (template.overlayConfig.avatar.xPercent + (overrides.avatarXOffset || 0)) 
    : null;
    
  const avatarY = template.overlayConfig?.avatar?.enabled 
    ? (template.overlayConfig.avatar.yPercent + (overrides.avatarYOffset || 0)) 
    : null;

  if (template.overlayConfig?.nameBanner?.enabled) {
    // Banner box removed as requested. Only the text layer is added.
    layers.push({
      type: 'text',
      enabled: true,
      text: user?.name || 'YOUR NAME',
      yPercent: bannerY + 4, // Adjusted position for clean text look
      fontSize: template.overlayConfig.nameBanner.fontSize * 1.3, // Slightly larger for prominence
      color: template.overlayConfig.nameBanner.color,
      align: 'center',
      fontWeight: '900',
      shadow: true // Explicitly enable shadow for readability on any background
    });
  }

  if (template.overlayConfig?.avatar?.enabled) {
    layers.push({
      type: 'avatar',
      enabled: true,
      xPercent: avatarX,
      yPercent: avatarY,
      sizePercent: template.overlayConfig.avatar.sizePercent,
      borderColor: template.overlayConfig.avatar.borderColor,
      borderWidth: template.overlayConfig.avatar.borderWidth
    });
  }

  if (template.overlayConfig?.textOverlay?.enabled) {
    layers.push({
      type: 'text',
      enabled: true,
      text: template.overlayConfig.textOverlay.text,
      xPercent: template.overlayConfig.textOverlay.xPercent,
      yPercent: template.overlayConfig.textOverlay.yPercent,
      widthPercent: template.overlayConfig.textOverlay.widthPercent,
      fontSize: template.overlayConfig.textOverlay.fontSize,
      color: template.overlayConfig.textOverlay.color,
      align: template.overlayConfig.textOverlay.align,
      shadow: template.overlayConfig.textOverlay.shadow,
      fontFamily: template.overlayConfig.textOverlay.fontFamily
    });
  }

  return renderDynamicCanvas(canvas, {
    backgroundUrl: template.imageUrl,
    layers,
    user
  });
};

export const exportCanvasAsBlob = (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
  });
};
