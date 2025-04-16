
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const DocumentationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Documentation</h1>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
            <TabsTrigger value="desktop">Desktop Version</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-220px)] pr-4">
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Launcher Overview</CardTitle>
                  <CardDescription>A tool to manage and launch groups of applications and URLs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Profile Launcher is a productivity tool that allows you to organize your workflow by creating profiles 
                    of applications and URLs that you frequently use together. For example, you might have a "Work" profile 
                    that opens your email, calendar, project management tool, and development environment, or a "Research" 
                    profile that opens reference materials and note-taking tools.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Create multiple profiles for different activities</li>
                    <li>Launch all applications and URLs in a profile with a single click</li>
                    <li>Import and export profiles to share with others</li>
                    <li>Choose which browser to use for opening URLs</li>
                    <li>Web interface for managing profiles</li>
                    <li>Desktop application for full functionality (coming soon)</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-4">Web vs. Desktop Version</h3>
                  <p>
                    The web version of Profile Launcher allows you to manage your profiles and open URLs, but 
                    due to browser security restrictions, it cannot launch desktop applications. For full 
                    functionality, including opening applications, you'll need to use the desktop version.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usage">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Guide</CardTitle>
                  <CardDescription>How to use Profile Launcher effectively</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Creating a Profile</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Click on the "Create Profile" button on the dashboard</li>
                    <li>Enter a name for your profile</li>
                    <li>Add application paths or URLs using the respective input fields</li>
                    <li>Select a preferred browser for URLs (optional)</li>
                    <li>Click "Create Profile" to save your profile</li>
                  </ol>
                  
                  <h3 className="text-lg font-semibold mt-4">Launching a Profile</h3>
                  <p>
                    To launch a profile, simply click the "Launch" button on the profile card. In the web version,
                    only URLs will be opened, and only the first URL will open automatically due to browser popup
                    blocking. In the desktop version, all applications and URLs will be launched.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Importing and Exporting Profiles</h3>
                  <p>
                    You can export your profiles as JSON files to back them up or share them with others. To import
                    a profile, click the "Import Profile" button and select a JSON file containing a valid profile.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Managing Profiles</h3>
                  <p>
                    You can edit or delete profiles from the dashboard. Click "Delete" to remove a profile, or open
                    a profile to edit its contents.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="desktop">
              <Card>
                <CardHeader>
                  <CardTitle>Desktop Version</CardTitle>
                  <CardDescription>Full-featured desktop application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The desktop version of Profile Launcher provides all the functionality of the web version,
                    plus the ability to launch desktop applications. This is the recommended way to use Profile
                    Launcher if you need to open applications as part of your profiles.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Installation</h3>
                  <p>To install the desktop version:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Visit the GitHub repository</li>
                    <li>Download the installer for your operating system (Windows, macOS, or Linux)</li>
                    <li>Run the installer and follow the prompts</li>
                  </ol>
                  
                  <h3 className="text-lg font-semibold mt-4">Usage</h3>
                  <p>
                    The desktop application works similarly to the web version, but with the added ability to:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Launch desktop applications</li>
                    <li>Run profiles on startup</li>
                    <li>Use system-specific browsers</li>
                    <li>Work offline</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-4">Syncing with Web Version</h3>
                  <p>
                    You can export profiles from the web version and import them into the desktop application,
                    and vice versa. This allows you to manage your profiles from anywhere and use them on your
                    desktop when needed.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>Technical details for developers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Profile Format</h3>
                  <p>Profiles are stored as JSON objects with the following structure:</p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
{`{
  "id": "unique-identifier",
  "name": "Profile Name",
  "apps": [
    "C:/path/to/application.exe",
    "/Applications/App.app"
  ],
  "urls": [
    "https://example.com",
    "https://another-site.com"
  ],
  "browser": "Default"
}`}
                  </pre>
                  
                  <h3 className="text-lg font-semibold mt-4">Local Storage</h3>
                  <p>
                    In the web version, profiles are stored in the browser's localStorage under the key "profiles".
                    The data is an array of profile objects as described above.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Desktop API</h3>
                  <p>
                    The desktop application exposes additional APIs for launching applications and managing system
                    integration. These are available through the main process in the Electron application.
                  </p>
                  <p>
                    For full details on the desktop API, please refer to the GitHub repository documentation.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DocumentationPage;
