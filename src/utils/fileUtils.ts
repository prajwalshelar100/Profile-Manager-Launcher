
import { Profile } from '@/types/profile';

export const exportProfileToJson = (profile: Profile): string => {
  return JSON.stringify(profile, null, 2);
};

export const downloadJsonFile = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const readJsonFile = (file: File): Promise<Profile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const parsedProfile = JSON.parse(event.target.result as string) as Profile;
          
          // Validate the parsed object has the required fields
          if (!parsedProfile.name || !Array.isArray(parsedProfile.apps) || !Array.isArray(parsedProfile.urls)) {
            throw new Error('Invalid profile format');
          }
          
          // Ensure browser is set
          if (!parsedProfile.browser) {
            parsedProfile.browser = 'Default';
          }
          
          // Add an ID if missing
          if (!parsedProfile.id) {
            parsedProfile.id = crypto.randomUUID();
          }
          
          resolve(parsedProfile);
        } else {
          reject(new Error('Failed to read file'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
