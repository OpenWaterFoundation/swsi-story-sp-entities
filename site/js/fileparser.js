class FileParser {
	constructor(variableArray = [null, null, null]){
		this.datevar = variableArray[0] != null ? variableArray[0] : null;
		this.var1 = variableArray[1] != null ? variableArray[1] : null;
		this.var2 = variableArray[2] != null ? variableArray[2] : null;
		this.csv;
		this.json;
	}

	setDateVariable(variable){
		this.datevar = variable;
	}

	getDateVariable(){
		return this.datevar;
	}

	setFirstVariable(variable){
		this.var1 = variable;
	}

	getFirstVariable(){
		return this.var1;
	}

	setSecondVariable(variable){
		this.var2 = variable;
	}

	getSecondVariable(){
		return var2;
	}

	csvToJson(filename) {
		var that = this;
		$.ajax({
			url: filename,
			async:false,
			dataType: 'text',
			error: function(error){
				throw new Error(error);
			}, 
			success: function(data){
				that.csv = data;
				Papa.parse(data, {
					header:true,
					comments:true,
					dynamicTyping:true,
					skipEmptyLines:true,
					complete: function(data){
						that.json = convertData(data, that);
					}
				})
			}
		})
		
		function convertData(json, that){
			console.log(that.datevar)
			console.log(that.var1)
			console.log(that.var2)
			var firstValue = json.data[0]
			var year = firstValue[that.datevar];
			var ret = {"data":[]};
			var data = ret["data"];
			data[year] = {};
			json.data.forEach(function(row){
				var currdate = row[that.datevar];
				if(year == currdate){
					console.log(row)
					console.log(row[that.var1])
					data[year][row[that.var1].trim()] = row[that.var2];
				}else{
					year = currdate;
					data[year] = {};
					data[year][row[that.var1].trim()] = row[that.var2];
				}
			})
			return ret;
		}
	}

	getJsonData(){
		return this.json;
	}

	getCSVData(){
		return this.csv;
	}
}