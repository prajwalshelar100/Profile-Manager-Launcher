
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProfileCard from '@/components/ProfileCard';
import ProfileForm from '@/components/ProfileForm';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Plus, Upload, AlertTriangle } from "lucide-react";
import { Profile } from '@/types/profile';
import { loadProfiles, saveProfiles, launchProfile } from '@/utils/profileUtils';
import { exportProfileToJson, downloadJsonFile, readJsonFile } from '@/utils/fileUtils';
import { downloadScript } from '@/utils/scriptUtils';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLaunchAlertOpen, setIsLaunchAlertOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [launchWarning, setLaunchWarning] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    if (user) {
      const loadedProfiles = loadProfiles(user.id);
      setProfiles(loadedProfiles);
    }
  }, [user]);

  const handleCreateProfile = (profile: Profile) => {
    // Assign the user ID to the profile
    const profileWithUser = {
      ...profile,
      userId: user?.id
    };
    
    const newProfiles = [...profiles, profileWithUser];
    setProfiles(newProfiles);
    saveProfiles(newProfiles, user?.id);
    setIsCreateDialogOpen(false);
    toast({
      title: "Profile created",
      description: `"${profile.name}" profile has been created successfully.`
    });
  };

  const handleDeleteProfile = (id: string) => {
    const newProfiles = profiles.filter(profile => profile.id !== id);
    setProfiles(newProfiles);
    saveProfiles(newProfiles, user?.id);
    toast({
      title: "Profile deleted",
      description: "The profile has been deleted successfully."
    });
  };

  const handleExportProfile = (profile: Profile) => {
    const exportData = exportProfileToJson(profile);
    downloadJsonFile(exportData, `${profile.name.toLowerCase().replace(/\s+/g, '-')}-profile.json`);
    toast({
      title: "Profile exported",
      description: `"${profile.name}" profile exported successfully.`
    });
  };

  const handleScriptExport = (profile: Profile, platform: 'windows' | 'mac' | 'linux') => {
    downloadScript(profile, platform);
    
    const platformNames = {
      windows: 'Windows',
      mac: 'macOS',
      linux: 'Linux'
    };
    
    toast({
      title: "Script exported",
      description: `"${profile.name}" launcher script for ${platformNames[platform]} created successfully.`
    });
  };

  const handleImportProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedProfile = await readJsonFile(file);
      
      // Add the current user ID to the imported profile
      const profileWithUser = {
        ...importedProfile,
        userId: user?.id
      };
      
      // Check if a profile with the same name already exists
      const existingProfile = profiles.find(p => p.name === profileWithUser.name);
      if (existingProfile) {
        profileWithUser.name = `${profileWithUser.name} (imported)`;
      }
      
      const newProfiles = [...profiles, profileWithUser];
      setProfiles(newProfiles);
      saveProfiles(newProfiles, user?.id);
      
      toast({
        title: "Profile imported",
        description: `"${profileWithUser.name}" profile imported successfully.`
      });
      
      // Reset file input
      setFileInputKey(Date.now());
    } catch (error) {
      console.error('Error importing profile:', error);
      
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import profile",
        variant: "destructive"
      });
      
      // Reset file input
      setFileInputKey(Date.now());
    }
  };

  const handleLaunchProfile = async (profile: Profile) => {
    setSelectedProfile(profile);
    
    // If the profile has applications, we show a warning for web version
    if (profile.apps.length > 0) {
      setLaunchWarning('This profile contains desktop applications which cannot be launched from the web version.');
      setIsLaunchAlertOpen(true);
      return;
    }
    
    const result = await launchProfile(profile);
    
    if (result.error) {
      if (result.success) {
        // Partial success
        toast({
          title: "Profile partially launched",
          description: result.error,
          variant: "default"
        });
      } else {
        // Error
        toast({
          title: "Failed to launch profile",
          description: result.error,
          variant: "destructive"
        });
      }
    } else {
      // Complete success
      toast({
        title: "Profile launched",
        description: `"${profile.name}" profile launched successfully.`
      });
    }
  };

  const confirmLaunch = async () => {
    if (!selectedProfile) return;
    
    setIsLaunchAlertOpen(false);
    
    const result = await launchProfile(selectedProfile);
    
    // Show appropriate toast based on the result
    if (result.success) {
      toast({
        title: "URLs launched",
        description: `URLs from "${selectedProfile.name}" have been launched.${result.error ? ' ' + result.error : ''}`
      });
    } else {
      toast({
        title: "Launch failed",
        description: result.error || "Failed to launch profile",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <Tabs defaultValue="all" className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Profiles</h1>
            {user?.isGuest && (
              <p className="text-sm text-muted-foreground mt-1">
                You're in guest mode. Your profiles will be stored only on this device.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Profile
            </Button>
            <div className="relative">
              <input
                key={fileInputKey}
                type="file"
                id="import-profile"
                accept=".json"
                onChange={handleImportProfile}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Profile
              </Button>
            </div>
          </div>
        </div>

        <TabsList className="mb-4">
          <TabsTrigger value="all">All Profiles</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
          <TabsTrigger value="favorite">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {profiles.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-semibold">No profiles yet</h3>
              <p className="text-muted-foreground mt-2 mb-4">Create your first profile to get started</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Profile
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onLaunch={handleLaunchProfile}
                  onDelete={handleDeleteProfile}
                  onExport={handleExportProfile}
                  onScriptExport={handleScriptExport}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">Recent profiles will appear here</h3>
            <p className="text-muted-foreground mt-2">
              This feature is coming soon in a future update
            </p>
          </div>
        </TabsContent>

        <TabsContent value="favorite">
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">Favorite profiles will appear here</h3>
            <p className="text-muted-foreground mt-2">
              This feature is coming soon in a future update
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Create a new profile to group applications and URLs.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onSave={handleCreateProfile} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isLaunchAlertOpen} onOpenChange={setIsLaunchAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Web Version Limitation
            </AlertDialogTitle>
            <AlertDialogDescription>
              {launchWarning}
              {selectedProfile?.urls.length ? 
                " However, the URLs in this profile can still be launched." : 
                " This profile does not contain any URLs to launch."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {selectedProfile?.urls.length ? (
              <AlertDialogAction onClick={confirmLaunch}>
                Launch URLs Only
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Index;
