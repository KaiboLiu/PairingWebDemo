### Instruction for LinearTurboFold project

1. Install `conda`
2. In terminal
	1. [one time] create environment named ltf with conda
	```bash
  	cd linearLTF_package  # enter the working folder
	conda create --name ltf --file requirements.txt
	```
	2. [everytime for running] activate the ltf
	```bash
	conda activate ltf
	```
	3. [everytime after running] close the ltf env
	```bash
	conda deactivate ltf
	```
	4. [everytime for running] start the web server locally with this command
	```bash
	linearfold_ltf.py
	```
  	then open website with url: http://127.0.0.1:5000/
  
  
3. change code
	1. `static/js/showLTF.js` - `var _var =`: change the dict content when necessary
	2. `static/js/showLTF.js` - `function groupRes(...)`: change the layout of sequence and structure
	3. `static/js/showLTF.js` - `$("#res-show").html(groupRes(...));`: use `groupRes` function to create layout format and put it into element named `res-show`, which is rendered in the website http://127.0.0.1:5000/
