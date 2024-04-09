# Branches
- `gh-pages` branch is for deployment. Our website is hosted on this branch.
- `main` branch is for development. So, we could try out new features and test them before deploying them to the `gh-pages` branch.

</br>
To deploy the project, just run the following command in `perfect_sleep` directory:

```shell
npm run deploy
```
> This command will build the project into static files saved in `perfect_sleep/build` directory and deploy it to the `gh-pages` branch.

By default, the new commit on the gh-pages branch will have a commit message of "Updates". You can specify a custom commit message via the -m option, like this:
```shell
npm run deploy -- -m "Your custom message"
```

</br>

# Installation
## Install React Dependencies

Once you have cloned the repository, you need to install the dependencies to run React.

Go to the `perfect_sleep` directory and run the following command:

```shell
npm install
```

After the installation is done, you can run the project by running the following command:

```shell
npm start
```  
</br>

## Install gh-pages package
Run the following command to install gh-pages package:

```shell
npm install gh-pages --save-dev
```
</br>

## Install D3

run the following command to install D3:

```shell
npm install d3
```

Then require/import it:

```javascript
import * as d3 from "d3";
```
</br>

## Install [react-scrollama](https://jsonkao.github.io/react-scrollama/)
Run the following command to install react-scrollama:

```shell
npm install react-scrollama --save
```

Then require/import it:

```javascript
import { Scrollama, Step } from "react-scrollama";
```  


</br>

You can also use the original [scrollama](https://github.com/russellsamora/scrollama#how-to-use) .   
<details>
<summary>Install scrollama</summary>
Run the following command to install Scrollama:

```shell
npm install scrollama intersection-observer --save
```

Then require/import it:

```javascript
import scrollama from "scrollama"; // or...
const scrollama = require("scrollama");
```

For usage tutorial, check this website: [Usage](https://github.com/russellsamora/scrollama#how-to-use)


</details>
