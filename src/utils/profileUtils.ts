
import { Profile } from '@/types/profile';

export const launchProfile = async (profile: Profile): Promise<{ success: boolean; error?: string }> => {
  try {
    // In a web context, we can only attempt to open URLs
    if (profile.urls.length > 0) {
      // We can only open one URL automatically due to popup blockers
      // We'll open the first one and show instructions for the rest
      window.open(profile.urls[0], '_blank');
      return { 
        success: true, 
        error: profile.urls.length > 1 ? 
          'Due to browser security, only the first URL was launched automatically.' : 
          undefined 
      };
    }
    
    return { 
      success: true, 
      error: profile.apps.length > 0 ? 
        'Application launching is only available in the desktop version.' : 
        'Profile has no URLs to launch.' 
    };
  } catch (error) {
    console.error('Error launching profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error launching profile' 
    };
  }
};

export const saveProfiles = (profiles: Profile[], userId?: string): void => {
  const storageKey = userId ? `profiles_${userId}` : 'profiles';
  localStorage.setItem(storageKey, JSON.stringify(profiles));
};

export const loadProfiles = (userId?: string): Profile[] => {
  const storageKey = userId ? `profiles_${userId}` : 'profiles';
  const profilesJson = localStorage.getItem(storageKey);
  if (!profilesJson) return [];
  
  try {
    return JSON.parse(profilesJson);
  } catch (error) {
    console.error(`Error parsing profiles from localStorage for user ${userId}:`, error);
    return [];
  }
};
