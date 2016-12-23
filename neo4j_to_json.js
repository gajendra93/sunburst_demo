var cypher = require('cypher-stream')('bolt://localhost', 'neo4j', 'Gajsa9693#');
var fs = require('fs');

var data = {
	"name": "Java Web Programming",
	"children": []
	};
cypher('match (n:concept), (m:domain) return n,m limit 10')
	.on('data', function (result){
  		let obj = {};
  		obj["name"] = result.n.name;
  		obj["size"] = 1;
  		data.children.push(obj);
  		fs.writeFile('data.json', JSON.stringify(data), (err) => {
			if(err)
				console.error(err);
			else
				console.log('File Created: data.json');
		});
	})
	.on('end', function(data) {
  		console.log('all done');
	});

