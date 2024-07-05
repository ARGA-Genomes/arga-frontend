{ pkgs, ... }:

{
  cachix.enable = false;
  
  packages = with pkgs; [
    nodePackages.pnpm
    nodePackages.typescript-language-server
    nodePackages.prettier
  ];

  languages.javascript.enable = true;
}
