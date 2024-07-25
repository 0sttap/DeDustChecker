## Getting Started

### Requirements

The following will need to be installed in order to use this. Please follow the links and instructions.

-   [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)  
    -   You'll know you've done it right if you can run `git --version`
-   [NodeJS](https://nodejs.org/en/download/package-manager)
    -   Check that Node is installed by running: `node --version` and get an output like: `v18.16.1`

### Quickstart

#### 1. Clone this repo

```shell
git clone https://github.com/0sttap/DeDustChecker.git
cd DeDustChecker
```

#### 2. Install dependencies

Once you've cloned and entered into your repository, you need to install the necessary dependencies. In order to do so, simply run:

```shell
npm install
```

#### 3. Prepare environment

 3.1 Create .env file or rename .env.example to .env:

```
DEBANK_ACCESS_KEY=
```

 3.2 Add addresses to `src/addresses.txt` file

#### 4. Run script

To run script use this command:

```shell
npm start
```