class FileParser {
	constructor(variableArray = [null, null, null, null]){
		this.datevar = variableArray[0] != null ? variableArray[0] : null;
		this.var1 = variableArray[1] != null ? variableArray[1] : null;
		this.var2 = variableArray[2] != null ? variableArray[2] : null;
		this.var3 = variableArray[3] != null ? variableArray[3] : null;
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

	setThirdVariable(variable){
		this.var2 = variable;
	}

	getThirdVariable(){
		return var3;
	}

	csvToJson(filename){
		var that = this;
		return $.ajax({
			url: filename,
			accepts: "text/csv; charset=utf-8",
			error: function(error){
				console.log(filename)
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
						that.json = that.convertData(data, that);
					}
				})
			},
			timeout: 5000
		})
	}

	convertData(json, that){
		var firstValue = json.data[0]
			var year = firstValue[that.datevar];
			var ret = {"data":[]};
			var data = ret["data"];
			data[year] = {};
			json.data.forEach(function(row){
				var currdate = row[that.datevar];
				if(year == currdate){
					data[year][row[that.var1].trim()] = (that.var3 != null) ? [row[that.var2], row[that.var3]] : row[that.var2];
				}else{
					year = currdate;
					data[year] = {};
					data[year][row[that.var1].trim()] = (that.var3 != null) ? [row[that.var2], row[that.var3]] : row[that.var2];
				}
			})
			return ret;
	}

	getJsonData(){
		return this.json;
	}

	getCSVData(){
		return this.csv;
	}
}