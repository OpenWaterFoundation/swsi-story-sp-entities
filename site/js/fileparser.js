class FileParser {
	constructor(){
		this.csv;
		this.json;
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
						that.json = convertData(data);
					}
				})
			}
		})
		
		function convertData(json){
			var firstValue = json.data[0]
			var year = firstValue["Year"];
			var ret = {"data":[]};
			var data = ret["data"];
			data[year] = {};
			json.data.forEach(function(row){
				var currdate = row["Year"];
				if(year == currdate){
					data[year][row["County"].trim()] = row["Population"];
				}else{
					year = currdate;
					data[year] = {};
					data[year][row["County"].trim()] = row["Population"];
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