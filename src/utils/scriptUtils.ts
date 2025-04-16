
import { Profile } from '@/types/profile';

// Detect platform
export const detectPlatform = (): 'windows' | 'mac' | 'linux' | 'unknown' => {
  const platform = navigator.platform.toLowerCase();
  
  if (platform.includes('win')) return 'windows';
  if (platform.includes('mac')) return 'mac';
  if (platform.includes('linux') || platform.includes('x11')) return 'linux';
  
  return 'unknown';
};

// Create Windows batch script (.bat)
export const createWindowsBatchScript = (profile: Profile): string => {
  let script = '@echo off\r\n';
  script += 'echo Launching profile: ' + profile.name + '\r\n\r\n';
  
  // Add apps
  if (profile.apps.length > 0) {
    script += 'echo Starting applications...\r\n';
    profile.apps.forEach(app => {
      script += `start "" "${app}"\r\n`;
    });
    script += '\r\n';
  }
  
  // Add URLs
  if (profile.urls.length > 0) {
    script += 'echo Opening URLs...\r\n';
    
    // Handle different browsers
    const browserCmd = profile.browser === 'Default' ? 'start' : 
                     profile.browser === 'chrome' ? 'start chrome' :
                     profile.browser === 'firefox' ? 'start firefox' :
                     profile.browser === 'opera' ? 'start opera' :
                     profile.browser === 'safari' ? 'start safari' : 'start';
    
    profile.urls.forEach(url => {
      script += `${browserCmd} "${url}"\r\n`;
    });
  }
  
  script += '\r\necho Profile launch complete!\r\n';
  script += 'pause\r\n';
  
  return script;
};

// Create macOS shell script (.command)
export const createMacScript = (profile: Profile): string => {
  let script = '#!/bin/bash\n';
  script += 'echo "Launching profile: ' + profile.name + '"\n\n';
  
  // Add apps
  if (profile.apps.length > 0) {
    script += 'echo "Starting applications..."\n';
    profile.apps.forEach(app => {
      script += `open "${app}"\n`;
    });
    script += '\n';
  }
  
  // Add URLs
  if (profile.urls.length > 0) {
    script += 'echo "Opening URLs..."\n';
    
    // Handle different browsers
    const browserCmd = profile.browser === 'Default' ? 'open' : 
                     profile.browser === 'chrome' ? 'open -a "Google Chrome"' :
                     profile.browser === 'firefox' ? 'open -a Firefox' :
                     profile.browser === 'opera' ? 'open -a Opera' :
                     profile.browser === 'safari' ? 'open -a Safari' : 'open';
    
    profile.urls.forEach(url => {
      script += `${browserCmd} "${url}"\n`;
    });
  }
  
  script += '\necho "Profile launch complete!"\n';
  script += 'read -p "Press enter to exit"\n';
  
  return script;
};

// Create Linux shell script (.sh)
export const createLinuxScript = (profile: Profile): string => {
  let script = '#!/bin/bash\n';
  script += 'echo "Launching profile: ' + profile.name + '"\n\n';
  
  // Add apps
  if (profile.apps.length > 0) {
    script += 'echo "Starting applications..."\n';
    profile.apps.forEach(app => {
      script += `"${app}" &\n`;
    });
    script += '\n';
  }
  
  // Add URLs
  if (profile.urls.length > 0) {
    script += 'echo "Opening URLs..."\n';
    
    // Handle different browsers
    const browserCmd = profile.browser === 'Default' ? 'xdg-open' : 
                     profile.browser === 'chrome' ? 'google-chrome' :
                     profile.browser === 'firefox' ? 'firefox' :
                     profile.browser === 'opera' ? 'opera' :
                     profile.browser === 'safari' ? 'safari' : 'xdg-open';
    
    profile.urls.forEach(url => {
      script += `${browserCmd} "${url}" &\n`;
    });
  }
  
  script += '\necho "Profile launch complete!"\n';
  script += 'read -p "Press enter to exit"\n';
  
  return script;
};

// Generate script based on detected or specified platform
export const generateScript = (profile: Profile, platform?: 'windows' | 'mac' | 'linux'): { content: string; extension: string; } => {
  const targetPlatform = platform || detectPlatform();
  
  switch (targetPlatform) {
    case 'windows':
      return { content: createWindowsBatchScript(profile), extension: '.bat' };
    case 'mac':
      return { content: createMacScript(profile), extension: '.command' };
    case 'linux':
      return { content: createLinuxScript(profile), extension: '.sh' };
    default:
      // Default to Linux script
      return { content: createLinuxScript(profile), extension: '.sh' };
  }
};

// Download script
export const downloadScript = (profile: Profile, platform?: 'windows' | 'mac' | 'linux'): void => {
  const { content, extension } = generateScript(profile, platform);
  const filename = `${profile.name.toLowerCase().replace(/\s+/g, '-')}-launcher${extension}`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
