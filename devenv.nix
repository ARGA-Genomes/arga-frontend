{ pkgs, ... }:

{
  cachix.enable = false;
  
  packages = with pkgs; [
    nodePackages.pnpm
    nodePackages.typescript-language-server
  ];

  languages.javascript.enable = true;
}
