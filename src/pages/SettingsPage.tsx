
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Terminal,
  FileDown
} from 'lucide-react';
import { loadProfiles, saveProfiles } from '@/utils/profileUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { exportProfileToJson, downloadJsonFile } from '@/utils/fileUtils';
import { downloadScript, detectPlatform } from '@/utils/scriptUtils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Profile } from '@/types/profile';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);
  const currentPlatform = detectPlatform();
  
  const [settings, setSettings] = useState({
    enableDesktopNotifications: true,
    confirmBeforeLaunch: true,
    darkMode: false,
    autoSaveProfiles: true
  });
  
  const handleToggleSetting = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
    
    // In a real app, we'd save the settings here
    toast({
      title: "Settings updated",
      description: `${setting} is now ${!settings[setting] ? 'enabled' : 'disabled'}.`
    });
  };
  
  const handleExportAllProfiles = () => {
    const profiles = loadProfiles();
    if (profiles.length === 0) {
      toast({
        title: "No profiles to export",
        description: "Create some profiles first before exporting.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a meta profile that contains all profiles
    const allProfilesExport: Profile = { 
      id: "all-profiles",
      name: "All Profiles Export",
      apps: [],
      urls: [],
      browser: "Default",
      profiles: profiles 
    };
    
    const exportData = exportProfileToJson(allProfilesExport);
    
    downloadJsonFile(exportData, "all-profiles-export.json");
    toast({
      title: "Profiles exported successfully",
      description: `Exported ${profiles.length} profile(s) to JSON file.`
    });
  };
  
  const handleExportAllScripts = (platform: 'windows' | 'mac' | 'linux') => {
    const profiles = loadProfiles();
    if (profiles.length === 0) {
      toast({
        title: "No profiles to export",
        description: "Create some profiles first before exporting scripts.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a zip file with all scripts (simulated here - in a real app you'd use a library like JSZip)
    // For now, we'll just generate individual scripts for each profile
    profiles.forEach(profile => {
      downloadScript(profile, platform);
    });
    
    const platformNames = {
      windows: 'Windows',
      mac: 'macOS',
      linux: 'Linux'
    };
    
    toast({
      title: "Scripts exported successfully",
      description: `Exported ${profiles.length} ${platformNames[platform]} launcher scripts.`
    });
  };
  
  const handleClearAllProfiles = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    
    saveProfiles([]);
    setConfirmClear(false);
    toast({
      title: "All profiles cleared",
      description: "Your profile data has been reset."
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Customize how Profile Launcher works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when profiles are launched</p>
                </div>
                <Switch 
                  id="desktop-notifications" 
                  checked={settings.enableDesktopNotifications}
                  onCheckedChange={() => handleToggleSetting('enableDesktopNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confirm-launch">Confirm Before Launch</Label>
                  <p className="text-sm text-muted-foreground">Show confirmation dialog before launching profiles</p>
                </div>
                <Switch 
                  id="confirm-launch" 
                  checked={settings.confirmBeforeLaunch}
                  onCheckedChange={() => handleToggleSetting('confirmBeforeLaunch')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme (in development)</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggleSetting('darkMode')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Auto-Save Profiles</Label>
                  <p className="text-sm text-muted-foreground">Automatically save profile changes</p>
                </div>
                <Switch 
                  id="auto-save" 
                  checked={settings.autoSaveProfiles}
                  onCheckedChange={() => handleToggleSetting('autoSaveProfiles')}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Import, export, or clear your profile data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Profiles
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportAllProfiles}>
                      <FileDown className="h-4 w-4 mr-2" />
                      Export All Profiles as JSON
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel>Export Launcher Scripts</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleExportAllScripts('windows')}>
                      <Terminal className="h-4 w-4 mr-2" />
                      Windows Scripts (.bat)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportAllScripts('mac')}>
                      <Terminal className="h-4 w-4 mr-2" />
                      macOS Scripts (.command)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportAllScripts('linux')}>
                      <Terminal className="h-4 w-4 mr-2" />
                      Linux Scripts (.sh)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Profiles
                </Button>
              </div>
              
              <Button 
                variant={confirmClear ? "destructive" : "outline"} 
                className="w-full flex items-center gap-2"
                onClick={handleClearAllProfiles}
              >
                <Trash2 className="h-4 w-4" />
                {confirmClear ? "Confirm Clear" : "Clear All Profiles"}
              </Button>
              
              {confirmClear && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning!</AlertTitle>
                  <AlertDescription>
                    This will permanently delete all your profiles. Click "Confirm Clear" again to proceed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Information about Profile Launcher</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p><strong>Profile Launcher</strong> v1.0.0</p>
                <p className="text-muted-foreground mt-1">A web application for managing and launching grouped applications and URLs</p>
                <p className="text-muted-foreground mt-3">
                  Visit our <a href="https://github.com/username/profile-launcher" className="text-blue-500 hover:underline">GitHub repository</a> for updates and more information.
                </p>
                
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="font-medium">Detected Platform: {
                    currentPlatform === 'windows' ? 'Windows' : 
                    currentPlatform === 'mac' ? 'macOS' : 
                    currentPlatform === 'linux' ? 'Linux' : 
                    'Unknown'
                  }</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Platform detection is used to generate appropriate launcher scripts for your operating system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
