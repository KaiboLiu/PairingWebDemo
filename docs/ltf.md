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
	python linearfold_ltf.py
	```
  	then open website with url: http://127.0.0.1:5000/linearturbofold
  
  
3. change code
	1. `static/js/showLTF.js` - `var _var =`: change the dict content when necessary
	2. `static/js/showLTF.js` - `function groupRes(...)`: change the layout of sequence and structure
	3. `static/js/showLTF.js` - `$("#res-show").html(groupRes(...));`: use `groupRes` function to create layout format and put it into element named `res-show`, which is rendered in the website http://127.0.0.1:5000/linearturbofold



### 06/04/2021 Fri
1. how to use `groupRes` function
	1. this function is used to generate a long string, with html tags, to be filled in a position whose id is `#res-show`
	2. you can change the parameters of this function, currently it's `seqAA, seqNt, struc, textWid, tup,...`, you can use a dictionary like this:
	```javascript
	// dict, 
	// keys: seq1, seq2, seq3; value: a dict with seq and struc
	var data_dict=  {
	  "seq1": { "seq": 'AUCGGCA', "struc": '.((.).)' },
	  "seq2": { "seq": 'CUCGGCA', "struc": '.(.)..)' },
	  "seq3": { "seq": 'UUCGGCA', "struc": '.......' }
	      }
	//////////// or ///////////
	// list,
	// every element in the list is a dict with seq and struc
	var data_array = [
	  { "seq": 'AUCGGCA', "struc": '.((.).)' },   // seq1
	  { "seq": 'CUCGGCA', "struc": '.(.)..)' },   // seq2 
	  { "seq": 'UUCGGCA', "struc": '.......' },   // seq3
	]
	```
	so the function becomes `function groupRes(mydata, textWid)`
	
	3. if you follow my suggestion of `mydata_array`, then you can construct the long string in `groupRes` as below (just pseudocode, you need to verify the code):
	```javascript
	final_string = ''
	Lmax = data_array[0].seq.length
	pos_start = 0
	pos_end = textWid
	while pos_start < Lmax:
		for i_seq=0 in 1..data_array.length

			sequence = data_array[i_seq].seq     // or data_array[i_seq]["seq"]
			structure = data_array[i_seq].struc  // or data_array[i_seq]["struc"]

			for letter in sequence[pos_start:pos_end]:
				final_string += '<markup>' + letter + '</markup>'
			final_string += '<br>'

			for letter in structure[pos_start:pos_end]:
				final_string += '<markup>' + letter + '</markup>'
			final_string += '<br>'
		pos_start = pos_end
		pos_end += textWid
	```
	
	4. some explanation:
		1. `markup` can be <span class="..." id="...">
		2. `sequence[pos_start:pos_end]` is array slicing
