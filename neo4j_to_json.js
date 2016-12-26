var cypher = require('cypher-stream')('bolt://localhost', 'neo4j', 'Gajsa9693#');
var fs = require('fs');

fs.writeFile('data.json', '');
var data = {
	"name": "Java Web Programming",
	"children": []
};
// cypher('match (n:concept), (m:domain) return n,m limit 10')
cypher('MATCH p=(n:concept)<-[:`subconcept of`]->(m) '+ 
		'where NOT ()<-[:`subconcept of`]-(n) set m.size=1 WITH COLLECT(p) AS ps '+
		'CALL apoc.convert.toTree(ps) yield value RETURN value')
	.on('data', function (result){
  		data.children.push(result.value);
	})
	.on('end', function(d) {
		fs.writeFile('data.json', JSON.stringify(data), (err) => {
			if(err)
				console.error(err);
			else
				console.log('File Created: data.json');
		});
	});

