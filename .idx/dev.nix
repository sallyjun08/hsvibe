# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_22
    pkgs.python3
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "google.gemini-cli-vscode-ide-companion"
    ];
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["bash" "-c" "npm run dev -- --port $PORT --hostname 0.0.0.0"];
          manager = "web";
          cwd = "/home/user/try";
        };
      };
    };
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        npm-install = "cd /home/user/try && npm install";
        default.openFiles = [ "src/app/page.tsx" "src/app/globals.css" ];
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Next.js dev server는 IDX 프리뷰가 자동으로 시작합니다
      };
    };
  };
}