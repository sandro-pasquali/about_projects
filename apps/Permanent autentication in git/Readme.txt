https://confluence.atlassian.com/display/STASH/Permanently+authenticating+with+Git+repositories

For windows install: "git-credential-winstore.exe"
To uninstall: open and delete the line about helpers push in .gitconfig

For ubuntu run: git config --global credential.helper 'cache --timeout 3600'