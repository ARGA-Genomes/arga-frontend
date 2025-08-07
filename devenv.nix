{ pkgs, ... }:

{
  cachix.enable = false;

  packages = with pkgs; [
    emmet-ls
    nodePackages.typescript-language-server
    nodePackages.prettier
  ];

  languages.javascript.enable = true;
  languages.javascript.package = pkgs.nodejs_23;
  languages.javascript.pnpm.enable = true;
}
