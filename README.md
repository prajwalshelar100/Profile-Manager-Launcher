
# Profile Launcher

A modern web application for managing and launching grouped applications and URLs.

Profile Manager is a setup orchestration application that helps users create profiles for their specific workflows, eliminating the need to set up their working environment for different tasks each day.

## Features

- Create profiles that group applications and URLs together
- Launch all items in a profile with a single click
- Import and export profiles as JSON files
- Choose which browser to use for opening URLs
- Responsive design that works on all devices

## Creating Profiles

1. Click the "Create Profile" button on the dashboard
2. Enter a name for your profile
3. Add application paths or URLs using the respective input fields
4. Select a preferred browser for URLs (optional)
5. Click "Create Profile" to save your profile
6. Export the file as per your OS and run it

### Launching Profiles

Click the "Launch" button on a profile card to launch all the applications and URLs in that profile. 

**Note:** In the web version, only URLs can be opened due to browser security restrictions. For full functionality, including launching desktop applications, a desktop version is planned.

### Importing and Exporting Profiles

- **Export:** Click the "Export" button on a profile card to download the profile as a JSON file
- **Import:** Click the "Import Profile" button on the dashboard and select a JSON file containing a valid profile

## Technical Details

This project is built with:

- React
- TypeScript
- TailwindCSS
- shadcn/ui components

## Web vs. Desktop Version

The current web implementation has limitations due to browser security restrictions:

- Can only open URLs, not desktop applications
- Can only automatically open one URL at a time due to popup blocking
- Cannot specify which browser to use (always uses the default browser)

A desktop version with Electron is planned to provide full functionality.

## Roadmap

Planned features for future updates:

- Desktop application with Electron
- Profile categories and tags
- Scheduled launches
- Sync between devices
- Search functionality
- Keyboard shortcuts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
