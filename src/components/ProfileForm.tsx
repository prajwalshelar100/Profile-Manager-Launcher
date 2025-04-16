
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Laptop, Globe } from "lucide-react";
import { Profile } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormProps {
  onSave: (profile: Profile) => void;
  existingProfile?: Profile;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave, existingProfile }) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>(
    existingProfile || {
      id: crypto.randomUUID(),
      name: '',
      apps: [],
      urls: [],
      browser: 'Default'
    }
  );
  const [newApp, setNewApp] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddApp = () => {
    if (!newApp.trim()) {
      toast({
        title: 'Cannot add empty application path',
        variant: 'destructive'
      });
      return;
    }
    setProfile({
      ...profile,
      apps: [...profile.apps, newApp]
    });
    setNewApp('');
  };

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      toast({
        title: 'Cannot add empty URL',
        variant: 'destructive'
      });
      return;
    }
    
    // Simple URL validation
    try {
      // Add http:// if not present
      let urlToAdd = newUrl;
      if (!/^https?:\/\//i.test(urlToAdd)) {
        urlToAdd = 'http://' + urlToAdd;
      }
      
      // Check if it's a valid URL
      new URL(urlToAdd);
      
      setProfile({
        ...profile,
        urls: [...profile.urls, urlToAdd]
      });
      setNewUrl('');
    } catch (e) {
      toast({
        title: 'Invalid URL format',
        description: 'Please enter a valid URL (e.g., example.com)',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveApp = (index: number) => {
    const newApps = [...profile.apps];
    newApps.splice(index, 1);
    setProfile({
      ...profile,
      apps: newApps
    });
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = [...profile.urls];
    newUrls.splice(index, 1);
    setProfile({
      ...profile,
      urls: newUrls
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name.trim()) {
      toast({
        title: 'Profile name is required',
        variant: 'destructive'
      });
      return;
    }
    
    onSave(profile);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-4">
          <CardTitle>{existingProfile ? 'Edit Profile' : 'Create Profile'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Profile Name</Label>
            <Input 
              id="name" 
              value={profile.name} 
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              placeholder="Work, Entertainment, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Applications</Label>
            <div className="space-y-2">
              {profile.apps.map((app, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-grow truncate text-sm bg-muted rounded-md px-3 py-2">{app}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveApp(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-grow">
                  <Laptop className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={newApp} 
                    onChange={(e) => setNewApp(e.target.value)}
                    placeholder="C:/path/to/application.exe" 
                  />
                </div>
                <Button type="button" onClick={handleAddApp} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>URLs</Label>
            <div className="space-y-2">
              {profile.urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-grow truncate text-sm bg-muted rounded-md px-3 py-2">{url}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveUrl(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-grow">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={newUrl} 
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="example.com" 
                  />
                </div>
                <Button type="button" onClick={handleAddUrl} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="browser">Browser</Label>
            <Select 
              value={profile.browser} 
              onValueChange={(value) => setProfile({...profile, browser: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Browser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem value="firefox">Firefox</SelectItem>
                <SelectItem value="chrome">Chrome</SelectItem>
                <SelectItem value="safari">Safari</SelectItem>
                <SelectItem value="opera">Opera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">{existingProfile ? 'Update' : 'Create'} Profile</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
