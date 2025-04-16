
export interface Profile {
  id: string;
  name: string;
  apps: string[];
  urls: string[];
  browser: string;
  userId?: string; // Optional field to associate profile with user
  profiles?: Profile[]; // Optional field for bulk exports
}
