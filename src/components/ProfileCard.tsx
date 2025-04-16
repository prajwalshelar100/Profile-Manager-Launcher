
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Trash2, Briefcase, Play, FileDown, MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Profile } from '@/types/profile';

interface ProfileCardProps {
  profile: Profile;
  onLaunch: (profile: Profile) => void;
  onDelete: (id: string) => void;
  onExport: (profile: Profile) => void;
  onScriptExport?: (profile: Profile, platform: 'windows' | 'mac' | 'linux') => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onLaunch, 
  onDelete, 
  onExport,
  onScriptExport 
}) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{profile.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {profile.apps.length} apps, {profile.urls.length} URLs
            </CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm space-y-3">
          {profile.apps.length > 0 && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-1">Applications:</h3>
              <ul className="space-y-1">
                {profile.apps.slice(0, 3).map((app, index) => (
                  <li key={index} className="truncate text-xs">{app.split('/').pop()}</li>
                ))}
                {profile.apps.length > 3 && <li className="text-xs text-muted-foreground">+{profile.apps.length - 3} more</li>}
              </ul>
            </div>
          )}
          
          {profile.urls.length > 0 && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-1">URLs:</h3>
              <ul className="space-y-1">
                {profile.urls.slice(0, 3).map((url, index) => (
                  <li key={index} className="truncate text-xs">{url}</li>
                ))}
                {profile.urls.length > 3 && <li className="text-xs text-muted-foreground">+{profile.urls.length - 3} more</li>}
              </ul>
            </div>
          )}
          
          {profile.browser !== "Default" && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-1">Browser:</h3>
              <p className="truncate text-xs capitalize">{profile.browser}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button onClick={() => onDelete(profile.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport(profile)}>
                JSON Profile
              </DropdownMenuItem>
              {onScriptExport && (
                <>
                  <DropdownMenuItem onClick={() => onScriptExport(profile, 'windows')}>
                    Windows Script (.bat)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onScriptExport(profile, 'mac')}>
                    macOS Script (.command)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onScriptExport(profile, 'linux')}>
                    Linux Script (.sh)
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => onLaunch(profile)} variant="default" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Launch
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
