This repo is a nextjs+mantine frontend written in typescript and hitting the [arga-backend](https://github.com/ARGA-Genomes/arga-backend) graphql API.
It opts in to the beta appDir functionality of nextjs.


## Getting Started

This repo is built against the latest stable version of nodejs and can use either `npm`, `yarn`, or `pnpm`.

To run a development server:

``` bash
pnpm dev
```

To build a production version and serve it with the nextjs server (optional)

``` bash
pnpm build
pnpm start
```

To run the linter:

``` bash
pnpm lint
```

Refer to the `package.json` file for more commands that can be run.


## Reproducible Builds

Included in the repo is a [devenv](https://devenv.sh) configuration to enable a declarative and reproducible environment. This leverages the nix package manager to provide both needed system dependencies as well as convenient developer tools without having to worry about version compatibility.

To get started install `devenv` and then enter the shell by running:

``` bash
devenv shell
```

This will take some time to download nodejs, pnpm, and various tools like the typescript language server. Once inside the above commands in `Getting Started` should work with the correct dependencies.
If you're messing around with the devenv or nix flake files don't forget to occasionally do a garbage collect by running:

``` bash
devenv gc
```
This will remove any dependencies no longer used. Keep in mind that the nix package manager does not use your system packages so it might take up more disk space than you would expect. For example if installing nodejs it will also install the locked dependencies of nodejs as well, and so on.


### direnv

To avoid clobbering other workflows the `.envrc` file created by devenv isn't committed. To automatically enter the shell when you enter the repo directory add the following `.envrc` file to the project root:

```
watch_file devenv.nix
watch_file devenv.yaml
watch_file devenv.lock
eval "$(devenv print-dev-env)"
```
