const fs = require('fs');
const path = './frontend/src/components/landing/LandingView.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add useState and useEffect imports if missing
if (!content.includes('useState')) {
  content = content.replace('import { motion', 'import { useState, useEffect } from "react";\nimport { motion');
}

// Add isMounted state
if (!content.includes('isMounted')) {
  content = content.replace(
    'export default function LandingView({ onNavigate }: LandingViewProps) {',
    'export default function LandingView({ onNavigate }: LandingViewProps) {\n  const [isMounted, setIsMounted] = useState(false);\n  useEffect(() => setIsMounted(true), []);'
  );
}

// Function to transform style props
const regex = /style={{([^}]+)}}/g;
content = content.replace(regex, (match, inner) => {
  if (inner.includes('yBg') || inner.includes('xBoat') || inner.includes('yTextParallax') || inner.includes('rotateBg')) {
    // If it has a static property like rotate: 15, we extract it.
    // E.g. y: yBgFast, rotate: -15
    const parts = inner.split(',').map(p => p.trim());
    const staticProps = [];
    parts.forEach(part => {
      const [key, value] = part.split(':').map(p => p.trim());
      if (['rotate', 'x', 'y'].includes(key) && !value.includes('yBg') && !value.includes('xBoat') && !value.includes('yTextParallax') && !value.includes('rotateBg')) {
        staticProps.push(`${key}: ${value}`);
      }
    });
    const fallback = staticProps.length > 0 ? `{ ${staticProps.join(', ')} }` : '{}';
    return `style={isMounted ? {${inner}} : ${fallback}}`;
  }
  return match;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated LandingView.tsx');
