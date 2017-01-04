var cypher = require('cypher-stream')('bolt://localhost', 'neo4j', 'charan');
var fs = require('fs');

var result1=[];
var tree = {
    "name": "Java Web Programming",
    "children": []
};

cypher('match (n:Concept) return n.context AS context,n.name AS name,n.conceptid AS conceptid,n.desc as desc,n.parent AS parent')
    .on('data', function (result){
      result1.push(result);
    })
    .on('end', function() {
        console.log('all done');
        var dataMap = result1.reduce(function(map, node) {
            map[node.conceptid] = node;
            return map;
        }, {});
        result1.forEach(function(node) {
            var parent = dataMap[node.parent];
            node.size=1;
            if (parent) {
                (parent.children || (parent.children = []))
                    .push(node);
            } 
            else {
                tree.children.push(node);
            }
        });
    })
    .on('end', function() {
        var p3=JSON.stringify(tree);
        p3=p3.replace("[","[\n\t");
        p3= p3.replace(/},/g,"},\n\t");
        p3= p3.replace(/\\"/g,"");
        p3=p3.replace(/,/g,",\n\t");
        fs.writeFile("data.json",p3,function(err) {
            if(err){
                throw err;
            }
        });
    })

