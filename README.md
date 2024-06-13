# Cre8 FrontEnd

## React + Vite

This uses Vite to get React working with HMR and some ESLint rules.

## Running Project

Clone this git repository to your working machine.

Redirect to the project directory and run following commands.

```
# Install required libraries
npm install 

# Create local certificate using mkcert
choco install mkcert  # Using Windows Chocolatey
mkcert -install       # Install local CA
cd ${project_path}    # Move to project location
mkcert localhost      # Create Certificate valid for localhost

# Start project
npm run dev 
```